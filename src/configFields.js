const { Regex } = require('@companion-module/base')

module.exports = function getConfigFields() {
  return [
    {
      type: 'static-text',
      id: 'module_info',
      width: 12,
      label: 'Information',
      value: 'This module controls Lectrosonics ASPEN audio processors over TCP.'
    },
    {
      type: 'textinput',
      id: 'host',
      label: 'Target IP',
      width: 8,
      default: '192.168.2.10',
      regex: Regex.IP
    },
    {
      type: 'number',
      id: 'port',
      label: 'Target Port',
      width: 4,
      default: 4080,
      min: 1,
      max: 65535,
      range: false
    },
    {
      type: 'dropdown',
      id: 'device_type',
      label: 'Device Type',
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
      type: 'static-text',
      id: 'polling_info',
      width: 12,
      label: 'Polling',
      value:
        'Enable polling when the ASPEN does not proactively report state changes. The module then refreshes gains and mute states on an interval.'
    },
    {
      type: 'checkbox',
      id: 'enable_polling',
      label: 'Enable Polling',
      width: 6,
      default: true
    },
    {
      type: 'dropdown',
      id: 'polling_rate',
      label: 'Polling Rate',
      width: 6,
      default: 1000,
      choices: [
        { id: 200, label: '200 ms' },
        { id: 300, label: '300 ms' },
        { id: 500, label: '500 ms' },
        { id: 750, label: '750 ms' },
        { id: 1000, label: '1000 ms' },
        { id: 2500, label: '2500 ms' },
        { id: 5000, label: '5000 ms' }
      ]
    }
  ]
}
