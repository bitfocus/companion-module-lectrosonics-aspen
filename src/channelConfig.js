function createGainVariable(name, label) {
  return {
    currentValue: undefined,
    variableId: name,
    variableName: label
  }
}

function createMuteVariable(name, label) {
  return {
    currentValue: undefined,
    variableId: name,
    variableName: label
  }
}

function createState(inputChannels, outputChannels) {
  const state = {
    audioInputs: new Array(inputChannels + 1),
    audioOutputs: new Array(outputChannels + 1),
    rearInputs: new Array(inputChannels + 1),
    rearOutputs: new Array(outputChannels + 1)
  }

  for (let i = 1; i <= inputChannels; i++) {
    state.audioInputs[i] = {
      mute: createMuteVariable(`input_mute_status_${i}`, `Input ${i} - Mute Status`),
      gain: createGainVariable(`input_gain_${i}`, `Input ${i} - Gain Value`)
    }

    state.rearInputs[i] = {
      gain: createGainVariable(`rear_panel_input_gain_${i}`, `Rear Panel Input ${i} - Gain Value`)
    }
  }

  for (let i = 1; i <= outputChannels; i++) {
    state.audioOutputs[i] = {
      mute: createMuteVariable(`output_mute_status_${i}`, `Output ${i} - Mute Status`),
      gain: createGainVariable(`output_gain_${i}`, `Output ${i} - Gain Value`)
    }

    state.rearOutputs[i] = {
      gain: createGainVariable(`rear_panel_output_gain_${i}`, `Rear Panel Output ${i} - Gain Value`)
    }
  }

  return state
}

function getVariableDefinitions(state) {
  const definitions = {}

  for (let i = 1; i < state.audioInputs.length; i++) {
    definitions[state.audioInputs[i].mute.variableId] = { name: state.audioInputs[i].mute.variableName }
    definitions[state.audioInputs[i].gain.variableId] = { name: state.audioInputs[i].gain.variableName }
    definitions[state.rearInputs[i].gain.variableId] = { name: state.rearInputs[i].gain.variableName }
  }

  for (let i = 1; i < state.audioOutputs.length; i++) {
    definitions[state.audioOutputs[i].mute.variableId] = { name: state.audioOutputs[i].mute.variableName }
    definitions[state.audioOutputs[i].gain.variableId] = { name: state.audioOutputs[i].gain.variableName }
    definitions[state.rearOutputs[i].gain.variableId] = { name: state.rearOutputs[i].gain.variableName }
  }

  return definitions
}

function applyState(self, command, channel, value) {
  let target
  let nextVariableValue
  let feedbackId

  switch (command) {
    case 'ingn':
      target = self.state.audioInputs[channel]?.gain
      nextVariableValue = value
      break
    case 'inmt':
      target = self.state.audioInputs[channel]?.mute
      nextVariableValue = value === '1' ? 'ON' : 'OFF'
      feedbackId = 'input_mute'
      break
    case 'outgn':
      target = self.state.audioOutputs[channel]?.gain
      nextVariableValue = value
      break
    case 'outmt':
      target = self.state.audioOutputs[channel]?.mute
      nextVariableValue = value === '1' ? 'ON' : 'OFF'
      feedbackId = 'output_mute'
      break
    case 'rpingn':
      target = self.state.rearInputs[channel]?.gain
      nextVariableValue = value
      break
    case 'rpoutgn':
      target = self.state.rearOutputs[channel]?.gain
      nextVariableValue = value
      break
    default:
      return
  }

  if (!target || target.currentValue === value) {
    return
  }

  target.currentValue = value
  self.setVariableValues({
    [target.variableId]: nextVariableValue
  })

  if (feedbackId) {
    self.checkFeedbacks(feedbackId)
  }
}

module.exports = {
  createState,
  getVariableDefinitions,
  applyState
}
