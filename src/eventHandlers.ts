// @HANDLERS: Game event handlers for user interactions
import type { GameState } from './types.js'
import { addToActivityLog, advanceTurn } from './gameState.js'

// @HELPERS: State update helpers
const addActivityLogToState = (state: GameState, message: string): GameState => {
    return addToActivityLog(state, message)
}

// @HEADER: Header button handlers
export const handleSettingsClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Settings panel opened")
}

export const handleHelpClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Help documentation opened")
}

// @ACTIONS: Property action handlers
export const handleBuyClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Attempting to buy property...")
}

export const handleDevelopClick = (state: GameState): GameState => {
    if (state.selectedProperty) {
        return addActivityLogToState(state, `Developing ${state.selectedProperty.name}`)
    }
    return state
}

export const handleSellClick = (state: GameState): GameState => {
    if (state.selectedProperty) {
        return addActivityLogToState(state, `Selling ${state.selectedProperty.name}`)
    }
    return state
}

export const handlePassClick = (state: GameState): GameState => {
    const withPassLog = addActivityLogToState(state, "Turn passed - no action taken")
    const advancedState = advanceTurn(withPassLog)
    return addActivityLogToState(advancedState, `Turn ${advancedState.currentTurn.toString()} started`)
}

export const handleNextTurnClick = (state: GameState): GameState => {
    const advancedState = advanceTurn(state)
    return addActivityLogToState(advancedState, `Turn ${advancedState.currentTurn.toString()} started`)
}

// @GRID: Grid interaction handlers
export const handleZoomInClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Zoomed in on property grid")
}

export const handleZoomOutClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Zoomed out on property grid")
}

export const handleCenterViewClick = (state: GameState): GameState => {
    return addActivityLogToState(state, "Centered view on property grid")
}

// @WINDOW: Window event handlers
export const handleWindowResize = (state: GameState, width: number, height: number): GameState => {
    return addActivityLogToState(state, `Window resized to ${width.toString()}x${height.toString()}`)
}