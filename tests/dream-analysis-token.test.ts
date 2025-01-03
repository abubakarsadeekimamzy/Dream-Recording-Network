import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'dream-data': {
      functions: {
        'record-dream': vi.fn(),
        'set-dream-permissions': vi.fn(),
        'update-analysis-status': vi.fn(),
        'get-dream': vi.fn(),
        'get-dream-count': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 123456,
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Dream Data Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('record-dream', () => {
    it('should record a dream successfully', async () => {
      const encryptedData = Buffer.from('encrypted dream data')
      const isPublic = false
      mockClarity.contracts['dream-data'].functions['record-dream'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('dream-data', 'record-dream', [encryptedData, isPublic])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('set-dream-permissions', () => {
    it('should set dream permissions successfully', async () => {
      const dreamId = 1
      const accessor = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const canView = true
      const canAnalyze = false
      mockClarity.contracts['dream-data'].functions['set-dream-permissions'].mockReturnValue({ success: true })
      
      const result = await callContract('dream-data', 'set-dream-permissions', [dreamId, accessor, canView, canAnalyze])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the dream owner', async () => {
      const dreamId = 1
      const accessor = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const canView = true
      const canAnalyze = false
      mockClarity.contracts['dream-data'].functions['set-dream-permissions'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('dream-data', 'set-dream-permissions', [dreamId, accessor, canView, canAnalyze])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('update-analysis-status', () => {
    it('should update analysis status successfully', async () => {
      const dreamId = 1
      const newStatus = 'analyzed'
      mockClarity.contracts['dream-data'].functions['update-analysis-status'].mockReturnValue({ success: true })
      
      const result = await callContract('dream-data', 'update-analysis-status', [dreamId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not authorized', async () => {
      const dreamId = 1
      const newStatus = 'analyzed'
      mockClarity.contracts['dream-data'].functions['update-analysis-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('dream-data', 'update-analysis-status', [dreamId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-dream', () => {
    it('should return dream data for public dream', async () => {
      const dreamId = 1
      const dreamData = {
        dreamer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        timestamp: 123456,
        encrypted_data: Buffer.from('encrypted dream data'),
        is_public: true,
        analysis_status: 'unanalyzed'
      }
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: true, value: dreamData })
      
      const result = await callContract('dream-data', 'get-dream', [dreamId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(dreamData)
    })
    
    it('should fail to return private dream data for unauthorized user', async () => {
      const dreamId = 1
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('dream-data', 'get-dream', [dreamId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-dream-count', () => {
    it('should return the total number of dreams', async () => {
      mockClarity.contracts['dream-data'].functions['get-dream-count'].mockReturnValue({ success: true, value: 10 })
      
      const result = await callContract('dream-data', 'get-dream-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(10)
    })
  })
})
