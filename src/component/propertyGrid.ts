// @GRID: Property grid component with interactive 20x15 grid display
import { createElement } from '../util.js'
import type { GameState, Property, PropertyId } from '../types.js'
import { DevelopmentLevel } from '../types.js'

// @CONSTANTS: Grid configuration
const GRID_WIDTH = 20
const GRID_HEIGHT = 15

// @HELPERS: Grid utility functions
// @ts-expect-error - keeping for future use
const _getPropertyId = (x: number, y: number): PropertyId => `prop_${x.toString()}_${y.toString()}`

const getPropertyByPosition = (properties: Property[], x: number, y: number): Property | null => {
  return properties.find(p => p.position.x === x && p.position.y === y) ?? null
}

const createPropertyTooltip = (property: Property): HTMLElement => {
  const tooltip = createElement("div", "property-tooltip")
  const ownerText = property.owner !== null ? 'Owner: Player' : 'Available for purchase'
  const incomeText = property.monthlyIncome > 0 ? `Income: $${property.monthlyIncome.toString()}/month` : ''
  
  tooltip.innerHTML = `
    <strong>Property (${property.position.x.toString()},${property.position.y.toString()})</strong><br>
    Type: ${property.type.replace('_', ' ')}<br>
    Value: $${property.value.toLocaleString()}<br>
    ${ownerText}<br>
    ${incomeText}
  `
  return tooltip
}

// @EVENTS: Property grid event handlers
let currentTooltip: HTMLElement | null = null

const handlePropertyHover = (cell: HTMLElement, property: Property): void => {
  // Remove existing tooltip
  if (currentTooltip) {
    currentTooltip.remove()
    currentTooltip = null
  }
  
  // Create and position new tooltip
  const tooltip = createPropertyTooltip(property)
  document.body.appendChild(tooltip)
  currentTooltip = tooltip
  
  const rect = cell.getBoundingClientRect()
  tooltip.style.left = `${(rect.left + rect.width / 2).toString()}px`
  tooltip.style.top = `${(rect.top - 10).toString()}px`
}

const handlePropertyHoverEnd = (): void => {
  if (currentTooltip) {
    currentTooltip.remove()
    currentTooltip = null
  }
}

const handlePropertyClick = (property: Property, onPropertySelect: (propertyId: PropertyId) => void): void => {
  onPropertySelect(property.id)
}

const selectFirstProperty = (properties: Property[], onPropertySelect: (propertyId: PropertyId) => void): void => {
  const firstProperty = properties.find(p => p.position.x === 0 && p.position.y === 0)
  if (firstProperty !== undefined) {
    onPropertySelect(firstProperty.id)
  }
}

const calculateNewPosition = (key: string, currentX: number, currentY: number): { x: number; y: number } => {
  let newX = currentX
  let newY = currentY
  
  switch (key) {
    case 'ArrowUp':
      newY = Math.max(0, newY - 1)
      break
    case 'ArrowDown':
      newY = Math.min(GRID_HEIGHT - 1, newY + 1)
      break
    case 'ArrowLeft':
      newX = Math.max(0, newX - 1)
      break
    case 'ArrowRight':
      newX = Math.min(GRID_WIDTH - 1, newX + 1)
      break
  }
  
  return { x: newX, y: newY }
}

const handleKeyNavigation = (
  event: KeyboardEvent, 
  gameState: GameState, 
  gridElement: HTMLElement
) => (onPropertySelect: (propertyId: PropertyId) => void): void => {
  if (gameState.selectedProperty === null) {
    selectFirstProperty(gameState.properties, onPropertySelect)
    // Focus on the first cell after selection
    setTimeout(() => {
      const firstCell = gridElement.querySelector('.grid-cell[data-x="0"][data-y="0"]')
      if (firstCell instanceof HTMLElement) {
        firstCell.focus()
      }
    }, 0)
    return
  }
  
  const selectedProperty = gameState.selectedProperty
  
  if (event.key === 'Enter' || event.key === ' ') {
    onPropertySelect(selectedProperty.id)
    return
  }
  
  const newPosition = calculateNewPosition(event.key, selectedProperty.position.x, selectedProperty.position.y)
  const targetProperty = gameState.properties.find(p => p.position.x === newPosition.x && p.position.y === newPosition.y)
  
  if (targetProperty !== undefined) {
    onPropertySelect(targetProperty.id)
    // Focus on the target cell after selection
    setTimeout(() => {
      const targetCell = gridElement.querySelector(`.grid-cell[data-x="${newPosition.x.toString()}"][data-y="${newPosition.y.toString()}"]`)
      if (targetCell instanceof HTMLElement) {
        targetCell.focus()
      }
    }, 0)
  }
  
  event.preventDefault()
}

// @RENDER: Grid cell rendering functions
const addPropertyContent = (cell: HTMLElement, property: Property): void => {
  const content = createElement("div", "property-content")
  
  const typeIndicator = createElement("div", "property-type-indicator")
  content.appendChild(typeIndicator)
  
  if (property.owner !== null) {
    const ownershipIndicator = createElement("div", "ownership-indicator")
    content.appendChild(ownershipIndicator)
  }
  
  if (property.developmentLevel > DevelopmentLevel.Vacant) {
    const devIndicator = createElement("div", "development-indicator")
    devIndicator.textContent = property.developmentLevel.toString()
    content.appendChild(devIndicator)
  }
  
  cell.appendChild(content)
}

const addPropertyEventListeners = (cell: HTMLElement, property: Property, onPropertySelect: (propertyId: PropertyId) => void): void => {
  cell.addEventListener('click', () => {
    handlePropertyClick(property, onPropertySelect)
  })
  cell.addEventListener('mouseenter', () => {
    handlePropertyHover(cell, property)
  })
  cell.addEventListener('mouseleave', () => {
    handlePropertyHoverEnd()
  })
}

const createPropertyCell = (property: Property, isSelected: boolean, onPropertySelect: (propertyId: PropertyId) => void): HTMLElement => {
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
  
  addPropertyContent(cell, property)
  addPropertyEventListeners(cell, property, onPropertySelect)
  
  return cell
}

// @MAIN: Main property grid component
export const createPropertyGrid = (gameState: GameState, onPropertySelect: (propertyId: PropertyId) => void): HTMLElement => {
  const gridContainer = createElement("div", "property-grid")
  
  gridContainer.setAttribute('tabindex', '0')
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const property = getPropertyByPosition(gameState.properties, x, y)
      if (property !== null) {
        const isSelected = gameState.selectedProperty?.id === property.id
        const cell = createPropertyCell(property, isSelected, onPropertySelect)
        gridContainer.appendChild(cell)
      }
    }
  }
  
  gridContainer.addEventListener('keydown', (event) => {
    handleKeyNavigation(event, gameState, gridContainer)(onPropertySelect)
  })
  
  gridContainer.addEventListener('focus', () => {
    // If no property is selected when grid gains focus, select the first one
    if (gameState.selectedProperty === null) {
      selectFirstProperty(gameState.properties, onPropertySelect)
      setTimeout(() => {
        const firstCell = gridContainer.querySelector('.grid-cell[data-x="0"][data-y="0"]')
        if (firstCell instanceof HTMLElement) {
          firstCell.focus()
        }
      }, 0)
    } else {
      // Focus on the currently selected property
      const selectedCell = gridContainer.querySelector(`.grid-cell[data-property-id="${gameState.selectedProperty.id}"]`)
      if (selectedCell instanceof HTMLElement) {
        selectedCell.focus()
      }
    }
  })
  
  return gridContainer
}

// @UPDATE: Grid update functions for state changes
export const updatePropertyGrid = (gridElement: HTMLElement, gameState: GameState, onPropertySelect: (propertyId: PropertyId) => void): void => {
  gridElement.innerHTML = ''
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const property = getPropertyByPosition(gameState.properties, x, y)
      if (property !== null) {
        const isSelected = gameState.selectedProperty?.id === property.id
        const cell = createPropertyCell(property, isSelected, onPropertySelect)
        gridElement.appendChild(cell)
      }
    }
  }
}