import type { LegacyGameState } from '../main.js'
import { createElement } from '../util.js'
import { actionButtonConfigs, createActionButton } from './actionHelpers.js'

const createPropertyDetailsSection = (): HTMLElement => {
    const propertyDetails = createElement("div", "panel-section property-details")
    propertyDetails.innerHTML = `
        <h3>Property Details</h3>
        <div class="property-placeholder" id="property-info">
            Select a property to view details
        </div>
    `
    return propertyDetails
}

const createActionsSection = (): HTMLElement => {
    const actionsSection = createElement("div", "panel-section")
    const actionsTitle = createElement("h3", undefined, "Available Actions")
    const actionsList = createElement("ul", "actions-list")
    
    actionButtonConfigs.forEach(action => {
        actionsList.appendChild(createActionButton(action))
    })
    
    actionsSection.appendChild(actionsTitle)
    actionsSection.appendChild(actionsList)
    return actionsSection
}

const createMarketSection = (state: LegacyGameState): HTMLElement => {
    const marketSection = createElement("div", "panel-section")
    marketSection.innerHTML = `
        <h3>Market Conditions</h3>
        <div class="market-indicator">
            <span>Market Status:</span>
            <span class="market-status" id="market-status">${state.marketStatus}</span>
        </div>
    `
    return marketSection
}

const createActivitySection = (state: LegacyGameState): HTMLElement => {
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
    return activitySection
}

export const createActionPanel = (state: LegacyGameState): HTMLElement => {
    const actionPanel = createElement("div", "action-panel")
    
    actionPanel.appendChild(createPropertyDetailsSection())
    actionPanel.appendChild(createActionsSection())
    actionPanel.appendChild(createMarketSection(state))
    actionPanel.appendChild(createActivitySection(state))
    
    return actionPanel
}