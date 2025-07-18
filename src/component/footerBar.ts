// @FOOTER: Footer bar component with turn status and navigation
import type { GameState } from '../types.js'
import { createElement } from '../util.js'

// @STATUS: Game status helpers
export const getActionStatusText = (state: GameState): string => {
    if (state.selectedProperty) {
        return `Property selected: ${state.selectedProperty.name}`
    }
    return "Choose your next action"
}

const createTurnStatus = (state: GameState): HTMLElement => {
    const turnStatus = createElement("div", "turn-status")
    
    const phaseIndicator = createElement("div", "phase-indicator", state.phase.replace(/_/g, ' '))
    phaseIndicator.id = "phase-indicator"
    
    const actionStatus = createElement("span", null, getActionStatusText(state))
    actionStatus.id = "action-status"
    
    turnStatus.appendChild(phaseIndicator)
    turnStatus.appendChild(actionStatus)
    
    return turnStatus
}

// @EXPORT: Main footer bar creation function
export const createFooterBar = (state: GameState): HTMLElement => {
    const footer = createElement("footer", "footer-bar")
    
    const nextTurnBtn = createElement("button", "next-turn-button", "Next Turn")
    nextTurnBtn.id = "next-turn-btn"
    
    footer.appendChild(createTurnStatus(state))
    footer.appendChild(nextTurnBtn)
    
    return footer
}