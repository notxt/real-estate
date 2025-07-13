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
import type { GameState, PropertyId } from './types.js'
import { 
    createInitialGameState, 
    validateGameState, 
    saveGameState, 
    loadGameState,
    addToActivityLog,
    selectProperty
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
const createGameUI = (state: GameState, onPropertySelect: (propertyId: PropertyId) => void): DocumentFragment => {
    const fragment = document.createDocumentFragment()
    
    fragment.appendChild(createHeaderBar(state))
    
    const main = createElement("main")
    main.appendChild(createCentralArea(state, onPropertySelect))
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

const updatePropertyDetails = (state: GameState): void => {
    const propertyInfo = document.getElementById("property-info")
    if (propertyInfo) {
        if (state.selectedProperty) {
            const property = state.selectedProperty
            const ownerText = property.owner !== null ? 'Player' : 'Available'
            const incomeText = property.monthlyIncome > 0 ? `<div>Income: ${formatCurrency(property.monthlyIncome)}/month</div>` : ''
            
            propertyInfo.innerHTML = `
                <div><strong>Property (${property.position.x.toString()},${property.position.y.toString()})</strong></div>
                <div>Type: ${property.type.replace('_', ' ')}</div>
                <div>Value: ${formatCurrency(property.value)}</div>
                <div>Owner: ${ownerText}</div>
                ${incomeText}
                <div>Development Level: ${property.developmentLevel.toString()}</div>
            `
        } else {
            propertyInfo.innerHTML = "Select a property to view details"
        }
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
    updatePropertyDetails(state)
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

// @GRID: Property grid update helper  
const updatePropertyGrid = (gameState: GameState, handlePropertySelect: (propertyId: PropertyId) => void): void => {
    const gridElement = document.querySelector('.property-grid')
    if (gridElement instanceof HTMLElement) {
        // Simply recreate the grid content
        gridElement.innerHTML = ''
        
        // Copy logic from createPropertyGrid
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 20; x++) {
                const property = gameState.properties.find(p => p.position.x === x && p.position.y === y)
                if (property !== undefined) {
                    const isSelected = gameState.selectedProperty?.id === property.id
                    const cell = createElement("div", "grid-cell")
                    
                    cell.setAttribute('data-x', property.position.x.toString())
                    cell.setAttribute('data-y', property.position.y.toString())
                    cell.setAttribute('tabindex', '0')
                    cell.setAttribute('data-property-id', property.id)
                    cell.setAttribute('data-property-type', property.type)
                    cell.setAttribute('data-development-level', property.developmentLevel.toString())
                    
                    if (property.owner !== null) {
                        cell.setAttribute('data-owner', property.owner)
                    }
                    
                    if (isSelected) {
                        cell.classList.add('selected')
                    }
                    
                    // Add event listeners
                    cell.addEventListener('click', () => {
                        handlePropertySelect(property.id)
                    })
                    
                    gridElement.appendChild(cell)
                }
            }
        }
    }
}

// @SELECTION: Property selection handler
const createPropertySelectHandler = (getCurrentState: () => GameState, updateState: (newState: GameState) => void) => {
    return (propertyId: PropertyId): void => {
        const currentState = getCurrentState()
        const result = selectProperty(currentState, propertyId)
        if (result instanceof Error) {
            console.error('Failed to select property:', result.message)
            const errorState = addToActivityLog(currentState, `Error: ${result.message}`)
            updateState(errorState)
        } else {
            const property = currentState.properties.find(p => p.id === propertyId)
            if (property) {
                const logMessage = `Property selected at coordinates ${property.position.x.toString()},${property.position.y.toString()}`
                const newState = addToActivityLog(result, logMessage)
                updateState(newState)
            }
        }
    }
}

// @BOOTSTRAP: Main game initialization
const initializeGame = (): void => {
    const app = document.getElementById("app")
    if (app === null) {
        throw new Error("app element not found")
    }
    
    let gameState = createInitialState()
    let handlePropertySelect: (propertyId: PropertyId) => void = (_propertyId: PropertyId) => {
        // Will be reassigned below
    }
    
    const updateState = (newState: GameState): void => {
        gameState = newState
        
        const saveResult = saveGameState(gameState)
        if (saveResult instanceof Error) {
            console.warn('Failed to save game state:', saveResult.message)
        }
        
        updateDisplay(gameState)
        updatePropertyGrid(gameState, handlePropertySelect)
    }
    
    handlePropertySelect = createPropertySelectHandler(() => gameState, updateState)
    
    const ui = createGameUI(gameState, handlePropertySelect)
    app.appendChild(ui)
    
    setupEventListeners(gameState, updateState)
    
    const validation = validateGameState(gameState)
    if (validation instanceof Error) {
        console.error('Invalid initial game state:', validation.message)
        const errorMessage = `Game state error: ${validation.message}`
        gameState = addToActivityLog(gameState, errorMessage)
        updateDisplay(gameState)
    }
}

initializeGame()