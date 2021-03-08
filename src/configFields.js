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
        type: 'dropdown',
        label: 'Device Type',
        id: 'device_type',
        width: 12,
        default: 'SPN812',
        choices: [
          { id: 'SPN812', label: 'SPN812' },
          { id: 'SPN1612', label: 'SPN1612' },
          { id: 'SPN1624', label: 'SPN1624' },
          { id: 'SPN2412', label: 'SPN2412' }
        ]
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
        id: 'enable_polling',
        label: 'Enable Polling?',
        width: 6,
        default: true
      },
      {
        type: 'dropdown',
        label: 'Polling Rate',
        id: 'polling_rate',
        width: 6,
        default: 1000,
        choices: [
          { id: 200, label: '200ms' },
          { id: 300, label: '300ms' },
          { id: 500, label: '500ms' },
          { id: 750, label: '750ms' },
          { id: 1000, label: '1000ms' },
          { id: 2500, label: '2500ms' },
          { id: 5000, label: '5000ms' }
        ]
      }
    ]
  }
}
