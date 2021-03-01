const Skel = require('../../instance_skel')
const configFields = require('./src/configFields')
const polling = require('./src/polling')
const tcp = require('./src/tcp')

class AspenInstance extends Skel {
  constructor (system, id, config) {
    super(system, id, config)

    this.config = config

    // Assign the methods from the listed files to this class
    Object.assign(this, {
      ...configFields,
      ...tcp,
      ...polling
    })

    this.data = {
      pollingInterval: null
    }

    // Init the TCP connection
    this.initTCP()

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

    // this.initFeedbacks();
    // this.updateVariableDefinitions();
    // this.initPolling();

    this.status(this.STATUS_OK)
  }

  actions (system) {
    this.setActions({
      rear_panel_mute: {
        label: 'Real Panel - Toggle Mute',
        options: [
          {
            type: 'number',
            label: 'Channel',
            id: 'channel',
            tooltip: 'Sets the rear panel channel to control',
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      rear_panel_gain_increment: {
        label: 'Real Panel - Gain Increment'
      }
    })
  }

  action (action) {
    try {
      this.log('info', action.action)
    } catch (err) {
      this.log('error', err.message)
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
