import type { LegacyGameState } from './main.js'

export const addActivityLog = (state: LegacyGameState, message: string): LegacyGameState => {
    const newLog = [message, ...state.activityLog].slice(0, 5)
    return { ...state, activityLog: newLog }
}

export const handleSettingsClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Settings panel opened")
}

export const handleHelpClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Help documentation opened")
}

export const handleBuyClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Attempting to buy property...")
}

export const handleDevelopClick = (state: LegacyGameState): LegacyGameState => {
    if (state.selectedProperty) {
        return addActivityLog(state, `Developing ${state.selectedProperty.name}`)
    }
    return state
}

export const handleSellClick = (state: LegacyGameState): LegacyGameState => {
    if (state.selectedProperty) {
        return addActivityLog(state, `Selling ${state.selectedProperty.name}`)
    }
    return state
}

export const handlePassClick = (state: LegacyGameState): LegacyGameState => {
    const newState = addActivityLog(state, "Turn passed - no action taken")
    const nextTurnState = {
        ...newState,
        turnNumber: newState.turnNumber + 1,
        currentPhase: "Planning Phase"
    }
    return addActivityLog(nextTurnState, `Turn ${nextTurnState.turnNumber.toString()} started`)
}

export const handleNextTurnClick = (state: LegacyGameState): LegacyGameState => {
    const newState = {
        ...state,
        turnNumber: state.turnNumber + 1,
        currentPhase: "Planning Phase"
    }
    return addActivityLog(newState, `Turn ${newState.turnNumber.toString()} started`)
}

export const handleZoomInClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Zoomed in on property grid")
}

export const handleZoomOutClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Zoomed out on property grid")
}

export const handleCenterViewClick = (state: LegacyGameState): LegacyGameState => {
    return addActivityLog(state, "Centered view on property grid")
}

export const handleWindowResize = (state: LegacyGameState, width: number, height: number): LegacyGameState => {
    return addActivityLog(state, `Window resized to ${width.toString()}x${height.toString()}`)
}