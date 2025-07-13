import { createElement } from '../util'

type ActionButtonConfig = {
    id: string
    class: string
    text: string
    disabled: boolean
}

export const actionButtonConfigs: ActionButtonConfig[] = [
    { id: "buy-btn", class: "buy", text: "Buy Property", disabled: true },
    { id: "develop-btn", class: "develop", text: "Develop Property", disabled: true },
    { id: "sell-btn", class: "sell", text: "Sell Property", disabled: true },
    { id: "pass-btn", class: "pass", text: "Pass Turn", disabled: false }
]

export const createActionButton = (action: ActionButtonConfig): HTMLElement => {
    const li = createElement("li")
    const button = createElement("button", `action-button ${action.class}`, action.text)
    button.id = action.id
    button.disabled = action.disabled
    li.appendChild(button)
    return li
}