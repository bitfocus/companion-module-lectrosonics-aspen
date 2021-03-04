module.exports = {
  presets () {
    const presets = []

    // Add Input Mute Presets
    for (let i = 1; i <= this.data.inputChannels; i++) {
      presets.push({
        category: 'Audio Input',
        label: `input_mute_${i}`,
        bank: {
          style: 'text',
          text: `Mute Input ${i}`,
          size: '18',
          color: this.rgb(255, 255, 255),
          bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
          action: 'input_mute_toggle',
          options: {
            channel: i
          }
        }]
      })
    }

    this.setPresetDefinitions(presets)
  }
}
