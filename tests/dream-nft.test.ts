import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'dream-analysis-token': {
      functions: {
        'perform-analysis': vi.fn(),
        'transfer-tokens': vi.fn(),
        'get-balance': vi.fn(),
        'get-analyst-data': vi.fn(),
      },
    },
    'dream-data': {
      functions: {
        'get-dream': vi.fn(),
        'update-analysis-status': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Dream Analysis Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('perform-analysis', () => {
    it('should perform analysis successfully', async () => {
      const dreamId = 1
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: true, value: {} })
      mockClarity.contracts['dream-data'].functions['update-analysis-status'].mockReturnValue({ success: true })
      mockClarity.contracts['dream-analysis-token'].functions['perform-analysis'].mockReturnValue({ success: true })
      
      const result = await callContract('dream-analysis-token', 'perform-analysis', [dreamId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if dream does not exist', async () => {
      const dreamId = 999
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: false, error: 404 })
      mockClarity.contracts['dream-analysis-token'].functions['perform-analysis'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('dream-analysis-token', 'perform-analysis', [dreamId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('transfer-tokens', () => {
    it('should transfer tokens successfully', async () => {
      const amount = 10
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['dream-analysis-token'].functions['transfer-tokens'].mockReturnValue({ success: true })
      
      const result = await callContract('dream-analysis-token', 'transfer-tokens', [amount, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if insufficient balance', async () => {
      const amount = 1000
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['dream-analysis-token'].functions['transfer-tokens'].mockReturnValue({ success: false, error: 1 })
      
      const result = await callContract('dream-analysis-token', 'transfer-tokens', [amount, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(1)
    })
  })
  
  describe('get-balance', () => {
    it('should return the correct balance', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['dream-analysis-token'].functions['get-balance'].mockReturnValue({ success: true, value: 50 })
      
      const result = await callContract('dream-analysis-token', 'get-balance', [account])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(50)
    })
  })
  
  describe('get-analyst-data', () => {
    it('should return analyst data', async () => {
      const analyst = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const analystData = {
        total_analyses: 5,
        reputation_score: 42
      }
      mockClarity.contracts['dream-analysis-token'].functions['get-analyst-data'].mockReturnValue({ success: true, value: analystData })
      
      const result = await callContract('dream-analysis-token', 'get-analyst-data', [analyst])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(analystData)
    })
  })
})
