module.exports = {
  /**
   * Updates the variable definitions.
   */
  updateVariableDefinitions () {
    const variables = []

    // Add Input Variables
    for (let i = 1; i <= this.data.inputChannels; i++) {
      variables.push({
        label: `Input ${i} - Mute Status`,
        name: `input_mute_status_${i}`
      })

      variables.push({
        label: `Input ${i} - Gain Value`,
        name: `input_gain_${i}`
      })
    }

    // Add Output Variables
    for (let i = 1; i <= this.data.outputChannels; i++) {
      variables.push({
        label: `Output ${i} - Mute Status`,
        name: `output_mute_status_${i}`
      })

      variables.push({
        label: `Output ${i} - Gain Value`,
        name: `output_gain_${i}`
      })
    }

    // Add Rear Panel Input Variables
    for (let i = 1; i <= this.data.inputChannels; i++) {
      variables.push({
        label: `Rear Panel Input ${i} - Gain Value`,
        name: `rear_panel_input_gain_${i}`
      })
    }

    // Add Rear Panel Output Variables
    for (let i = 1; i <= this.data.outputChannels; i++) {
      variables.push({
        label: `Rear Panel Output ${i} - Gain Value`,
        name: `rear_panel_output_gain_${i}`
      })
    }

    this.setVariableDefinitions(variables)
  },

  /**
   * Processes and updates a single variable.
   *
   * @param {string} command The command that corresponds with the variable
   * @param {string} channel The channel that needs to update
   * @param {string} value The updated value of the variable
   */
  processVariable (command, channel, value) {
    switch (command) {
      case 'ingn':
        // Send Input Gain Query
        this.setVariable(`input_gain_${channel}`, value)
        break
      case 'inmt':
        // Send Input Mute Query
        this.setVariable(`input_mute_status_${channel}`, value === '1' ? 'ON' : 'OFF')
        break
      case 'outgn':
        // Send Output Gain Query
        this.setVariable(`output_gain_${channel}`, value)
        break
      case 'outmt':
        // Send Output Mute Query
        this.setVariable(`output_mute_status_${channel}`, value === '1' ? 'ON' : 'OFF')
        break
      case 'rpingn':
        // Send Rear Panel Input Gain Query
        this.setVariable(`rear_panel_input_gain_${channel}`, value)
        break
      case 'rpoutgn':
        // Send Rear Panel Input Gain Query
        this.setVariable(`rear_panel_output_gain_${channel}`, value)
        break
    }
  }
}
