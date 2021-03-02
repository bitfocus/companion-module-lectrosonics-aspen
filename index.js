const Skel = require('../../instance_skel')
const configFields = require('./src/configFields')
const actions = require('./src/actions')
const polling = require('./src/polling')
const tcp = require('./src/tcp')

class AspenInstance extends Skel {
  constructor (system, id, config) {
    super(system, id, config)

    this.config = config

    // Assign the methods from the listed files to this class
    Object.assign(this, {
      ...configFields,
      ...actions,
      ...tcp,
      ...polling
    })

    this.data = {
      pollingInterval: null
    }

    // Init the Actions
    this.actions()
  }

  init () {
    this.status(this.STATUS_UNKNOWN)
    this.updateConfig()
  }

  updateConfig (config) {
    if (config) {
      this.config = config
    }

    // Init the TCP connection
    this.initTCP()

    // this.initFeedbacks();
    // this.updateVariableDefinitions();
    // this.initPolling();

    this.status(this.STATUS_OK)
  }

  destroy () {
    if (this.socket !== undefined) {
      this.socket.destroy()
    }

    this.debug('destroy', this.id)
  }
}

module.exports = AspenInstance
