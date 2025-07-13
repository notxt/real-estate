// @GAMESTATE: Core game state management and business logic
import type { GameState, Player, Property, PlayerId, PropertyId, MarketConditions } from './types.js'
import { GamePhase, PropertyType, DevelopmentLevel } from './types.js'

// @FACTORY: Game entity creation functions
export const createInitialPlayer = (): Player => ({
  id: 'player1',
  name: 'Property Mogul',
  cash: 100000,
  netWorth: 100000,
  properties: [],
  isAI: false
})

export const createInitialProperties = (): Property[] => [
  {
    id: 'prop1',
    position: { x: 0, y: 0 },
    type: PropertyType.VacantLot,
    value: 25000,
    owner: null,
    developmentLevel: DevelopmentLevel.Vacant,
    monthlyIncome: 0,
    developmentCost: 15000,
    name: 'Downtown Lot A'
  },
  {
    id: 'prop2',
    position: { x: 1, y: 0 },
    type: PropertyType.VacantLot,
    value: 30000,
    owner: null,
    developmentLevel: DevelopmentLevel.Vacant,
    monthlyIncome: 0,
    developmentCost: 18000,
    name: 'Downtown Lot B'
  },
  {
    id: 'prop3',
    position: { x: 0, y: 1 },
    type: PropertyType.Residential,
    value: 45000,
    owner: null,
    developmentLevel: DevelopmentLevel.Level1,
    monthlyIncome: 1200,
    developmentCost: 20000,
    name: 'Suburban House'
  }
]

export const createInitialMarketConditions = (): MarketConditions => ({
  trend: 'stable',
  volatility: 'medium',
  demandLevel: 50,
  interestRate: 3.5
})

// @INIT: Game initialization functions
export const createInitialGameState = (): GameState => {
  const player = createInitialPlayer()
  const properties = createInitialProperties()
  
  return {
    currentTurn: 1,
    currentPlayer: player.id,
    phase: GamePhase.PropertyAcquisition,
    players: [player],
    properties,
    market: createInitialMarketConditions(),
    availableActions: [],
    selectedProperty: null,
    activityLog: [
      'Game started - Welcome to Real Estate Empire!',
      'Turn 1 - Your turn to make a move',
      'Select a property to begin building your empire'
    ]
  }
}

// @CALCULATIONS: Game math and derived values
export const calculateNetWorth = (player: Player, properties: Property[]): number => {
  const propertyValue = player.properties.reduce((total, propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return total + (property?.value ?? 0)
  }, 0)
  
  return player.cash + propertyValue
}

// @MUTATIONS: State update functions
export const updatePlayerCash = (gameState: GameState, playerId: PlayerId, amount: number): Error | GameState => {
  const playerIndex = gameState.players.findIndex(p => p.id === playerId)
  if (playerIndex === -1) {
    return new Error(`Player with id ${playerId} not found`)
  }
  
  const player = gameState.players[playerIndex]
  if (!player) {
    return new Error(`Player with id ${playerId} not found`)
  }
  
  const newCash = player.cash + amount
  
  if (newCash < 0) {
    return new Error('Insufficient funds for this transaction')
  }
  
  const updatedPlayer: Player = {
    id: player.id,
    name: player.name,
    cash: newCash,
    netWorth: calculateNetWorth({ ...player, cash: newCash }, gameState.properties),
    properties: player.properties,
    isAI: player.isAI,
    ...(player.strategy !== undefined ? { strategy: player.strategy } : {})
  }
  
  const updatedPlayers = [...gameState.players]
  updatedPlayers[playerIndex] = updatedPlayer
  
  return {
    ...gameState,
    players: updatedPlayers
  }
}

// @HELPERS: Internal helper functions
const removePropertyFromPlayer = (players: Player[], playerId: PlayerId, propertyId: PropertyId): Player[] => {
  const updatedPlayers = [...players]
  const playerIndex = updatedPlayers.findIndex(p => p.id === playerId)
  
  if (playerIndex !== -1) {
    const player = updatedPlayers[playerIndex]
    if (player) {
      const filteredProperties = player.properties.filter(id => id !== propertyId)
      updatedPlayers[playerIndex] = {
        id: player.id,
        name: player.name,
        cash: player.cash,
        properties: filteredProperties,
        netWorth: player.netWorth,
        isAI: player.isAI,
        ...(player.strategy !== undefined ? { strategy: player.strategy } : {})
      }
    }
  }
  
  return updatedPlayers
}

const addPropertyToPlayer = (players: Player[], playerId: PlayerId, propertyId: PropertyId): Error | Player[] => {
  const updatedPlayers = [...players]
  const playerIndex = updatedPlayers.findIndex(p => p.id === playerId)
  
  if (playerIndex === -1) {
    return new Error(`Player with id ${playerId} not found`)
  }
  
  const player = updatedPlayers[playerIndex]
  if (player) {
    const newProperties = [...player.properties, propertyId]
    updatedPlayers[playerIndex] = {
      id: player.id,
      name: player.name,
      cash: player.cash,
      properties: newProperties,
      netWorth: player.netWorth,
      isAI: player.isAI,
      ...(player.strategy !== undefined ? { strategy: player.strategy } : {})
    }
  }
  
  return updatedPlayers
}

export const transferPropertyOwnership = (gameState: GameState, propertyId: PropertyId, newOwnerId: PlayerId | null): Error | GameState => {
  const propertyIndex = gameState.properties.findIndex(p => p.id === propertyId)
  if (propertyIndex === -1) {
    return new Error(`Property with id ${propertyId} not found`)
  }
  
  const property = gameState.properties[propertyIndex]
  if (!property) {
    return new Error(`Property with id ${propertyId} not found`)
  }
  
  const oldOwnerId = property.owner
  let updatedPlayers = [...gameState.players]
  
  if (oldOwnerId !== null) {
    updatedPlayers = removePropertyFromPlayer(updatedPlayers, oldOwnerId, propertyId)
  }
  
  if (newOwnerId !== null) {
    const result = addPropertyToPlayer(updatedPlayers, newOwnerId, propertyId)
    if (result instanceof Error) {
      return result
    }
    updatedPlayers = result
  }
  
  const updatedProperty: Property = {
    id: property.id,
    position: property.position,
    type: property.type,
    value: property.value,
    owner: newOwnerId,
    developmentLevel: property.developmentLevel,
    monthlyIncome: property.monthlyIncome,
    developmentCost: property.developmentCost,
    name: property.name
  }
  
  const updatedProperties = [...gameState.properties]
  updatedProperties[propertyIndex] = updatedProperty
  
  return {
    ...gameState,
    players: updatedPlayers,
    properties: updatedProperties
  }
}

// @TURNS: Turn management functions
export const advanceTurn = (gameState: GameState): GameState => {
  const nextTurn = gameState.currentTurn + 1
  const logEntry = `Turn ${nextTurn.toString()} - Your turn to make a move`
  
  return {
    ...gameState,
    currentTurn: nextTurn,
    activityLog: [...gameState.activityLog, logEntry]
  }
}

export const addToActivityLog = (gameState: GameState, message: string): GameState => ({
  ...gameState,
  activityLog: [...gameState.activityLog, message]
})

// @SELECTION: Property selection management
export const selectProperty = (gameState: GameState, propertyId: PropertyId | null): Error | GameState => {
  if (propertyId === null) {
    return {
      ...gameState,
      selectedProperty: null
    }
  }
  
  const property = gameState.properties.find(p => p.id === propertyId)
  if (!property) {
    return new Error(`Property with id ${propertyId} not found`)
  }
  
  return {
    ...gameState,
    selectedProperty: property
  }
}

// @VALIDATION: Game state validation functions
export const validateGameState = (gameState: GameState): Error | true => {
  if (gameState.players.length === 0) {
    return new Error('Game must have at least one player')
  }
  
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer)
  if (!currentPlayer) {
    return new Error('Current player not found in players list')
  }
  
  for (const player of gameState.players) {
    if (player.cash < 0) {
      return new Error(`Player ${player.name} has negative cash`)
    }
    
    for (const propertyId of player.properties) {
      const property = gameState.properties.find(p => p.id === propertyId)
      if (!property) {
        return new Error(`Player ${player.name} owns non-existent property ${propertyId}`)
      }
      
      if (property.owner !== player.id) {
        return new Error(`Property ${propertyId} ownership mismatch`)
      }
    }
  }
  
  return true
}

// @PERSISTENCE: Save/load functionality
export const saveGameState = (gameState: GameState): Error | true => {
  try {
    const serialized = JSON.stringify(gameState)
    localStorage.setItem('realEstateEmpire_gameState', serialized)
    return true
  } catch (error) {
    return new Error(`Failed to save game state: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const loadGameState = (): Error | GameState => {
  try {
    const serialized = localStorage.getItem('realEstateEmpire_gameState')
    if (serialized === null) {
      return new Error('No saved game state found')
    }
    
    const gameState = JSON.parse(serialized) as GameState
    const validation = validateGameState(gameState)
    
    if (validation instanceof Error) {
      return validation
    }
    
    return gameState
  } catch (error) {
    return new Error(`Failed to load game state: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}