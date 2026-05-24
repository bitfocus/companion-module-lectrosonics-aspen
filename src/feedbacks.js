const { combineRgb } = require('@companion-module/base')

function createChannelOption(label, max) {
  return {
    type: 'number',
    label,
    id: 'channel',
    default: 1,
    min: 1,
    max,
    range: false,
    clampValues: true,
    asInteger: true
  }
}

module.exports = function updateFeedbacks(self) {
  const maxInputChannel = self.data.inputChannels || 105
  const maxOutputChannel = self.data.outputChannels || 105

  self.setFeedbackDefinitions({
    input_mute: {
      type: 'advanced',
      name: 'Input channel is muted',
      description: 'Changes the colors when a defined input channel is muted.',
      options: [
        {
          type: 'colorpicker',
          label: 'Foreground color',
          id: 'fg',
          default: combineRgb(0, 0, 0)
        },
        {
          type: 'colorpicker',
          label: 'Background color',
          id: 'bg',
          default: combineRgb(255, 65, 54)
        },
        createChannelOption('Input channel', maxInputChannel)
      ],
      callback: (feedback) => {
        const status = self.state.audioInputs[feedback.options.channel]?.mute.currentValue
        return status === '1' ? { color: feedback.options.fg, bgcolor: feedback.options.bg } : {}
      }
    },
    output_mute: {
      type: 'advanced',
      name: 'Output channel is muted',
      description: 'Changes the colors when a defined output channel is muted.',
      options: [
        {
          type: 'colorpicker',
          label: 'Foreground color',
          id: 'fg',
          default: combineRgb(0, 0, 0)
        },
        {
          type: 'colorpicker',
          label: 'Background color',
          id: 'bg',
          default: combineRgb(255, 65, 54)
        },
        createChannelOption('Output channel', maxOutputChannel)
      ],
      callback: (feedback) => {
        const status = self.state.audioOutputs[feedback.options.channel]?.mute.currentValue
        return status === '1' ? { color: feedback.options.fg, bgcolor: feedback.options.bg } : {}
      }
    }
  })
}
