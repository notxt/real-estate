import { createHeaderBar } from './component/headerBar.js'
import { createCentralArea } from './component/centralArea.js'
import { createActionPanel } from './component/actionPanel.js'
import { createFooterBar, getActionStatusText } from './component/footerBar.js'
import { createElement, formatCurrency } from './util.js'
import { 
    handleSettingsClick, 
    handleHelpClick, 
    handleBuyClick, 
    handleDevelopClick, 
    handleSellClick, 
    handlePassClick, 
    handleNextTurnClick,
    handleZoomInClick,
    handleZoomOutClick,
    handleCenterViewClick,
    handleWindowResize
} from './eventHandlers.js'
import type { GameState } from './types.js'
import { GamePhase } from './types.js'
import { 
    createInitialGameState, 
    validateGameState, 
    saveGameState, 
    loadGameState,
    addToActivityLog
} from './gameState.js'

// Legacy types for backward compatibility
export type LegacyProperty = {
    id: string
    name: string
    price: number
    owner: string | null
    developmentLevel: number
}

export type LegacyGameState = {
    playerName: string
    cash: number
    turnNumber: number
    currentPhase: string
    selectedProperty: LegacyProperty | null
    marketStatus: string
    activityLog: string[]
}

const convertToLegacyState = (gameState: GameState): LegacyGameState => {
    const currentPlayer = gameState.players[0]
    const selectedProperty = gameState.selectedProperty
    
    let legacySelectedProperty: LegacyProperty | null = null
    if (selectedProperty) {
        legacySelectedProperty = {
            id: selectedProperty.id,
            name: selectedProperty.name,
            price: selectedProperty.value,
            owner: selectedProperty.owner,
            developmentLevel: selectedProperty.developmentLevel
        }
    }
    
    return {
        playerName: currentPlayer?.name ?? 'Property Mogul',
        cash: currentPlayer?.cash ?? 0,
        turnNumber: gameState.currentTurn,
        currentPhase: gameState.phase === GamePhase.PropertyAcquisition ? 'Planning Phase' : gameState.phase.replace(/_/g, ' '),
        selectedProperty: legacySelectedProperty,
        marketStatus: gameState.market.trend === 'stable' ? 'Stable' : 
                     gameState.market.trend === 'rising' ? 'Rising' : 'Falling',
        activityLog: gameState.activityLog
    }
}

const createInitialState = (): GameState => {
    const savedState = loadGameState()
    if (!(savedState instanceof Error)) {
        const validation = validateGameState(savedState)
        if (!(validation instanceof Error)) {
            return savedState
        }
    }
    
    return createInitialGameState()
}


const createGameUI = (state: LegacyGameState): DocumentFragment => {
    const fragment = document.createDocumentFragment()
    
    fragment.appendChild(createHeaderBar(state))
    
    const main = createElement("main")
    main.appendChild(createCentralArea())
    main.appendChild(createActionPanel(state))
    fragment.appendChild(main)
    
    fragment.appendChild(createFooterBar(state))
    
    return fragment
}

const updateElement = (id: string, content: string): void => {
    const element = document.getElementById(id)
    if (element !== null) {
        element.textContent = content
    }
}

const updateActivityLog = (state: LegacyGameState): void => {
    const activityLogEl = document.getElementById("activity-log")
    if (activityLogEl !== null) {
        activityLogEl.innerHTML = ""
        state.activityLog.forEach(activity => {
            const item = createElement("div", "activity-item", activity)
            activityLogEl.appendChild(item)
        })
    }
}

const updateDisplay = (state: LegacyGameState): void => {
    updateElement("player-name", state.playerName)
    updateElement("cash-amount", formatCurrency(state.cash))
    updateElement("turn-number", state.turnNumber.toString())
    updateElement("phase-indicator", state.currentPhase)
    updateElement("market-status", state.marketStatus)
    updateElement("action-status", getActionStatusText(state))
    updateActivityLog(state)
}

const addClickListener = (id: string, handler: () => void): void => {
    const element = document.getElementById(id)
    if (element !== null) {
        element.addEventListener("click", handler)
    }
}

const setupHeaderListeners = (state: LegacyGameState, updateState: (newState: LegacyGameState) => void): void => {
    addClickListener("settings-btn", () => { updateState(handleSettingsClick(state)) })
    addClickListener("help-btn", () => { updateState(handleHelpClick(state)) })
}

const setupActionListeners = (state: LegacyGameState, updateState: (newState: LegacyGameState) => void): void => {
    addClickListener("buy-btn", () => { updateState(handleBuyClick(state)) })
    addClickListener("develop-btn", () => { updateState(handleDevelopClick(state)) })
    addClickListener("sell-btn", () => { updateState(handleSellClick(state)) })
    addClickListener("pass-btn", () => { updateState(handlePassClick(state)) })
    addClickListener("next-turn-btn", () => { updateState(handleNextTurnClick(state)) })
}

const setupGridListeners = (state: LegacyGameState, updateState: (newState: LegacyGameState) => void): void => {
    addClickListener("zoom-in", () => { updateState(handleZoomInClick(state)) })
    addClickListener("zoom-out", () => { updateState(handleZoomOutClick(state)) })
    addClickListener("center-view", () => { updateState(handleCenterViewClick(state)) })
}

const setupEventListeners = (state: LegacyGameState, updateState: (newState: LegacyGameState) => void): void => {
    setupHeaderListeners(state, updateState)
    setupActionListeners(state, updateState)
    setupGridListeners(state, updateState)
    
    window.addEventListener("resize", () => {
        const width = window.innerWidth
        const height = window.innerHeight
        updateState(handleWindowResize(state, width, height))
    })
}

const initializeGame = (): void => {
    const app = document.getElementById("app")
    if (app === null) {
        throw new Error("app element not found")
    }
    
    let coreGameState = createInitialState()
    let legacyState = convertToLegacyState(coreGameState)
    
    const updateState = (newLegacyState: LegacyGameState): void => {
        legacyState = newLegacyState
        
        // Auto-save the core game state periodically
        const saveResult = saveGameState(coreGameState)
        if (saveResult instanceof Error) {
            console.warn('Failed to save game state:', saveResult.message)
        }
        
        updateDisplay(legacyState)
    }
    
    const ui = createGameUI(legacyState)
    app.appendChild(ui)
    
    setupEventListeners(legacyState, updateState)
    
    // Validate initial game state
    const validation = validateGameState(coreGameState)
    if (validation instanceof Error) {
        console.error('Invalid initial game state:', validation.message)
        const errorMessage = `Game state error: ${validation.message}`
        coreGameState = addToActivityLog(coreGameState, errorMessage)
        legacyState = convertToLegacyState(coreGameState)
        updateDisplay(legacyState)
    }
}

initializeGame()