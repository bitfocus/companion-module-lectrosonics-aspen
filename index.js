const InstanceSkel = require('../../instance_skel')
const configFields = require('./src/configFields')
const channelConfig = require('./src/channelConfig')
const tcp = require('./src/tcp')
const polling = require('./src/polling')
const actions = require('./src/actions')
const presets = require('./src/presets')
const feedbacks = require('./src/feedbacks')

class AspenInstance extends InstanceSkel {
  constructor (system, id, config) {
    super(system, id, config)
    this.config = config

    // Assign the methods from the listed files to this class
    Object.assign(this, {
      ...configFields,
      ...channelConfig,
      ...tcp,
      ...polling,
      ...actions,
      ...presets,
      ...feedbacks
    })

    // Internal variables
    this.data = {
      deviceModel: null,
      inputChannels: null,
      outputChannels: null,
      pollingInterval: null
    }

    // Internal device state
    this.state = {}
  }

  init () {
    this.status(this.STATUS_UNKNOWN)

    // Init the actions
    this.actions()

    // Update the config
    this.updateConfig()
  }

  updateConfig (config) {
    if (config) {
      this.config = config
    }

    // Quickly check if certain config values are present and continue setup
    if (this.config.host && this.config.device_type) {
      // Extract channelcount from Aspen model
      const modelSpecs = /SPN(8|16|24)(12|24)/.exec(this.config.device_type)

      this.data.deviceModel = modelSpecs[0]
      this.data.inputChannels = Number(modelSpecs[1]) + 4 // 4 channels for testsignals
      this.data.outputChannels = Number(modelSpecs[2])

      // Update the channels and variables based on the selected model.
      this.channelConfiguration()

      // Update Variables
      this.updateVariableDefinitions()

      // Init the presets
      this.presets()

      // Init the TCP connection
      this.initTCP()

      // Start polling for settingvalues
      this.initPolling()

      // Init the feedbacks
      this.feedbacks()

      // Set status to OK
      this.status(this.STATUS_OK)
    }
  }

  destroy () {
    if (this.socket !== undefined) {
      this.socket.destroy()
    }

    this.debug('destroy', this.id)
  }
}

module.exports = AspenInstance
