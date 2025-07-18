// @TYPES: Core TypeScript type definitions for Real Estate Empire game

// @IDS: Unique identifier types
export type PropertyId = string
export type PlayerId = string

// @ENUMS: Game enumeration types
export enum PropertyType {
  Residential = 'residential',
  Commercial = 'commercial',
  Industrial = 'industrial',
  VacantLot = 'vacant_lot'
}

export enum DevelopmentLevel {
  Vacant = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  MaxDevelopment = 5
}

export enum GamePhase {
  MarketAnalysis = 'market_analysis',
  PropertyAcquisition = 'property_acquisition',
  Development = 'development',
  IncomeCollection = 'income_collection'
}

export enum AIStrategy {
  Aggressive = 'aggressive',
  Conservative = 'conservative',
  Balanced = 'balanced'
}

// @GEOMETRY: Spatial positioning types
export type GridPosition = {
  x: number
  y: number
}

// @GRID: Property grid system types
export type PropertyCell = {
  x: number
  y: number
  propertyId: PropertyId
  isSelectable: boolean
  isVisible: boolean
}

export type PropertyGrid = {
  width: number
  height: number
  cells: PropertyCell[]
  selectedProperty: PropertyId | null
}

// @MARKET: Market and economic types
export type MarketConditions = {
  trend: 'rising' | 'falling' | 'stable'
  volatility: 'low' | 'medium' | 'high'
  demandLevel: number
  interestRate: number
}

// @ENTITIES: Core game entity types
export type Property = {
  id: PropertyId
  position: GridPosition
  type: PropertyType
  value: number
  owner: PlayerId | null
  developmentLevel: DevelopmentLevel
  monthlyIncome: number
  developmentCost: number
  name: string
}

export type Player = {
  id: PlayerId
  name: string
  cash: number
  netWorth: number
  properties: PropertyId[]
  isAI: boolean
  strategy: AIStrategy
}

// @ACTIONS: Player action types
export type BuyAction = {
  type: 'buy'
  playerId: PlayerId
  propertyId: PropertyId
  amount: number
}

export type SellAction = {
  type: 'sell'
  playerId: PlayerId
  propertyId: PropertyId
  amount: number
}

export type DevelopAction = {
  type: 'develop'
  playerId: PlayerId
  propertyId: PropertyId
  amount: number
}

export type PassAction = {
  type: 'pass'
  playerId: PlayerId
}

export type NextTurnAction = {
  type: 'next_turn'
  playerId: PlayerId
}

export type GameAction = BuyAction | SellAction | DevelopAction | PassAction | NextTurnAction

// @STATE: Main game state type
export type GameState = {
  currentTurn: number
  currentPlayer: PlayerId
  phase: GamePhase
  players: Player[]
  properties: Property[]
  market: MarketConditions
  availableActions: GameAction[]
  selectedProperty: Property | null
  activityLog: string[]
}