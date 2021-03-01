module.exports = {
  config_fields () { // eslint-disable-line camelcase
    return [
      {
        type: 'text',
        id: 'info',
        width: 12,
        label: 'Information',
        value: 'This is the module for the ASPEN Audio Processor by Lectrosonics'
      },
      {
        type: 'textinput',
        id: 'host',
        label: 'Target IP',
        width: 6,
        default: '192.168.2.10',
        regex: this.REGEX_IP
      },
      {
        type: 'number',
        id: 'port',
        label: 'Target Port',
        width: 6,
        default: '4080',
        regex: this.REGEX_PORT
      },
      {
        type: 'text',
        id: 'info',
        width: 12,
        label: 'Polling',
        value: 'When you need your variables to be up to date all the time, you have to enable polling. The module will query the audioprocessor every few seconds for the latest values.'
      },
      {
        type: 'checkbox',
        id: 'enablePolling',
        label: 'Enable Polling?',
        width: 6,
        default: true
      }
    ]
  }
}
