const { combineRgb } = require('@companion-module/base')

function createStepPreset(name, text, actionId, options, feedbacks = []) {
  return {
    type: 'simple',
    name,
    style: {
      text,
      size: '14',
      color: combineRgb(255, 255, 255),
      bgcolor: combineRgb(0, 0, 0)
    },
    steps: [
      {
        down: [
          {
            actionId,
            options
          }
        ],
        up: []
      }
    ],
    feedbacks
  }
}

module.exports = function updatePresets(self) {
  const presets = {}
  const structure = []
  const inputMutePresets = []
  const inputGainPresets = []
  const outputMutePresets = []
  const outputGainPresets = []
  const rearInputGainPresets = []
  const rearOutputGainPresets = []

  for (let index = 1; index < self.state.audioInputs.length; index++) {
    const mute = self.state.audioInputs[index].mute
    const gain = self.state.audioInputs[index].gain
    const mutePresetId = `input_mute_${index}`
    const gainPresetId = `input_gain_${index}`

    presets[mutePresetId] = createStepPreset(
      `Input ${index} mute`,
      `Input ${index}\nMute $(ASPEN:${mute.variableId})`,
      'input_mute_toggle',
      { channel: index },
      [
        {
          feedbackId: 'input_mute',
          options: {
            bg: combineRgb(255, 65, 54),
            fg: combineRgb(0, 0, 0),
            channel: index
          }
        }
      ]
    )

    presets[gainPresetId] = createStepPreset(
      `Input ${index} gain +2`,
      `Input ${index}\nGain $(ASPEN:${gain.variableId})`,
      'input_gain_step',
      { channel: index, step: 2 }
    )

    inputMutePresets.push(mutePresetId)
    inputGainPresets.push(gainPresetId)
  }

  for (let index = 1; index < self.state.audioOutputs.length; index++) {
    const mute = self.state.audioOutputs[index].mute
    const gain = self.state.audioOutputs[index].gain
    const mutePresetId = `output_mute_${index}`
    const gainPresetId = `output_gain_${index}`

    presets[mutePresetId] = createStepPreset(
      `Output ${index} mute`,
      `Output ${index}\nMute $(ASPEN:${mute.variableId})`,
      'output_mute_toggle',
      { channel: index },
      [
        {
          feedbackId: 'output_mute',
          options: {
            bg: combineRgb(255, 65, 54),
            fg: combineRgb(0, 0, 0),
            channel: index
          }
        }
      ]
    )

    presets[gainPresetId] = createStepPreset(
      `Output ${index} gain +2`,
      `Output ${index}\nGain $(ASPEN:${gain.variableId})`,
      'output_gain_step',
      { channel: index, step: 2 }
    )

    outputMutePresets.push(mutePresetId)
    outputGainPresets.push(gainPresetId)
  }

  for (let index = 1; index < self.state.rearInputs.length; index++) {
    const gain = self.state.rearInputs[index].gain
    const presetId = `rear_input_gain_${index}`

    presets[presetId] = createStepPreset(
      `Rear input ${index} gain +2`,
      `Rear In ${index}\nGain $(ASPEN:${gain.variableId})`,
      'rear_panel_input_gain_step',
      { channel: index, step: 2 }
    )

    rearInputGainPresets.push(presetId)
  }

  for (let index = 1; index < self.state.rearOutputs.length; index++) {
    const gain = self.state.rearOutputs[index].gain
    const presetId = `rear_output_gain_${index}`

    presets[presetId] = createStepPreset(
      `Rear output ${index} gain +2`,
      `Rear Out ${index}\nGain $(ASPEN:${gain.variableId})`,
      'rear_panel_output_gain_step',
      { channel: index, step: 2 }
    )

    rearOutputGainPresets.push(presetId)
  }

  structure.push({
    id: 'audio-inputs',
    name: 'Audio Inputs',
    definitions: [
      {
        id: 'audio-input-mute',
        type: 'simple',
        name: 'Mute',
        presets: inputMutePresets
      },
      {
        id: 'audio-input-gain',
        type: 'simple',
        name: 'Gain +2 dB',
        presets: inputGainPresets
      }
    ]
  })

  structure.push({
    id: 'audio-outputs',
    name: 'Audio Outputs',
    definitions: [
      {
        id: 'audio-output-mute',
        type: 'simple',
        name: 'Mute',
        presets: outputMutePresets
      },
      {
        id: 'audio-output-gain',
        type: 'simple',
        name: 'Gain +2 dB',
        presets: outputGainPresets
      }
    ]
  })

  structure.push({
    id: 'rear-panel',
    name: 'Rear Panel',
    definitions: [
      {
        id: 'rear-panel-input-gain',
        type: 'simple',
        name: 'Input Gain +2 dB',
        presets: rearInputGainPresets
      },
      {
        id: 'rear-panel-output-gain',
        type: 'simple',
        name: 'Output Gain +2 dB',
        presets: rearOutputGainPresets
      }
    ]
  })

  self.setPresetDefinitions(structure, presets)
}
