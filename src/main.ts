type Property = {
    id: string
    name: string
    price: number
    owner: string | null
    developmentLevel: number
}

type GameState = {
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

const formatCurrency = (amount: number): string => {
    return amount.toLocaleString()
}

const getActionStatusText = (state: GameState): string => {
    if (state.selectedProperty) {
        return `Property selected: ${state.selectedProperty.name}`
    }
    return "Choose your next action"
}

const addActivityLog = (state: GameState, message: string): GameState => {
    const newLog = [message, ...state.activityLog].slice(0, 5)
    return { ...state, activityLog: newLog }
}

const createElement = (tag: string, className?: string, content?: string): HTMLElement => {
    const element = document.createElement(tag)
    if (className) {
        element.className = className
    }
    if (content) {
        element.textContent = content
    }
    return element
}

const createHeaderBar = (state: GameState): HTMLElement => {
    const header = createElement("header", "header-bar")
    
    const headerLeft = createElement("div", "header-left")
    const playerInfo = createElement("div", "player-info")
    
    const playerSpan = createElement("span")
    playerSpan.innerHTML = `Player: <strong id="player-name">${state.playerName}</strong>`
    
    const cashDisplay = createElement("div", "cash-display")
    cashDisplay.innerHTML = `Cash: $<span id="cash-amount">${formatCurrency(state.cash)}</span>`
    
    const turnCounter = createElement("div", "turn-counter")
    turnCounter.innerHTML = `Turn: <span id="turn-number">${state.turnNumber.toString()}</span>`
    
    playerInfo.appendChild(playerSpan)
    playerInfo.appendChild(cashDisplay)
    playerInfo.appendChild(turnCounter)
    headerLeft.appendChild(playerInfo)
    
    const headerRight = createElement("div", "header-right")
    const settingsBtn = createElement("button", "header-button", "Settings") as HTMLButtonElement
    settingsBtn.id = "settings-btn"
    const helpBtn = createElement("button", "header-button", "Help") as HTMLButtonElement
    helpBtn.id = "help-btn"
    
    headerRight.appendChild(settingsBtn)
    headerRight.appendChild(helpBtn)
    
    header.appendChild(headerLeft)
    header.appendChild(headerRight)
    
    return header
}

const createCentralArea = (): HTMLElement => {
    const central = createElement("div", "central-area")
    
    const title = createElement("h2", undefined, "Property Grid")
    
    const gridPlaceholder = createElement("div", "grid-placeholder")
    gridPlaceholder.innerHTML = `
        <h3>Property Grid Coming Soon</h3>
        <p>20x15 City Grid</p>
        <small>Interactive property map will appear here</small>
    `
    
    const gridControls = createElement("div", "grid-controls")
    const zoomIn = createElement("button", "header-button", "Zoom In") as HTMLButtonElement
    zoomIn.id = "zoom-in"
    const zoomOut = createElement("button", "header-button", "Zoom Out") as HTMLButtonElement
    zoomOut.id = "zoom-out"
    const centerView = createElement("button", "header-button", "Center View") as HTMLButtonElement
    centerView.id = "center-view"
    
    gridControls.appendChild(zoomIn)
    gridControls.appendChild(zoomOut)
    gridControls.appendChild(centerView)
    
    central.appendChild(title)
    central.appendChild(gridPlaceholder)
    central.appendChild(gridControls)
    
    return central
}

const createActionPanel = (state: GameState): HTMLElement => {
    const actionPanel = createElement("div", "action-panel")
    
    const propertyDetails = createElement("div", "panel-section property-details")
    propertyDetails.innerHTML = `
        <h3>Property Details</h3>
        <div class="property-placeholder" id="property-info">
            Select a property to view details
        </div>
    `
    
    const actionsSection = createElement("div", "panel-section")
    const actionsTitle = createElement("h3", undefined, "Available Actions")
    const actionsList = createElement("ul", "actions-list")
    
    const actions = [
        { id: "buy-btn", class: "buy", text: "Buy Property", disabled: true },
        { id: "develop-btn", class: "develop", text: "Develop Property", disabled: true },
        { id: "sell-btn", class: "sell", text: "Sell Property", disabled: true },
        { id: "pass-btn", class: "pass", text: "Pass Turn", disabled: false }
    ]
    
    actions.forEach(action => {
        const li = createElement("li")
        const button = createElement("button", `action-button ${action.class}`, action.text) as HTMLButtonElement
        button.id = action.id
        button.disabled = action.disabled
        li.appendChild(button)
        actionsList.appendChild(li)
    })
    
    actionsSection.appendChild(actionsTitle)
    actionsSection.appendChild(actionsList)
    
    const marketSection = createElement("div", "panel-section")
    marketSection.innerHTML = `
        <h3>Market Conditions</h3>
        <div class="market-indicator">
            <span>Market Status:</span>
            <span class="market-status" id="market-status">${state.marketStatus}</span>
        </div>
    `
    
    const activitySection = createElement("div", "panel-section")
    const activityTitle = createElement("h3", undefined, "Recent Activity")
    const activityLog = createElement("div", "activity-log")
    activityLog.id = "activity-log"
    
    state.activityLog.forEach(activity => {
        const item = createElement("div", "activity-item", activity)
        activityLog.appendChild(item)
    })
    
    activitySection.appendChild(activityTitle)
    activitySection.appendChild(activityLog)
    
    actionPanel.appendChild(propertyDetails)
    actionPanel.appendChild(actionsSection)
    actionPanel.appendChild(marketSection)
    actionPanel.appendChild(activitySection)
    
    return actionPanel
}

const createFooterBar = (state: GameState): HTMLElement => {
    const footer = createElement("footer", "footer-bar")
    
    const turnStatus = createElement("div", "turn-status")
    const phaseIndicator = createElement("div", "phase-indicator", state.currentPhase)
    phaseIndicator.id = "phase-indicator"
    const actionStatus = createElement("span", undefined, getActionStatusText(state))
    actionStatus.id = "action-status"
    
    turnStatus.appendChild(phaseIndicator)
    turnStatus.appendChild(actionStatus)
    
    const nextTurnBtn = createElement("button", "next-turn-button", "Next Turn") as HTMLButtonElement
    nextTurnBtn.id = "next-turn-btn"
    
    footer.appendChild(turnStatus)
    footer.appendChild(nextTurnBtn)
    
    return footer
}

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

const setupEventListeners = (state: GameState, updateState: (newState: GameState) => void): void => {
    const addClickListener = (id: string, handler: () => void): void => {
        const element = document.getElementById(id)
        if (element !== null) {
            element.addEventListener("click", handler)
        }
    }
    
    addClickListener("settings-btn", () => {
        const newState = addActivityLog(state, "Settings panel opened")
        updateState(newState)
    })
    
    addClickListener("help-btn", () => {
        const newState = addActivityLog(state, "Help documentation opened")
        updateState(newState)
    })
    
    addClickListener("buy-btn", () => {
        const newState = addActivityLog(state, "Attempting to buy property...")
        updateState(newState)
    })
    
    addClickListener("develop-btn", () => {
        if (state.selectedProperty) {
            const newState = addActivityLog(state, `Developing ${state.selectedProperty.name}`)
            updateState(newState)
        }
    })
    
    addClickListener("sell-btn", () => {
        if (state.selectedProperty) {
            const newState = addActivityLog(state, `Selling ${state.selectedProperty.name}`)
            updateState(newState)
        }
    })
    
    addClickListener("pass-btn", () => {
        const newState = addActivityLog(state, "Turn passed - no action taken")
        const nextTurnState = {
            ...newState,
            turnNumber: newState.turnNumber + 1,
            currentPhase: "Planning Phase"
        }
        const finalState = addActivityLog(nextTurnState, `Turn ${nextTurnState.turnNumber} started`)
        updateState(finalState)
    })
    
    addClickListener("next-turn-btn", () => {
        const newState = {
            ...state,
            turnNumber: state.turnNumber + 1,
            currentPhase: "Planning Phase"
        }
        const finalState = addActivityLog(newState, `Turn ${newState.turnNumber} started`)
        updateState(finalState)
    })
    
    addClickListener("zoom-in", () => {
        const newState = addActivityLog(state, "Zoomed in on property grid")
        updateState(newState)
    })
    
    addClickListener("zoom-out", () => {
        const newState = addActivityLog(state, "Zoomed out on property grid")
        updateState(newState)
    })
    
    addClickListener("center-view", () => {
        const newState = addActivityLog(state, "Centered view on property grid")
        updateState(newState)
    })
    
    window.addEventListener("resize", () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const newState = addActivityLog(state, `Window resized to ${width}x${height}`)
        updateState(newState)
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