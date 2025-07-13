import { createElement } from '../util.js'

const createGridPlaceholder = (): HTMLElement => {
    const gridPlaceholder = createElement("div", "grid-placeholder")
    gridPlaceholder.innerHTML = `
        <h3>Property Grid Coming Soon</h3>
        <p>20x15 City Grid</p>
        <small>Interactive property map will appear here</small>
    `
    return gridPlaceholder
}

const createZoomButtons = (): HTMLElement[] => {
    const zoomIn = createElement("button", "header-button", "Zoom In")
    zoomIn.id = "zoom-in"
    
    const zoomOut = createElement("button", "header-button", "Zoom Out")
    zoomOut.id = "zoom-out"
    
    const centerView = createElement("button", "header-button", "Center View")
    centerView.id = "center-view"
    
    return [zoomIn, zoomOut, centerView]
}

const createGridControls = (): HTMLElement => {
    const gridControls = createElement("div", "grid-controls")
    const buttons = createZoomButtons()
    
    buttons.forEach(button => {
        gridControls.appendChild(button)
    })
    
    return gridControls
}

export const createCentralArea = (): HTMLElement => {
    const central = createElement("div", "central-area")
    const title = createElement("h2", null, "Property Grid")
    
    central.appendChild(title)
    central.appendChild(createGridPlaceholder())
    central.appendChild(createGridControls())
    
    return central
}