function createChannelOption(label, max) {
  return {
    type: 'number',
    label,
    id: 'channel',
    default: 1,
    min: 1,
    max,
    range: false,
    clampValues: true,
    asInteger: true
  }
}

function createGainOption(min, max) {
  return {
    type: 'number',
    label: 'Gain',
    id: 'gain',
    default: 0,
    min,
    max,
    range: false,
    clampValues: true,
    asInteger: true
  }
}

function createStepOption() {
  return {
    type: 'number',
    label: 'Gain step',
    id: 'step',
    default: 1,
    min: -6,
    max: 6,
    range: false,
    clampValues: true,
    asInteger: true
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getCurrentGain(stateChannel) {
  if (!stateChannel) return null

  const current = Number(stateChannel.gain.currentValue)
  return Number.isFinite(current) ? current : null
}

function sendStepGain(self, command, stateChannel, channel, step, min, max) {
  const currentGain = getCurrentGain(stateChannel)
  if (currentGain === null) {
    self.queueGainStep(command, channel, Number(step), min, max)
    return
  }

  const nextGain = clamp(currentGain + Number(step), min, max)
  self.sendTcp(`!${command}(${channel})=${nextGain}\n`)
}

module.exports = function updateActions(self) {
  const maxInputChannel = self.data.inputChannels || 105
  const maxOutputChannel = self.data.outputChannels || 105
  const inputChannel = createChannelOption('Input Channel', maxInputChannel)
  const outputChannel = createChannelOption('Output Channel', maxOutputChannel)
  const gain = createGainOption(-70, 60)
  const gainRearPanel = createGainOption(-61, 0)
  const gainStep = createStepOption()

  self.setActionDefinitions({
    input_mute_toggle: {
      name: 'Audio Input - Mute Toggle',
      options: [inputChannel],
      callback: async (event) => {
        self.sendTcp(`!inmttog(${event.options.channel})\n`)
      }
    },
    input_gain: {
      name: 'Audio Input - Set Gain',
      options: [inputChannel, gain],
      callback: async (event) => {
        self.sendTcp(`!ingn(${event.options.channel})=${event.options.gain}\n`)
      }
    },
    input_gain_step: {
      name: 'Audio Input - Step Gain',
      options: [inputChannel, gainStep],
      callback: async (event) => {
        sendStepGain(
          self,
          'ingn',
          self.state.audioInputs[event.options.channel],
          event.options.channel,
          event.options.step,
          -70,
          60
        )
      }
    },
    output_mute_toggle: {
      name: 'Audio Output - Mute Toggle',
      options: [outputChannel],
      callback: async (event) => {
        self.sendTcp(`!outmttog(${event.options.channel})\n`)
      }
    },
    output_gain: {
      name: 'Audio Output - Set Gain',
      options: [outputChannel, gain],
      callback: async (event) => {
        self.sendTcp(`!outgn(${event.options.channel})=${event.options.gain}\n`)
      }
    },
    output_gain_step: {
      name: 'Audio Output - Step Gain',
      options: [outputChannel, gainStep],
      callback: async (event) => {
        sendStepGain(
          self,
          'outgn',
          self.state.audioOutputs[event.options.channel],
          event.options.channel,
          event.options.step,
          -70,
          60
        )
      }
    },
    rear_panel_input_gain: {
      name: 'Rear Panel Input - Set Gain',
      options: [inputChannel, gainRearPanel],
      callback: async (event) => {
        self.sendTcp(`!rpingn(${event.options.channel})=${event.options.gain}\n`)
      }
    },
    rear_panel_input_gain_step: {
      name: 'Rear Panel Input - Step Gain',
      options: [inputChannel, gainStep],
      callback: async (event) => {
        self.sendTcp(`!rpingnst(${event.options.channel})=${event.options.step}\n`)
      }
    },
    rear_panel_output_gain: {
      name: 'Rear Panel Output - Set Gain',
      options: [outputChannel, gainRearPanel],
      callback: async (event) => {
        self.sendTcp(`!rpoutgn(${event.options.channel})=${event.options.gain}\n`)
      }
    },
    rear_panel_output_gain_step: {
      name: 'Rear Panel Output - Step Gain',
      options: [outputChannel, gainStep],
      callback: async (event) => {
        self.sendTcp(`!rpoutgnst(${event.options.channel})=${event.options.step}\n`)
      }
    }
  })
}
