const inputChannel = {
  type: 'number',
  label: 'Input Channel',
  id: 'channel',
  tooltip: 'Enter the Input Channel',
  default: 1,
  min: 1,
  max: 105,
  required: true,
  range: false
}

const outputChannel = {
  type: 'number',
  label: 'Output Channel',
  id: 'channel',
  tooltip: 'Enter the Output Channel',
  default: 1,
  min: 1,
  max: 105,
  required: true,
  range: false
}

const gain = {
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

const gainRearPanel = {
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

const gainStep = {
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

module.exports = {
  actions (system) {
    this.setActions({
      input_mute_toggle: {
        label: 'Audio Input - Mute Toggle',
        options: [
          inputChannel
        ]
      },
      input_gain: {
        label: 'Audio Input - Set Gain',
        options: [
          inputChannel,
          gain
        ]
      },
      output_mute_toggle: {
        label: 'Audio Output - Mute Toggle',
        options: [
          outputChannel
        ]
      },
      output_gain: {
        label: 'Audio Output - Set Gain',
        options: [
          outputChannel,
          gain
        ]
      },
      rear_panel_input_gain: {
        label: 'Rear Panel Input - Set Gain',
        options: [
          inputChannel,
          gainRearPanel
        ]
      },
      rear_panel_input_gain_step: {
        label: 'Rear Panel Input - Step Gain',
        options: [
          inputChannel,
          gainStep
        ]
      },
      rear_panel_output_gain: {
        label: 'Rear Panel Output - Set Gain',
        options: [
          outputChannel,
          gainRearPanel
        ]
      },
      rear_panel_output_gain_step: {
        label: 'Rear Panel Output - Step Gain',
        options: [
          outputChannel,
          gainStep
        ]
      }
    })
  },

  action ({ action, options }) {
    this.log('info', `Running action: ${action}`)

    try {
      switch (action) {
        case 'input_gain':
          this.sendTCP(`!ingn(${options.channel})=${options.gain}\n`)
          break
        case 'input_mute_toggle':
          this.sendTCP(`!inmttog(${options.channel})\n`)

          // Update mute state directly
          this.setState('inmt', options.channel, this.state.audioInputs[options.channel].mute.currentValue === '0' ? '1' : '0')
          break
        case 'output_gain':
          this.sendTCP(`!outgn(${options.channel})=${options.gain}\n`)
          break
        case 'output_mute_toggle':
          this.sendTCP(`!outmttog(${options.channel})\n`)

          // Update mute state directly
          this.setState('outmt', options.channel, this.state.audioOutputs[options.channel].mute.currentValue === '0' ? '1' : '0')
          break
        case 'rear_panel_input_gain':
          this.sendTCP(`!rpingn(${options.channel})=${options.gain}\n`)
          break
        case 'rear_panel_input_gain_step':
          this.sendTCP(`!rpingnst(${options.channel})=${options.step}\n`)
          break
        case 'rear_panel_output_gain':
          this.sendTCP(`!rpoutgn(${options.channel})=${options.gain}\n`)
          break
        case 'rear_panel_output_gain_step':
          this.sendTCP(`!rpoutgnst(${options.channel})=${options.step}\n`)
          break
      }
    } catch (err) {
      this.log('error', err.message)
    }
  }
}
