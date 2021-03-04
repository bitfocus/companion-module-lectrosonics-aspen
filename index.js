const Skel = require('../../instance_skel')
const configFields = require('./src/configFields')
const actions = require('./src/actions')
const polling = require('./src/polling')
const tcp = require('./src/tcp')
const variables = require('./src/variables')
const presets = require('./src/presets')

class AspenInstance extends Skel {
  constructor (system, id, config) {
    super(system, id, config)
    this.config = config

    // Assign the methods from the listed files to this class
    Object.assign(this, {
      ...configFields,
      ...actions,
      ...tcp,
      ...polling,
      ...variables,
      ...presets
    })

    // Internal variables
    this.data = {
      deviceModel: null,
      inputChannels: null,
      outputChannels: null,
      pollingInterval: null
    }
  }

  init () {
    this.status(this.STATUS_UNKNOWN)

    // Init the Actions
    this.actions()

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
      this.data.inputChannels = Number(modelSpecs[1])
      this.data.outputChannels = Number(modelSpecs[2])

      // Update Variable Definitions
      this.updateVariableDefinitions()

      // Init the presets
      this.presets()

      // Init the TCP connection
      this.initTCP()

      // Start polling for settingvalues
      this.initPolling()

      // this.initFeedbacks();

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
