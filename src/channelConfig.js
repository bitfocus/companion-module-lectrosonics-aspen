module.exports = {
  /**
   * Creates the channel configuration
   */
  channelConfiguration () {
    this.state = {}

    for (let i = 1; i <= this.data.inputChannels; i++) {
      // Add Audio Input
      this.state.audioInputs[i] = {
        mute: {
          currentValue: undefined,
          variable: {
            label: `Input ${i} - Mute Status`,
            name: `input_mute_status_${i}`
          }
        },
        gain: {
          currentValue: undefined,
          variable: {
            label: `Input ${i} - Gain Value`,
            name: `input_gain_${i}`
          }
        }
      }

      // Add Rear Input
      this.state.rearInputs[i] = {
        gain: {
          currentValue: undefined,
          variable: {
            label: `Rear Panel Input ${i} - Gain Value`,
            name: `rear_panel_input_gain_${i}`
          }
        }
      }
    }

    for (let i = 1; i <= this.data.outputChannels; i++) {
      // Add Audio Output
      this.state.audioOutputs[i] = {
        mute: {
          currentValue: undefined,
          variable: {
            label: `Output ${i} - Mute Status`,
            name: `output_mute_status_${i}`
          }
        },
        gain: {
          currentValue: undefined,
          variable: {
            label: `Output ${i} - Gain Value`,
            name: `output_gain_${i}`
          }
        }
      }

      // Add Rear Output
      this.state.rearOutputs[i] = {
        gain: {
          currentValue: undefined,
          variable: {
            label: `Rear Panel Output ${i} - Gain Value`,
            name: `rear_panel_output_gain_${i}`
          }
        }
      }
    }
  },

  /**
   * Processes and updates a device state and it's variable.
   *
   * @param {string} command The command that corresponds with the function
   * @param {string} channel The channel that needs to update
   * @param {string} value The updated value of the variable
   */
  setState (command, channel, value) {
    switch (command) {
      case 'ingn': // Input Gain
        this.state.audioInputs[channel].gain.currentValue = value
        this.setVariable(this.state.audioInputs[channel].gain.variable.name, value)
        break
      case 'inmt': // Input Mute
        this.state.audioInputs[channel].mute.currentValue = value
        this.setVariable(this.state.audioInputs[channel].mute.variable.name, value === '1' ? 'ON' : 'OFF')
        this.checkFeedbacks('input_mute')
        break
      case 'outgn': // Output Gain
        this.state.audioOutputs[channel].gain.currentValue = value
        this.setVariable(this.state.audioOutputs[channel].gain.variable.name, value)
        break
      case 'outmt': // Output Mute
        this.state.audioOutput[channel].mute.currentValue = value
        this.setVariable(this.state.audioOutput[channel].mute.variable.name, value === '1' ? 'ON' : 'OFF')
        this.checkFeedbacks('output_mute')
        break
      case 'rpingn': // Rear Panel Input Gain
        this.state.rearInputs[channel].gain.currentValue = value
        this.setVariable(this.state.rearInputs[channel].gain.variable.name, value)
        break
      case 'rpoutgn': // Rear Panel Output Gain
        this.state.rearOutputs[channel].gain.currentValue = value
        this.setVariable(this.state.rearOutputs[channel].gain.variable.name, value)
        break
    }
  },

  /**
   * Updates the variable definitions.
   */
  updateVariableDefinitions () {
    const variables = []

    // Add Input Variables
    this.state.audioInputs.forEach(({ mute, gain }) => {
      variables.push(mute.variable)
      variables.push(gain.variable)
    })

    // Add Output Variables
    this.state.audioOutputs.forEach(({ mute, gain }) => {
      variables.push(mute.variable)
      variables.push(gain.variable)
    })

    // Add Rear Panel Input Variables
    this.state.rearInputs.forEach(({ gain }) => {
      variables.push(gain.variable)
    })

    // Add Rear Panel Output Variables
    this.state.rearOutputs.forEach(({ gain }) => {
      variables.push(gain.variable)
    })

    this.setVariableDefinitions(variables)
  }
}
