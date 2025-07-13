// @MAIN: Main game initialization and UI orchestration
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
import { 
    createInitialGameState, 
    validateGameState, 
    saveGameState, 
    loadGameState,
    addToActivityLog
} from './gameState.js'

// @INIT: Game initialization helpers
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


// @UI: UI creation and management
const createGameUI = (state: GameState): DocumentFragment => {
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

const updateActivityLog = (state: GameState): void => {
    const activityLogEl = document.getElementById("activity-log")
    if (activityLogEl !== null) {
        activityLogEl.innerHTML = ""
        state.activityLog.forEach(activity => {
            const item = createElement("div", "activity-item", activity)
            activityLogEl.appendChild(item)
        })
    }
}

const updateDisplay = (state: GameState): void => {
    const currentPlayer = state.players[0]
    if (!currentPlayer) {
        console.error('No players found in game state')
        return
    }
    
    updateElement("player-name", currentPlayer.name)
    updateElement("cash-amount", formatCurrency(currentPlayer.cash))
    updateElement("turn-number", state.currentTurn.toString())
    updateElement("phase-indicator", state.phase.replace(/_/g, ' '))
    updateElement("market-status", state.market.trend)
    updateElement("action-status", getActionStatusText(state))
    updateActivityLog(state)
}

const addClickListener = (id: string, handler: () => void): void => {
    const element = document.getElementById(id)
    if (element !== null) {
        element.addEventListener("click", handler)
    }
}

// @EVENTS: Event listener setup
const setupHeaderListeners = (state: GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("settings-btn", () => { updateState(handleSettingsClick(state)) })
    addClickListener("help-btn", () => { updateState(handleHelpClick(state)) })
}

const setupActionListeners = (state: GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("buy-btn", () => { updateState(handleBuyClick(state)) })
    addClickListener("develop-btn", () => { updateState(handleDevelopClick(state)) })
    addClickListener("sell-btn", () => { updateState(handleSellClick(state)) })
    addClickListener("pass-btn", () => { updateState(handlePassClick(state)) })
    addClickListener("next-turn-btn", () => { updateState(handleNextTurnClick(state)) })
}

const setupGridListeners = (state: GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("zoom-in", () => { updateState(handleZoomInClick(state)) })
    addClickListener("zoom-out", () => { updateState(handleZoomOutClick(state)) })
    addClickListener("center-view", () => { updateState(handleCenterViewClick(state)) })
}

const setupEventListeners = (state: GameState, updateState: (newState: GameState) => void): void => {
    setupHeaderListeners(state, updateState)
    setupActionListeners(state, updateState)
    setupGridListeners(state, updateState)
    
    window.addEventListener("resize", () => {
        const width = window.innerWidth
        const height = window.innerHeight
        updateState(handleWindowResize(state, width, height))
    })
}

// @BOOTSTRAP: Main game initialization
const initializeGame = (): void => {
    const app = document.getElementById("app")
    if (app === null) {
        throw new Error("app element not found")
    }
    
    let gameState = createInitialState()
    
    const updateState = (newState: GameState): void => {
        gameState = newState
        
        // Auto-save game state
        const saveResult = saveGameState(gameState)
        if (saveResult instanceof Error) {
            console.warn('Failed to save game state:', saveResult.message)
        }
        
        updateDisplay(gameState)
    }
    
    const ui = createGameUI(gameState)
    app.appendChild(ui)
    
    setupEventListeners(gameState, updateState)
    
    // Validate initial game state
    const validation = validateGameState(gameState)
    if (validation instanceof Error) {
        console.error('Invalid initial game state:', validation.message)
        const errorMessage = `Game state error: ${validation.message}`
        gameState = addToActivityLog(gameState, errorMessage)
        updateDisplay(gameState)
    }
}

initializeGame()