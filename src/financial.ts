// @FINANCIAL: Comprehensive financial system for Real Estate Empire
import type { 
  Player, 
  PlayerId, 
  Property, 
  PropertyId, 
  Transaction, 
  TransactionData, 
  MoneyResult, 
  FinancialState,
  GameState
} from './types.js'
import { AIStrategy } from './types.js'

// @HELPERS: Internal utility functions
const generateTransactionId = (): string => {
  return `txn_${Date.now().toString()}_${Math.random().toString(36).substring(2, 9)}`
}

const createTransaction = (playerId: PlayerId, data: TransactionData): Transaction => {
  const transaction: Transaction = {
    id: generateTransactionId(),
    playerId,
    type: data.type,
    amount: data.amount,
    description: data.description,
    timestamp: new Date()
  }
  
  if (data.relatedPropertyId !== undefined) {
    transaction.relatedPropertyId = data.relatedPropertyId
  }
  
  return transaction
}

// @VALIDATION: Financial validation functions
export const validateSufficientFunds = (player: Player, amount: number): MoneyResult<boolean> => {
  if (amount < 0) {
    return new Error('Transaction amount cannot be negative')
  }
  
  if (player.cash < amount) {
    return new Error(`Insufficient funds. Required: $${amount.toLocaleString()}, Available: $${player.cash.toLocaleString()}`)
  }
  
  return true
}

export const validatePlayer = (players: Player[], playerId: PlayerId): MoneyResult<Player> => {
  const player = players.find(p => p.id === playerId)
  if (!player) {
    return new Error(`Player with id ${playerId} not found`)
  }
  return player
}

export const validateProperty = (properties: Property[], propertyId: PropertyId): MoneyResult<Property> => {
  const property = properties.find(p => p.id === propertyId)
  if (!property) {
    return new Error(`Property with id ${propertyId} not found`)
  }
  return property
}

// @CALCULATIONS: Financial calculation functions
export const calculateNetWorth = (player: Player, properties: Property[]): number => {
  const propertyValue = player.properties.reduce((total, propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return total + (property ? property.value : 0)
  }, 0)
  
  return player.cash + propertyValue
}

export const calculateTotalCash = (players: Player[]): number => {
  return players.reduce((total, player) => total + player.cash, 0)
}

export const calculateTotalPropertyValue = (properties: Property[]): number => {
  return properties.reduce((total, property) => total + property.value, 0)
}

export const calculateFinancialState = (gameState: GameState): FinancialState => ({
  players: gameState.players,
  totalCash: calculateTotalCash(gameState.players),
  totalPropertyValue: calculateTotalPropertyValue(gameState.properties),
  marketCap: calculateTotalCash(gameState.players) + calculateTotalPropertyValue(gameState.properties)
})

// @TRANSACTIONS: Core transaction processing functions
const calculateCashChange = (transactionType: string, amount: number): number => {
  if (transactionType === 'purchase' || transactionType === 'expense') {
    return -amount
  }
  if (transactionType === 'sale' || transactionType === 'income') {
    return amount
  }
  if (transactionType === 'transfer') {
    return amount // For transfers, amount can be positive or negative
  }
  return 0
}

export const processTransaction = (gameState: GameState, playerId: PlayerId, data: TransactionData): MoneyResult<{ gameState: GameState, transaction: Transaction }> => {
  const playerValidation = validatePlayer(gameState.players, playerId)
  if (playerValidation instanceof Error) {
    return playerValidation
  }
  
  const player = playerValidation
  const transaction = createTransaction(playerId, data)
  
  // Validate funds for outgoing transactions
  if ((data.type === 'expense' || data.type === 'purchase') && data.amount > 0) {
    const fundsValidation = validateSufficientFunds(player, data.amount)
    if (fundsValidation instanceof Error) {
      return fundsValidation
    }
  }
  
  const cashChange = calculateCashChange(data.type, data.amount)
  
  const updatedPlayer: Player = {
    ...player,
    cash: player.cash + cashChange,
    transactionHistory: [...player.transactionHistory, transaction]
  }
  
  updatedPlayer.netWorth = calculateNetWorth(updatedPlayer, gameState.properties)
  
  const updatedPlayers = gameState.players.map(p => 
    p.id === playerId ? updatedPlayer : p
  )
  
  return {
    gameState: { ...gameState, players: updatedPlayers },
    transaction
  }
}

// @TRANSFERS: Player-to-player transfer functions
const validateTransferInputs = (fromPlayerId: PlayerId, toPlayerId: PlayerId, amount: number): MoneyResult<true> => {
  if (amount <= 0) {
    return new Error('Transfer amount must be positive')
  }
  if (fromPlayerId === toPlayerId) {
    return new Error('Cannot transfer funds to the same player')
  }
  return true
}

export const transferFunds = (transferData: { gameState: GameState, fromPlayerId: PlayerId, toPlayerId: PlayerId, amount: number }): MoneyResult<{ gameState: GameState, transactions: Transaction[] }> => {
  const { gameState, fromPlayerId, toPlayerId, amount } = transferData
  const inputValidation = validateTransferInputs(fromPlayerId, toPlayerId, amount)
  if (inputValidation instanceof Error) {
    return inputValidation
  }
  
  const fromPlayerValidation = validatePlayer(gameState.players, fromPlayerId)
  if (fromPlayerValidation instanceof Error) {
    return fromPlayerValidation
  }
  
  const toPlayerValidation = validatePlayer(gameState.players, toPlayerId)
  if (toPlayerValidation instanceof Error) {
    return toPlayerValidation
  }
  
  const fundsValidation = validateSufficientFunds(fromPlayerValidation, amount)
  if (fundsValidation instanceof Error) {
    return fundsValidation
  }
  
  const outgoingResult = processTransaction(gameState, fromPlayerId, {
    type: 'transfer',
    amount: -amount,
    description: `Transfer to ${toPlayerId}: Player transfer`
  })
  
  if (outgoingResult instanceof Error) {
    return outgoingResult
  }
  
  const incomingResult = processTransaction(outgoingResult.gameState, toPlayerId, {
    type: 'transfer',
    amount: amount,
    description: `Transfer from ${fromPlayerId}: Player transfer`
  })
  
  if (incomingResult instanceof Error) {
    return incomingResult
  }
  
  return {
    gameState: incomingResult.gameState,
    transactions: [outgoingResult.transaction, incomingResult.transaction]
  }
}


// @PLAYERS: Player management functions
export const createPlayer = (name: string, isAI = false): Player => ({
  id: `player_${Date.now().toString()}_${Math.random().toString(36).substring(2, 9)}`,
  name,
  cash: 750000, // Starting capital as per requirements
  netWorth: 750000,
  properties: [],
  transactionHistory: [],
  isAI,
  strategy: AIStrategy.Balanced
})

export const createMultiplePlayers = (playerNames: string[]): MoneyResult<Player[]> => {
  if (playerNames.length < 2 || playerNames.length > 6) {
    return new Error('Game must have between 2 and 6 players')
  }
  
  const uniqueNames = new Set(playerNames)
  if (uniqueNames.size !== playerNames.length) {
    return new Error('All player names must be unique')
  }
  
  return playerNames.map(name => createPlayer(name))
}

// @EXPORT: Transaction history export functions
export const exportTransactionHistory = (player: Player, format: 'json' | 'csv' = 'json'): string => {
  if (format === 'csv') {
    const headers = 'timestamp,type,amount,description,relatedPropertyId'
    const rows = player.transactionHistory.map(t => 
      `${t.timestamp.toISOString()},${t.type},${t.amount.toString()},"${t.description}",${t.relatedPropertyId ?? ''}`
    )
    return [headers, ...rows].join('\n')
  }
  
  return JSON.stringify(player.transactionHistory, null, 2)
}

export const exportAllPlayersTransactionHistory = (players: Player[], format: 'json' | 'csv' = 'json'): string => {
  if (format === 'csv') {
    const headers = 'playerId,playerName,timestamp,type,amount,description,relatedPropertyId'
    const rows: string[] = []
    
    for (const player of players) {
      for (const transaction of player.transactionHistory) {
        rows.push(
          `${player.id},"${player.name}",${transaction.timestamp.toISOString()},${transaction.type},${transaction.amount.toString()},"${transaction.description}",${transaction.relatedPropertyId ?? ''}`
        )
      }
    }
    
    return [headers, ...rows].join('\n')
  }
  
  const exportData = players.map(player => ({
    playerId: player.id,
    playerName: player.name,
    transactions: player.transactionHistory
  }))
  
  return JSON.stringify(exportData, null, 2)
}

// @AUDIT: Financial audit and validation functions
const auditPlayerFinances = (player: Player, properties: Property[]): string[] => {
  const errors: string[] = []
  
  if (player.cash < 0) {
    errors.push(`Player ${player.name} has negative cash: $${player.cash.toString()}`)
  }
  
  const calculatedNetWorth = calculateNetWorth(player, properties)
  if (Math.abs(player.netWorth - calculatedNetWorth) > 0.01) {
    errors.push(`Player ${player.name} net worth mismatch: stored=${player.netWorth.toString()}, calculated=${calculatedNetWorth.toString()}`)
  }
  
  for (const propertyId of player.properties) {
    const property = properties.find(p => p.id === propertyId)
    if (!property) {
      errors.push(`Player ${player.name} owns non-existent property: ${propertyId}`)
    } else if (property.owner !== player.id) {
      errors.push(`Property ${propertyId} ownership mismatch: player claims ownership but property owner is ${property.owner ?? 'null'}`)
    }
  }
  
  return errors
}

const auditPropertyOwnership = (properties: Property[], players: Player[]): string[] => {
  const errors: string[] = []
  
  for (const property of properties) {
    if (property.owner !== null) {
      const owner = players.find(p => p.id === property.owner)
      if (!owner) {
        errors.push(`Property ${property.id} owned by non-existent player: ${property.owner}`)
      } else if (!owner.properties.includes(property.id)) {
        errors.push(`Property ${property.id} not listed in owner's property list`)
      }
    }
  }
  
  return errors
}

export const auditFinancialState = (gameState: GameState): MoneyResult<true> => {
  const errors: string[] = []
  
  for (const player of gameState.players) {
    errors.push(...auditPlayerFinances(player, gameState.properties))
  }
  
  errors.push(...auditPropertyOwnership(gameState.properties, gameState.players))
  
  if (errors.length > 0) {
    return new Error(`Financial audit failed:\n${errors.join('\n')}`)
  }
  
  return true
}