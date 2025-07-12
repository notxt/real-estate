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

class GameUI {
    private readonly state: GameState

    constructor() {
        this.state = {
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
        }
        
        this.initializeUI()
        this.setupEventListeners()
    }

    private initializeUI(): void {
        this.updateDisplay()
    }

    private updateDisplay(): void {
        this.updatePlayerInfo()
        this.updateActivityLog()
        this.updateActionButtons()
    }

    private updatePlayerInfo(): void {
        this.updateElement("player-name", this.state.playerName)
        this.updateElement("cash-amount", this.formatCurrency(this.state.cash))
        this.updateElement("turn-number", this.state.turnNumber.toString())
        this.updateElement("phase-indicator", this.state.currentPhase)
        this.updateElement("market-status", this.state.marketStatus)
        this.updateElement("action-status", this.getActionStatusText())
    }

    private updateElement(id: string, content: string): void {
        const element = document.getElementById(id)
        if (element !== null) {
            element.textContent = content
        }
    }

    private updateActivityLog(): void {
        const activityLogEl = document.getElementById("activity-log")
        if (activityLogEl !== null) {
            activityLogEl.innerHTML = ""
            this.state.activityLog.forEach(activity => {
                const activityDiv = document.createElement("div")
                activityDiv.className = "activity-item"
                activityDiv.textContent = activity
                activityLogEl.appendChild(activityDiv)
            })
        }
    }

    private updateActionButtons(): void {
        const hasSelection = this.state.selectedProperty !== null
        this.updateButtonState("buy-btn", !hasSelection)
        this.updateButtonState("develop-btn", !hasSelection)
        this.updateButtonState("sell-btn", !hasSelection)
        this.updateButtonState("next-turn-btn", false)
    }

    private updateButtonState(id: string, disabled: boolean): void {
        const button = document.getElementById(id) as HTMLButtonElement | null
        if (button !== null) {
            button.disabled = disabled
        }
    }

    private setupEventListeners(): void {
        this.setupHeaderEventListeners()
        this.setupActionEventListeners()
        this.setupGridEventListeners()
    }

    private setupHeaderEventListeners(): void {
        const settingsBtn = document.getElementById("settings-btn")
        const helpBtn = document.getElementById("help-btn")

        if (settingsBtn !== null) {
            settingsBtn.addEventListener("click", () => {
                this.showSettings()
            })
        }
        if (helpBtn !== null) {
            helpBtn.addEventListener("click", () => {
                this.showHelp()
            })
        }
    }

    private setupActionEventListeners(): void {
        this.addClickListener("buy-btn", () => { this.buyProperty() })
        this.addClickListener("develop-btn", () => { this.developProperty() })
        this.addClickListener("sell-btn", () => { this.sellProperty() })
        this.addClickListener("pass-btn", () => { this.passTurn() })
        this.addClickListener("next-turn-btn", () => { this.nextTurn() })
    }

    private addClickListener(id: string, handler: () => void): void {
        const element = document.getElementById(id)
        if (element !== null) {
            element.addEventListener("click", handler)
        }
    }

    private setupGridEventListeners(): void {
        const zoomInBtn = document.getElementById("zoom-in")
        const zoomOutBtn = document.getElementById("zoom-out")
        const centerViewBtn = document.getElementById("center-view")

        if (zoomInBtn !== null) {
            zoomInBtn.addEventListener("click", () => {
                this.zoomIn()
            })
        }
        if (zoomOutBtn !== null) {
            zoomOutBtn.addEventListener("click", () => {
                this.zoomOut()
            })
        }
        if (centerViewBtn !== null) {
            centerViewBtn.addEventListener("click", () => {
                this.centerView()
            })
        }
    }

    private formatCurrency(amount: number): string {
        return amount.toLocaleString()
    }

    private getActionStatusText(): string {
        if (this.state.selectedProperty) {
            return `Property selected: ${this.state.selectedProperty.name}`
        }
        return "Choose your next action"
    }

    private addActivityLog(message: string): void {
        this.state.activityLog.unshift(message)
        if (this.state.activityLog.length > 5) {
            this.state.activityLog = this.state.activityLog.slice(0, 5)
        }
        this.updateDisplay()
    }

    private showSettings(): void {
        this.addActivityLog("Settings panel opened")
    }

    private showHelp(): void {
        this.addActivityLog("Help documentation opened")
    }

    private buyProperty(): void {
        this.addActivityLog("Attempting to buy property...")
    }

    private developProperty(): void {
        if (this.state.selectedProperty) {
            this.addActivityLog(`Developing ${this.state.selectedProperty.name}`)
        }
    }

    private sellProperty(): void {
        if (this.state.selectedProperty) {
            this.addActivityLog(`Selling ${this.state.selectedProperty.name}`)
        }
    }

    private passTurn(): void {
        this.addActivityLog("Turn passed - no action taken")
        this.nextTurn()
    }

    private nextTurn(): void {
        this.state.turnNumber++
        this.state.currentPhase = "Planning Phase"
        this.addActivityLog(`Turn ${this.state.turnNumber.toString()} started`)
        this.updateDisplay()
    }

    private zoomIn(): void {
        this.addActivityLog("Zoomed in on property grid")
    }

    private zoomOut(): void {
        this.addActivityLog("Zoomed out on property grid")
    }

    private centerView(): void {
        this.addActivityLog("Centered view on property grid")
    }
}

const main = document.querySelector("main")
if (main === null) {
    throw new Error("main element not found")
}

new GameUI()
