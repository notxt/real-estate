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

export type Property = {
    id: string
    name: string
    price: number
    owner: string | null
    developmentLevel: number
}

export type GameState = {
    playerName: string
    cash: number
    turnNumber: number
    currentPhase: string
    selectedProperty: Property | null
    marketStatus: string
    activityLog: string[]
}

const createInitialState = (): GameState => ({
    playerName: "Property Mogul",
    cash: 100000,
    turnNumber: 1,
    currentPhase: "Planning Phase",
    selectedProperty: null,
    marketStatus: "Stable",
    activityLog: [
        "Game started - Welcome to Real Estate Empire!",
        "Turn 1 - Your turn to make a move",
        "Select a property to begin building your empire"
    ]
})


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

const initializeGame = (): void => {
    const app = document.getElementById("app")
    if (app === null) {
        throw new Error("app element not found")
    }
    
    let gameState = createInitialState()
    
    const updateState = (newState: GameState): void => {
        gameState = newState
        updateDisplay(gameState)
    }
    
    const ui = createGameUI(gameState)
    app.appendChild(ui)
    
    setupEventListeners(gameState, updateState)
}

initializeGame()