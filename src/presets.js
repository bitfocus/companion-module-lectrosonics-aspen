module.exports = {
  presets () {
    const presets = []

    // Add Input Mute Presets
    this.state.audioInputs.forEach(({ mute }, index) => {
      presets.push({
        category: 'Audio Input',
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
    })

    // Add Output Mute Presets
    this.state.audioOutputs.forEach(({ mute }, index) => {
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
    })

    this.setPresetDefinitions(presets)
  }
}
