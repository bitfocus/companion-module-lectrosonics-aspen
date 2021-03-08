module.exports = {
  feedbacks () {
    const feedbacks = {}

    // Add Input Mute Feedback
    feedbacks.input_mute = {
      label: 'Input channel is muted',
      description: 'Changes the colors when a defined input channel is muted.',
      options: [{
        type: 'colorpicker',
        label: 'Foreground color',
        id: 'fg',
        default: this.rgb(0, 0, 0)
      }, {
        type: 'colorpicker',
        label: 'Background color',
        id: 'bg',
        default: this.rgb(255, 65, 54)
      }, {
        type: 'number',
        label: 'Input channel',
        id: 'channel',
        default: 1,
        min: 1,
        max: 105
      }]
    }

    // Add Input Mute Feedback
    feedbacks.output_mute = {
      label: 'Output channel is muted',
      description: 'Changes the colors when a defined output channel is muted.',
      options: [{
        type: 'colorpicker',
        label: 'Foreground color',
        id: 'fg',
        default: this.rgb(0, 0, 0)
      }, {
        type: 'colorpicker',
        label: 'Background color',
        id: 'bg',
        default: this.rgb(255, 65, 54)
      }, {
        type: 'number',
        label: 'Output channel',
        id: 'channel',
        default: 1,
        min: 1,
        max: 105
      }]
    }

    this.setFeedbackDefinitions(feedbacks)
  },

  feedback ({ type, options }) {
    let status = '0'

    switch (type) {
      case 'input_mute':
        status = this.state.audioInputs[options.channel].mute.currentValue
        break
      case 'output_mute':
        status = this.state.audioOutputs[options.channel].mute.currentValue
        break
    }

    if (status === '1') {
      return { color: options.fg, bgcolor: options.bg }
    }

    return {}
  }
}
