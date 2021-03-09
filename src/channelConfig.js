module.exports = {
  /**
   * Creates the channel configuration
   */
  channelConfiguration () {
    this.state = {
      audioInputs: [],
      audioOutputs: [],
      rearInputs: [],
      rearOutputs: []
    }

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
  },

  /**
   * Processes and updates a device state and it's variable.
   *
   * @param {string} command The command that corresponds with the function
   * @param {string} channel The channel that needs to update
   * @param {string} value The updated value of the variable
   */
  setState (command, channel, value) {
    let stateChannel

    switch (command) {
      case 'ingn': // Input Gain
        stateChannel = this.state.audioInputs[channel]
        if (stateChannel && stateChannel.gain.currentValue !== value) {
          stateChannel.gain.currentValue = value
          this.setVariable(stateChannel.gain.variable.name, value)
        }
        break

      case 'inmt': // Input Mute
        stateChannel = this.state.audioInputs[channel]
        if (stateChannel && stateChannel.mute.currentValue !== value) {
          stateChannel.mute.currentValue = value
          this.setVariable(stateChannel.mute.variable.name, value === '1' ? 'ON' : 'OFF')
          this.checkFeedbacks('input_mute')
        }
        break

      case 'outgn': // Output Gain
        stateChannel = this.state.audioOutputs[channel]
        if (stateChannel && stateChannel.gain.currentValue !== value) {
          stateChannel.gain.currentValue = value
          this.setVariable(stateChannel.gain.variable.name, value)
        }
        break

      case 'outmt': // Output Mute
        stateChannel = this.state.audioOutputs[channel]
        if (stateChannel && stateChannel.mute.currentValue !== value) {
          stateChannel.mute.currentValue = value
          this.setVariable(stateChannel.mute.variable.name, value === '1' ? 'ON' : 'OFF')
          this.checkFeedbacks('output_mute')
        }
        break

      case 'rpingn': // Rear Panel Input Gain
        stateChannel = this.state.rearInputs[channel]
        if (stateChannel && stateChannel.gain.currentValue !== value) {
          stateChannel.gain.currentValue = value
          this.setVariable(stateChannel.gain.variable.name, value)
        }
        break

      case 'rpoutgn': // Rear Panel Output Gain
        stateChannel = this.state.rearOutputs[channel]
        if (stateChannel && stateChannel.gain.currentValue !== value) {
          stateChannel.gain.currentValue = value
          this.setVariable(stateChannel.gain.variable.name, value)
        }
        break
    }
  }
}
