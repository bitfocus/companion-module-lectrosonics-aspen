module.exports = {
  presets () {
    const presets = []

    // Add Input Mute Presets
    this.state.audioInputs.forEach(({ mute, gain }, index) => {
      presets.push({
        category: 'Audio Input Mute',
        label: `input_mute_${index}`,
        bank: {
          style: 'text',
          text: `Input ${index}\\nMute $(ASPEN:${mute.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'input_mute_toggle',
          options: {
            channel: index
          }
        }],
        feedbacks: [{
          type: 'input_mute',
          options: {
            bg: this.rgb(255, 65, 54),
            fg: this.rgb(0, 0, 0),
            channel: index
          }
        }]
      })

      presets.push({
        category: 'Audio Input Gain',
        label: `input_gain_${index}`,
        bank: {
          style: 'text',
          text: `Input ${index}\\nGain $(ASPEN:${gain.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'input_gain_step',
          options: {
            channel: index
          }
        }]
      })
    })

    // Add Output Mute Presets
    this.state.audioOutputs.forEach(({ mute, gain }, index) => {
      presets.push({
        category: 'Audio Output',
        label: `output_mute_${index}`,
        bank: {
          style: 'text',
          text: `Output ${index}\\nMute $(ASPEN:${mute.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'output_mute_toggle',
          options: {
            channel: index
          }
        }],
        feedbacks: [{
          type: 'output_mute',
          options: {
            bg: this.rgb(255, 65, 54),
            fg: this.rgb(0, 0, 0),
            channel: index
          }
        }]
      })

      presets.push({
        category: 'Audio Output Gain',
        label: `output_gain_${index}`,
        bank: {
          style: 'text',
          text: `Output ${index}\\nGain $(ASPEN:${gain.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'output_gain_step',
          options: {
            channel: index
          }
        }]
      })
    })

    // Add Rear Panel Input Gain Presets
    this.state.rearInputs.forEach(({ gain }, index) => {
      presets.push({
        category: 'Rear Panel Input Gain',
        label: `rear_input_gain_${index}`,
        bank: {
          style: 'text',
          text: `Rear In ${index}\\nGain $(ASPEN:${gain.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'rear_panel_input_gain_step',
          options: {
            channel: index,
            gain: '2'
          }
        }]
      })
    })

    // Add Rear Panel Output Gain Presets
    this.state.rearOutputs.forEach(({ gain }, index) => {
      presets.push({
        category: 'Rear Panel Output Gain',
        label: `rear_output_gain_${index}`,
        bank: {
          style: 'text',
          text: `Rear Out ${index}\\nGain $(ASPEN:${gain.variable.name})`,
          size: '14',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'rear_panel_output_gain_step',
          options: {
            channel: index,
            gain: '2'
          }
        }]
      })
    })

    this.setPresetDefinitions(presets)
  }
}
