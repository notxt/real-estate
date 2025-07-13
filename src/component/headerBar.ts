// @HEADER: Header bar component with player info and controls
import type { GameState } from '../types.js'
import { createElement, formatCurrency } from '../util.js'

// @PLAYER: Player information display helpers
const createPlayerDisplay = (state: GameState): HTMLElement => {
    const currentPlayer = state.players[0]
    const playerSpan = createElement("span")
    playerSpan.innerHTML = `Player: <strong id="player-name">${currentPlayer?.name ?? 'Unknown'}</strong>`
    return playerSpan
}

const createCashDisplay = (state: GameState): HTMLElement => {
    const currentPlayer = state.players[0]
    const cashDisplay = createElement("div", "cash-display")
    cashDisplay.innerHTML = `Cash: $<span id="cash-amount">${formatCurrency(currentPlayer?.cash ?? 0)}</span>`
    return cashDisplay
}

const createTurnCounter = (state: GameState): HTMLElement => {
    const turnCounter = createElement("div", "turn-counter")
    turnCounter.innerHTML = `Turn: <span id="turn-number">${state.currentTurn.toString()}</span>`
    return turnCounter
}

const createPlayerInfo = (state: GameState): HTMLElement => {
    const playerInfo = createElement("div", "player-info")
    
    playerInfo.appendChild(createPlayerDisplay(state))
    playerInfo.appendChild(createCashDisplay(state))
    playerInfo.appendChild(createTurnCounter(state))
    
    return playerInfo
}

// @BUTTONS: Header button controls
const createHeaderButtons = (): HTMLElement => {
    const headerRight = createElement("div", "header-right")
    
    const settingsBtn = createElement("button", "header-button", "Settings")
    settingsBtn.id = "settings-btn"
    
    const helpBtn = createElement("button", "header-button", "Help")
    helpBtn.id = "help-btn"
    
    headerRight.appendChild(settingsBtn)
    headerRight.appendChild(helpBtn)
    
    return headerRight
}

// @EXPORT: Main header bar creation function
export const createHeaderBar = (state: GameState): HTMLElement => {
    const header = createElement("header", "header-bar")
    
    const headerLeft = createElement("div", "header-left")
    headerLeft.appendChild(createPlayerInfo(state))
    
    header.appendChild(headerLeft)
    header.appendChild(createHeaderButtons())
    
    return header
}