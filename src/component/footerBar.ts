import type { LegacyGameState } from '../main.js'
import { createElement } from '../util.js'

export const getActionStatusText = (state: LegacyGameState): string => {
    if (state.selectedProperty) {
        return `Property selected: ${state.selectedProperty.name}`
    }
    return "Choose your next action"
}

const createTurnStatus = (state: LegacyGameState): HTMLElement => {
    const turnStatus = createElement("div", "turn-status")
    
    const phaseIndicator = createElement("div", "phase-indicator", state.currentPhase)
    phaseIndicator.id = "phase-indicator"
    
    const actionStatus = createElement("span", undefined, getActionStatusText(state))
    actionStatus.id = "action-status"
    
    turnStatus.appendChild(phaseIndicator)
    turnStatus.appendChild(actionStatus)
    
    return turnStatus
}

export const createFooterBar = (state: LegacyGameState): HTMLElement => {
    const footer = createElement("footer", "footer-bar")
    
    const nextTurnBtn = createElement("button", "next-turn-button", "Next Turn")
    nextTurnBtn.id = "next-turn-btn"
    
    footer.appendChild(createTurnStatus(state))
    footer.appendChild(nextTurnBtn)
    
    return footer
}