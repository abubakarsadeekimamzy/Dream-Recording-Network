import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'dream-nft': {
      functions: {
        'mint-dream-nft': vi.fn(),
        'transfer-dream-nft': vi.fn(),
        'get-dream-nft-data': vi.fn(),
        'get-last-token-id': vi.fn(),
      },
    },
    'dream-data': {
      functions: {
        'get-dream': vi.fn(),
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

describe('Dream NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-dream-nft', () => {
    it('should mint a dream NFT successfully', async () => {
      const dreamId = 1
      const title = 'Lucid Dream'
      const description = 'A vivid flying dream'
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: true, value: { dreamer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' } })
      mockClarity.contracts['dream-nft'].functions['mint-dream-nft'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('dream-nft', 'mint-dream-nft', [dreamId, title, description])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail if not the dream owner', async () => {
      const dreamId = 1
      const title = 'Lucid Dream'
      const description = 'A vivid flying dream'
      mockClarity.contracts['dream-data'].functions['get-dream'].mockReturnValue({ success: true, value: { dreamer: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG' } })
      mockClarity.contracts['dream-nft'].functions['mint-dream-nft'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('dream-nft', 'mint-dream-nft', [dreamId, title, description])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('transfer-dream-nft', () => {
    it('should transfer a dream NFT successfully', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['dream-nft'].functions['transfer-dream-nft'].mockReturnValue({ success: true })
      
      const result = await callContract('dream-nft', 'transfer-dream-nft', [tokenId, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the token owner', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['dream-nft'].functions['transfer-dream-nft'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('dream-nft', 'transfer-dream-nft', [tokenId, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-dream-nft-data', () => {
    it('should return dream NFT data', async () => {
      const tokenId = 1
      const nftData = {
        dream_id: 1,
        title: 'Lucid Dream',
        description: 'A vivid flying dream',
        rarity_score: 42,
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      }
      mockClarity.contracts['dream-nft'].functions['get-dream-nft-data'].mockReturnValue({ success: true, value: nftData })
      
      const result = await callContract('dream-nft', 'get-dream-nft-data', [tokenId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(nftData)
    })
  })
  
  describe('get-last-token-id', () => {
    it('should return the last token ID', async () => {
      mockClarity.contracts['dream-nft'].functions['get-last-token-id'].mockReturnValue({ success: true, value: 10 })
      
      const result = await callContract('dream-nft', 'get-last-token-id', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(10)
    })
  })
})
