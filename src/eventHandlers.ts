// @HANDLERS: Game event handlers for user interactions
import type { GameState } from './types.js'
import { addToActivityLog, advanceTurn } from './gameState.js'
import { processTransaction } from './financial.js'
import { purchaseProperty, sellProperty } from './propertyTransactions.js'

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
    if (!state.selectedProperty) {
        return addActivityLogToState(state, "Error: No property selected for purchase")
    }
    
    const currentPlayer = state.players[0]
    if (!currentPlayer) {
        return addActivityLogToState(state, "Error: No active player found")
    }
    
    const result = purchaseProperty(state, currentPlayer.id, state.selectedProperty.id)
    if (result instanceof Error) {
        return addActivityLogToState(state, `Purchase failed: ${result.message}`)
    }
    
    const logMessage = `${currentPlayer.name} purchased ${result.purchase.property.name} for $${result.purchase.property.value.toLocaleString()}`
    return addActivityLogToState(result.gameState, logMessage)
}

export const handleDevelopClick = (state: GameState): GameState => {
    if (!state.selectedProperty) {
        return addActivityLogToState(state, "Error: No property selected for development")
    }
    
    const currentPlayer = state.players[0]
    if (!currentPlayer) {
        return addActivityLogToState(state, "Error: No active player found")
    }
    
    if (state.selectedProperty.owner !== currentPlayer.id) {
        return addActivityLogToState(state, "Error: Cannot develop property you don't own")
    }
    
    const developmentCost = state.selectedProperty.developmentCost
    const result = processTransaction(state, currentPlayer.id, {
        type: 'expense',
        amount: developmentCost,
        description: `Development of ${state.selectedProperty.name}`,
        relatedPropertyId: state.selectedProperty.id
    })
    
    if (result instanceof Error) {
        return addActivityLogToState(state, `Development failed: ${result.message}`)
    }
    
    const logMessage = `${currentPlayer.name} developed ${state.selectedProperty.name} for $${developmentCost.toLocaleString()}`
    return addActivityLogToState(result.gameState, logMessage)
}

export const handleSellClick = (state: GameState): GameState => {
    if (!state.selectedProperty) {
        return addActivityLogToState(state, "Error: No property selected for sale")
    }
    
    const currentPlayer = state.players[0]
    if (!currentPlayer) {
        return addActivityLogToState(state, "Error: No active player found")
    }
    
    if (state.selectedProperty.owner !== currentPlayer.id) {
        return addActivityLogToState(state, "Error: Cannot sell property you don't own")
    }
    
    const result = sellProperty(state, currentPlayer.id, state.selectedProperty.id)
    if (result instanceof Error) {
        return addActivityLogToState(state, `Sale failed: ${result.message}`)
    }
    
    const logMessage = `${currentPlayer.name} sold ${state.selectedProperty.name} for $${result.sale.transaction.amount.toLocaleString()}`
    return addActivityLogToState(result.gameState, logMessage)
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