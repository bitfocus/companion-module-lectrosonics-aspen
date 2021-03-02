module.exports = {
  actions (system) {
    const optionChannel = {
      type: 'number',
      label: 'Channel',
      id: 'channel',
      tooltip: 'Enter the input channel or input group',
      default: 0,
      min: 0,
      max: 256,
      required: true,
      range: false
    }

    this.setActions({
      input_mute_toggle: {
        label: 'Audio Input - Mute Toggle',
        options: [
          optionChannel
        ]
      },
      input_gain: {
        label: 'Audio Input - Set Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain',
            id: 'gain',
            tooltip: 'Enter the gain amount',
            min: -70,
            max: 60,
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      output_mute_toggle: {
        label: 'Audio Output - Mute Toggle',
        options: [
          optionChannel
        ]
      },
      output_gain: {
        label: 'Audio Output - Set Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain',
            id: 'gain',
            tooltip: 'Enter the gain amount',
            min: -70,
            max: 60,
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      rear_panel_input_gain: {
        label: 'Rear Panel Input - Set Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain',
            id: 'gain',
            tooltip: 'Enter the gain amount',
            min: -61,
            max: 0,
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      rear_panel_input_gain_step: {
        label: 'Rear Panel Input - Step Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain step',
            id: 'step',
            tooltip: 'Enter the gain step amount',
            min: -6,
            max: 6,
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      rear_panel_output_gain: {
        label: 'Rear Panel Output - Set Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain',
            id: 'gain',
            tooltip: 'Enter the gain amount',
            min: -61,
            max: 0,
            default: 0,
            required: true,
            range: false
          }
        ]
      },
      rear_panel_output_gain_step: {
        label: 'Rear Panel Output - Step Gain',
        options: [
          optionChannel,
          {
            type: 'number',
            label: 'Gain step',
            id: 'step',
            tooltip: 'Enter the gain step amount',
            min: -6,
            max: 6,
            default: 0,
            required: true,
            range: false
          }
        ]
      }
    })
  },

  action (action) {
    this.log('info', `Running action: ${action.action}`)

    try {
      switch (action.action) {
        case 'input_gain':
          this.sendTCP(`ingn(${action.options.channel})=${action.options.gain}\n`)
          break
        case 'input_mute_toggle':
          this.sendTCP(`inmttog(${action.options.channel})\n`)
          break
        case 'output_gain':
          this.sendTCP(`outgn(${action.options.channel})=${action.options.gain}\n`)
          break
        case 'output_mute_toggle':
          this.sendTCP(`outmttog(${action.options.channel})\n`)
          break
        case 'rear_panel_input_gain':
          this.sendTCP(`rpingn(${action.options.channel})=${action.options.gain}\n`)
          break
        case 'rear_panel_input_gain_step':
          this.sendTCP(`rpingnst(${action.options.channel})=${action.options.step}\n`)
          break
        case 'rear_panel_output_gain':
          this.sendTCP(`rpoutgn(${action.options.channel})=${action.options.gain}\n`)
          break
        case 'rear_panel_output_gain_step':
          this.sendTCP(`rpoutgnst(${action.options.channel})=${action.options.step}\n`)
          break
      }
    } catch (err) {
      this.log('error', err.message)
    }
  }
}
