// @PROPERTY_TRANSACTIONS: Property purchase and sale functions
import type { 
  Player, 
  PlayerId, 
  Property, 
  PropertyId, 
  Transaction,
  MoneyResult, 
  PropertyPurchase, 
  PropertyTransfer,
  GameState
} from './types.js'
import { validatePlayer, validateProperty, validateSufficientFunds, processTransaction, calculateNetWorth } from './financial.js'

// @PURCHASE: Property purchase helper functions
const validatePurchaseRequest = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId): MoneyResult<{ player: Player, property: Property }> => {
  const playerValidation = validatePlayer(gameState.players, playerId)
  if (playerValidation instanceof Error) {
    return playerValidation
  }
  
  const propertyValidation = validateProperty(gameState.properties, propertyId)
  if (propertyValidation instanceof Error) {
    return propertyValidation
  }
  
  const player = playerValidation
  const property = propertyValidation
  
  if (property.owner !== null) {
    return new Error(`Property ${propertyId} is already owned by ${property.owner}`)
  }
  
  const fundsValidation = validateSufficientFunds(player, property.value)
  if (fundsValidation instanceof Error) {
    return fundsValidation
  }
  
  return { player, property }
}

const updatePropertyOwnership = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId, transactionResult: { gameState: GameState, transaction: Transaction }): MoneyResult<GameState> => {
  const property = gameState.properties.find(p => p.id === propertyId)
  if (!property) {
    return new Error('Property not found')
  }
  
  const updatedProperty: Property = { ...property, owner: playerId }
  const updatedProperties = gameState.properties.map(p => p.id === propertyId ? updatedProperty : p)
  
  const updatedPlayer = transactionResult.gameState.players.find(p => p.id === playerId)
  if (!updatedPlayer) {
    return new Error('Player not found after transaction')
  }
  
  const finalUpdatedPlayer: Player = {
    ...updatedPlayer,
    properties: [...updatedPlayer.properties, propertyId]
  }
  
  finalUpdatedPlayer.netWorth = calculateNetWorth(finalUpdatedPlayer, updatedProperties)
  
  const finalUpdatedPlayers = transactionResult.gameState.players.map(p =>
    p.id === playerId ? finalUpdatedPlayer : p
  )
  
  return {
    ...transactionResult.gameState,
    players: finalUpdatedPlayers,
    properties: updatedProperties
  }
}

export const purchaseProperty = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId): MoneyResult<{ gameState: GameState, purchase: PropertyPurchase }> => {
  const validation = validatePurchaseRequest(gameState, playerId, propertyId)
  if (validation instanceof Error) {
    return validation
  }
  
  const { property } = validation
  
  const transactionResult = processTransaction(gameState, playerId, {
    type: 'purchase',
    amount: property.value,
    description: `Purchase of ${property.name}`,
    relatedPropertyId: propertyId
  })
  
  if (transactionResult instanceof Error) {
    return transactionResult
  }
  
  const finalGameState = updatePropertyOwnership(gameState, playerId, propertyId, transactionResult)
  if (finalGameState instanceof Error) {
    return finalGameState
  }
  
  const finalPlayer = finalGameState.players.find(p => p.id === playerId)
  const finalProperty = finalGameState.properties.find(p => p.id === propertyId)
  
  if (!finalPlayer || !finalProperty) {
    return new Error('Player or property not found in final state')
  }
  
  const purchase: PropertyPurchase = {
    transaction: transactionResult.transaction,
    property: finalProperty,
    player: finalPlayer
  }
  
  return { gameState: finalGameState, purchase }
}

// @SALE: Property sale helper functions
const validateSaleRequest = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId): MoneyResult<Property> => {
  const playerValidation = validatePlayer(gameState.players, playerId)
  if (playerValidation instanceof Error) {
    return playerValidation
  }
  
  const propertyValidation = validateProperty(gameState.properties, propertyId)
  if (propertyValidation instanceof Error) {
    return propertyValidation
  }
  
  const property = propertyValidation
  
  if (property.owner !== playerId) {
    return new Error(`Player ${playerId} does not own property ${propertyId}`)
  }
  
  return property
}

const removePropertyOwnership = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId, transactionResult: { gameState: GameState, transaction: Transaction }): MoneyResult<GameState> => {
  const property = gameState.properties.find(p => p.id === propertyId)
  if (!property) {
    return new Error('Property not found')
  }
  
  const updatedProperty: Property = { ...property, owner: null }
  const updatedProperties = gameState.properties.map(p => p.id === propertyId ? updatedProperty : p)
  
  const updatedPlayer = transactionResult.gameState.players.find(p => p.id === playerId)
  if (!updatedPlayer) {
    return new Error('Player not found after transaction')
  }
  
  const finalUpdatedPlayer: Player = {
    ...updatedPlayer,
    properties: updatedPlayer.properties.filter(id => id !== propertyId)
  }
  
  finalUpdatedPlayer.netWorth = calculateNetWorth(finalUpdatedPlayer, updatedProperties)
  
  const finalUpdatedPlayers = transactionResult.gameState.players.map(p =>
    p.id === playerId ? finalUpdatedPlayer : p
  )
  
  return {
    ...transactionResult.gameState,
    players: finalUpdatedPlayers,
    properties: updatedProperties
  }
}

export const sellProperty = (gameState: GameState, playerId: PlayerId, propertyId: PropertyId): MoneyResult<{ gameState: GameState, sale: PropertyTransfer }> => {
  const property = validateSaleRequest(gameState, playerId, propertyId)
  if (property instanceof Error) {
    return property
  }
  
  const salePrice = Math.floor(property.value * 0.8)
  
  const transactionResult = processTransaction(gameState, playerId, {
    type: 'sale',
    amount: salePrice,
    description: `Sale of ${property.name}`,
    relatedPropertyId: propertyId
  })
  
  if (transactionResult instanceof Error) {
    return transactionResult
  }
  
  const finalGameState = removePropertyOwnership(gameState, playerId, propertyId, transactionResult)
  if (finalGameState instanceof Error) {
    return finalGameState
  }
  
  const finalPlayer = finalGameState.players.find(p => p.id === playerId)
  const finalProperty = finalGameState.properties.find(p => p.id === propertyId)
  
  if (!finalPlayer || !finalProperty) {
    return new Error('Player or property not found in final state')
  }
  
  const sale: PropertyTransfer = {
    transaction: transactionResult.transaction,
    property: finalProperty,
    fromPlayer: finalPlayer,
    toPlayer: null
  }
  
  return { gameState: finalGameState, sale }
}