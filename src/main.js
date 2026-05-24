const { InstanceBase, InstanceStatus, TCPHelper } = require('@companion-module/base')
const getConfigFields = require('./configFields')
const updateActions = require('./actions')
const updateFeedbacks = require('./feedbacks')
const updatePresets = require('./presets')
const { createState, getVariableDefinitions, applyState } = require('./channelConfig')

function parseModel(deviceType) {
  const modelSpecs = /^SPN(8|16|24)(12|24)$/.exec(deviceType || '')
  if (!modelSpecs) return null

  return {
    deviceModel: modelSpecs[0],
    inputChannels: Number(modelSpecs[1]) + 4,
    outputChannels: Number(modelSpecs[2])
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

module.exports = class AspenInstance extends InstanceBase {
  constructor(internal) {
    super(internal)

    this.config = {}
    this.socket = undefined
    this.pollingInterval = undefined
    this.receiveBuffer = ''
    this.data = {
      deviceModel: null,
      inputChannels: 0,
      outputChannels: 0
    }
    this.pendingGainSteps = {
      ingn: new Map(),
      outgn: new Map()
    }
    this.state = createState(0, 0)
  }

  async init(config) {
    await this.configUpdated(config)
  }

  async destroy() {
    this.stopPolling()
    this.destroySocket()
    this.log('debug', 'destroy')
  }

  async configUpdated(config) {
    this.config = config || {}
    this.stopPolling()
    this.destroySocket()
    this.pendingGainSteps.ingn.clear()
    this.pendingGainSteps.outgn.clear()

    const model = parseModel(this.config.device_type)
    if (!this.config.host || !model) {
      this.data = {
        deviceModel: null,
        inputChannels: 0,
        outputChannels: 0
      }
      this.state = createState(0, 0)
      this.updateActions()
      this.updateFeedbacks()
      this.updateVariableDefinitions()
      this.updatePresets()
      this.updateStatus(InstanceStatus.BadConfig, 'Configure a host and device type')
      return
    }

    this.data = model
    this.state = createState(model.inputChannels, model.outputChannels)

    this.updateActions()
    this.updateFeedbacks()
    this.updateVariableDefinitions()
    this.updatePresets()
    this.initTcp()
    this.initPolling()
  }

  getConfigFields() {
    return getConfigFields()
  }

  updateActions() {
    updateActions(this)
  }

  updateFeedbacks() {
    updateFeedbacks(this)
  }

  updatePresets() {
    updatePresets(this)
  }

  updateVariableDefinitions() {
    this.setVariableDefinitions(getVariableDefinitions(this.state))
  }

  initTcp() {
    const port = Number(this.config.port)
    this.receiveBuffer = ''
    this.socket = new TCPHelper(this.config.host, port)

    this.socket.on('connect', () => {
      this.log('debug', `Connected to ${this.config.host}:${port}`)
      this.pollDeviceState()
    })

    this.socket.on('status_change', (status, message) => {
      this.updateStatus(status, message)
    })

    this.socket.on('error', (error) => {
      this.log('error', `Network error: ${error.message}`)
    })

    this.socket.on('data', (data) => {
      this.receiveBuffer += data.toString()

      const messages = this.receiveBuffer.split('\r\n')
      this.receiveBuffer = messages.pop() || ''

      for (const message of messages) {
        const trimmed = message.trim()
        if (trimmed) {
          this.processData(trimmed)
        }
      }
    })
  }

  destroySocket() {
    if (!this.socket) return

    this.socket.destroy()
    this.socket = undefined
    this.receiveBuffer = ''
  }

  stopPolling() {
    if (!this.pollingInterval) return

    clearInterval(this.pollingInterval)
    this.pollingInterval = undefined
  }

  initPolling() {
    if (!this.config.enable_polling) return

    const intervalMs = Number(this.config.polling_rate) || 1000
    this.pollingInterval = setInterval(() => {
      this.pollDeviceState()
    }, intervalMs)
  }

  pollDeviceState() {
    this.sendTcp('!ingn(*)?\n', false)
    this.sendTcp('!inmt(*)?\n', false)
    this.sendTcp('!outgn(*)?\n', false)
    this.sendTcp('!outmt(*)?\n', false)
    this.sendTcp('!rpingn(*)?\n', false)
    this.sendTcp('!rpoutgn(*)?\n', false)
  }

  queueGainStep(command, channel, step, min, max) {
    const pendingSteps = this.pendingGainSteps[command]
    if (!pendingSteps) {
      this.log('warn', `Cannot queue gain step for unsupported command ${command}`)
      return
    }

    const pendingStep = pendingSteps.get(channel) || { delta: 0, min, max }
    pendingStep.delta += Number(step)
    pendingStep.min = min
    pendingStep.max = max
    pendingSteps.set(channel, pendingStep)

    this.log('debug', `Queued ${command} step ${step} for channel ${channel} until the current gain is known`)
    this.sendTcp(`!${command}(${channel})?\n`, false)
  }

  processPendingGainStep(command, channel) {
    const pendingSteps = this.pendingGainSteps[command]
    const pendingStep = pendingSteps?.get(channel)
    if (!pendingStep) return

    const stateChannel = command === 'ingn' ? this.state.audioInputs[channel] : this.state.audioOutputs[channel]
    const currentGain = Number(stateChannel?.gain.currentValue)
    if (!Number.isFinite(currentGain)) return

    pendingSteps.delete(channel)

    const nextGain = clamp(currentGain + pendingStep.delta, pendingStep.min, pendingStep.max)
    this.log('debug', `Applying queued ${command} step ${pendingStep.delta} for channel ${channel}`)
    this.sendTcp(`!${command}(${channel})=${nextGain}\n`)
  }

  sendTcp(payload, log = true) {
    if (!this.socket) {
      this.log('warn', `Dropped command without active socket: ${payload.trim()}`)
      return false
    }

    if (log) {
      this.log('debug', `Sending ${payload.trim()} to ${this.config.host}:${this.config.port}`)
    }

    return this.socket.send(payload)
  }

  processData(message) {
    const match = /^(OK|ERROR)(?: (.*)\((.*)\)=(.*))?$/.exec(message)
    if (!match) {
      this.log('warn', `Unrecognised response from device: ${message}`)
      return
    }

    const [, status, command, channel, value] = match

    if (status === 'ERROR') {
      this.updateStatus(InstanceStatus.ConnectionFailure, `Device error: ${message}`)
      this.log('warn', `Device returned an error: ${message}`)
      return
    }

    if (!command || !channel || value === undefined) {
      return
    }

    if (channel === '*') {
      const values = value.substring(1, value.length - 1).split(',')
      for (let i = 0; i < values.length; i++) {
        applyState(this, command, i + 1, values[i])
        this.processPendingGainStep(command, i + 1)
      }
      return
    }

    if (/^\d+$/.test(channel)) {
      const channelNumber = Number(channel)
      applyState(this, command, channelNumber, value)
      this.processPendingGainStep(command, channelNumber)
    }
  }
}
