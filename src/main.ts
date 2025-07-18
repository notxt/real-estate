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
import { updatePropertyGrid as updatePropertyGridComponent } from './component/propertyGrid.js'

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

const updateActionButtons = (state: GameState): void => {
    const buyBtn = document.getElementById("buy-btn") as HTMLButtonElement | null
    const developBtn = document.getElementById("develop-btn") as HTMLButtonElement | null
    const sellBtn = document.getElementById("sell-btn") as HTMLButtonElement | null
    
    if (!buyBtn || !developBtn || !sellBtn) {
        return
    }
    
    // Default to all disabled
    buyBtn.disabled = true
    developBtn.disabled = true
    sellBtn.disabled = true
    
    if (state.selectedProperty) {
        const property = state.selectedProperty
        const currentPlayer = state.players[0]
        
        if (currentPlayer) {
            // Buy button: enabled if property is not owned and player has enough cash
            if (property.owner === null && currentPlayer.cash >= property.value) {
                buyBtn.disabled = false
            }
            
            // Develop button: enabled if player owns the property and can afford development
            if (property.owner === currentPlayer.id) {
                developBtn.disabled = false
            }
            
            // Sell button: enabled if player owns the property
            if (property.owner === currentPlayer.id) {
                sellBtn.disabled = false
            }
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
    updateActionButtons(state)
}

const addClickListener = (id: string, handler: () => void): void => {
    const element = document.getElementById(id)
    if (element !== null) {
        element.addEventListener("click", handler)
    }
}

// @EVENTS: Event listener setup
const setupHeaderListeners = (getCurrentState: () => GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("settings-btn", () => { updateState(handleSettingsClick(getCurrentState())) })
    addClickListener("help-btn", () => { updateState(handleHelpClick(getCurrentState())) })
}

const setupActionListeners = (getCurrentState: () => GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("buy-btn", () => { updateState(handleBuyClick(getCurrentState())) })
    addClickListener("develop-btn", () => { updateState(handleDevelopClick(getCurrentState())) })
    addClickListener("sell-btn", () => { updateState(handleSellClick(getCurrentState())) })
    addClickListener("pass-btn", () => { updateState(handlePassClick(getCurrentState())) })
    addClickListener("next-turn-btn", () => { updateState(handleNextTurnClick(getCurrentState())) })
}

const setupGridListeners = (getCurrentState: () => GameState, updateState: (newState: GameState) => void): void => {
    addClickListener("zoom-in", () => { updateState(handleZoomInClick(getCurrentState())) })
    addClickListener("zoom-out", () => { updateState(handleZoomOutClick(getCurrentState())) })
    addClickListener("center-view", () => { updateState(handleCenterViewClick(getCurrentState())) })
}

const setupEventListeners = (getCurrentState: () => GameState, updateState: (newState: GameState) => void): void => {
    setupHeaderListeners(getCurrentState, updateState)
    setupActionListeners(getCurrentState, updateState)
    setupGridListeners(getCurrentState, updateState)
    
    window.addEventListener("resize", () => {
        const width = window.innerWidth
        const height = window.innerHeight
        updateState(handleWindowResize(getCurrentState(), width, height))
    })
}


// @GRID: Property grid update helper  
const updatePropertyGrid = (gameState: GameState, handlePropertySelect: (propertyId: PropertyId) => void): void => {
    const gridElement = document.querySelector('.property-grid')
    if (!(gridElement instanceof HTMLElement)) {
        return
    }
    
    // Use the proper updatePropertyGrid function from the propertyGrid component
    updatePropertyGridComponent(gridElement, gameState, handlePropertySelect)
}

// @KEYBOARD: Grid keyboard navigation helpers
const selectFirstPropertyIfNone = (currentState: GameState, handlePropertySelect: (propertyId: PropertyId) => void, gridElement: HTMLElement): void => {
    const firstProperty = currentState.properties.find(p => p.position.x === 0 && p.position.y === 0)
    if (firstProperty) {
        handlePropertySelect(firstProperty.id)
        setTimeout(() => {
            const firstCell = gridElement.querySelector('.grid-cell[data-x="0"][data-y="0"]')
            if (firstCell instanceof HTMLElement) {
                firstCell.focus()
            }
        }, 0)
    }
}

const calculateNewPositionFromArrowKey = (key: string, currentX: number, currentY: number): { x: number, y: number } | null => {
    let newX = currentX
    let newY = currentY
    
    if (key === 'ArrowLeft') {
        newX = Math.max(0, newX - 1)
    } else if (key === 'ArrowRight') {
        newX = Math.min(19, newX + 1)
    } else if (key === 'ArrowUp') {
        newY = Math.max(0, newY - 1)
    } else if (key === 'ArrowDown') {
        newY = Math.min(14, newY + 1)
    } else {
        return null // Not an arrow key
    }
    
    return { x: newX, y: newY }
}

const setupGridKeyboardNavigation = (getCurrentState: () => GameState, _updateState: (newState: GameState) => void, handlePropertySelect: (propertyId: PropertyId) => void): void => {
    const gridElement = document.querySelector('.property-grid')
    if (!(gridElement instanceof HTMLElement)) {
        return
    }
    
    gridElement.addEventListener('keydown', (event) => {
        const currentState = getCurrentState()
        if (currentState.selectedProperty === null) {
            selectFirstPropertyIfNone(currentState, handlePropertySelect, gridElement)
            return
        }
        
        const selectedProperty = currentState.selectedProperty
        
        if (event.key === 'Enter' || event.key === ' ') {
            handlePropertySelect(selectedProperty.id)
            return
        }
        
        const newPosition = calculateNewPositionFromArrowKey(event.key, selectedProperty.position.x, selectedProperty.position.y)
        if (!newPosition) {
            return
        }
        
        const targetProperty = currentState.properties.find(p => p.position.x === newPosition.x && p.position.y === newPosition.y)
        if (targetProperty) {
            handlePropertySelect(targetProperty.id)
            setTimeout(() => {
                const targetCell = gridElement.querySelector(`.grid-cell[data-x="${newPosition.x.toString()}"][data-y="${newPosition.y.toString()}"]`)
                if (targetCell instanceof HTMLElement) {
                    targetCell.focus()
                }
            }, 0)
        }
        
        event.preventDefault()
    })
    
    gridElement.addEventListener('focus', () => {
        const currentState = getCurrentState()
        if (currentState.selectedProperty === null) {
            selectFirstPropertyIfNone(currentState, handlePropertySelect, gridElement)
        }
    })
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
    
    setupEventListeners(() => gameState, updateState)
    setupGridKeyboardNavigation(() => gameState, updateState, handlePropertySelect)
    
    const validation = validateGameState(gameState)
    if (validation instanceof Error) {
        console.error('Invalid initial game state:', validation.message)
        const errorMessage = `Game state error: ${validation.message}`
        gameState = addToActivityLog(gameState, errorMessage)
        updateDisplay(gameState)
    }
}

initializeGame()