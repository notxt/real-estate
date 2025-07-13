import type { GameState } from './main'

export const addActivityLog = (state: GameState, message: string): GameState => {
    const newLog = [message, ...state.activityLog].slice(0, 5)
    return { ...state, activityLog: newLog }
}

export const handleSettingsClick = (state: GameState): GameState => {
    return addActivityLog(state, "Settings panel opened")
}

export const handleHelpClick = (state: GameState): GameState => {
    return addActivityLog(state, "Help documentation opened")
}

export const handleBuyClick = (state: GameState): GameState => {
    return addActivityLog(state, "Attempting to buy property...")
}

export const handleDevelopClick = (state: GameState): GameState => {
    if (state.selectedProperty) {
        return addActivityLog(state, `Developing ${state.selectedProperty.name}`)
    }
    return state
}

export const handleSellClick = (state: GameState): GameState => {
    if (state.selectedProperty) {
        return addActivityLog(state, `Selling ${state.selectedProperty.name}`)
    }
    return state
}

export const handlePassClick = (state: GameState): GameState => {
    const newState = addActivityLog(state, "Turn passed - no action taken")
    const nextTurnState = {
        ...newState,
        turnNumber: newState.turnNumber + 1,
        currentPhase: "Planning Phase"
    }
    return addActivityLog(nextTurnState, `Turn ${nextTurnState.turnNumber.toString()} started`)
}

export const handleNextTurnClick = (state: GameState): GameState => {
    const newState = {
        ...state,
        turnNumber: state.turnNumber + 1,
        currentPhase: "Planning Phase"
    }
    return addActivityLog(newState, `Turn ${newState.turnNumber.toString()} started`)
}

export const handleZoomInClick = (state: GameState): GameState => {
    return addActivityLog(state, "Zoomed in on property grid")
}

export const handleZoomOutClick = (state: GameState): GameState => {
    return addActivityLog(state, "Zoomed out on property grid")
}

export const handleCenterViewClick = (state: GameState): GameState => {
    return addActivityLog(state, "Centered view on property grid")
}

export const handleWindowResize = (state: GameState, width: number, height: number): GameState => {
    return addActivityLog(state, `Window resized to ${width.toString()}x${height.toString()}`)
}