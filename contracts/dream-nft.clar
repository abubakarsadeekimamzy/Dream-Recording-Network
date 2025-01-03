;; Dream Experience NFT Contract

(define-non-fungible-token dream-experience uint)

(define-map dream-nft-data
  { token-id: uint }
  {
    dream-id: uint,
    title: (string-utf8 100),
    description: (string-utf8 500),
    rarity-score: uint,
    creator: principal
  }
)

(define-data-var last-token-id uint u0)

(define-public (mint-dream-nft (dream-id uint) (title (string-utf8 100)) (description (string-utf8 500)))
  (let
    (
      (new-token-id (+ (var-get last-token-id) u1))
      (dream (unwrap! (contract-call? .dream-data get-dream dream-id) (err u404)))
    )
    (asserts! (is-eq tx-sender (get dreamer dream)) (err u403))
    (try! (nft-mint? dream-experience new-token-id tx-sender))
    (map-set dream-nft-data
      { token-id: new-token-id }
      {
        dream-id: dream-id,
        title: title,
        description: description,
        rarity-score: (mod (len description) u100),
        creator: tx-sender
      }
    )
    (var-set last-token-id new-token-id)
    (ok new-token-id)
  )
)

(define-public (transfer-dream-nft (token-id uint) (recipient principal))
  (nft-transfer? dream-experience token-id tx-sender recipient)
)

(define-read-only (get-dream-nft-data (token-id uint))
  (ok (map-get? dream-nft-data { token-id: token-id }))
)

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

