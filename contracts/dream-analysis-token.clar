;; Dream Analysis Token Contract

(define-fungible-token dream-analysis-token)

(define-map analyst-data
  { analyst: principal }
  {
    total-analyses: uint,
    reputation-score: uint
  }
)

(define-constant contract-owner tx-sender)

(define-public (perform-analysis (dream-id uint))
  (let
    (
      (dream (unwrap! (contract-call? .dream-data get-dream dream-id) (err u404)))
      (analyst-info (default-to { total-analyses: u0, reputation-score: u0 } (map-get? analyst-data { analyst: tx-sender })))
    )
    (try! (contract-call? .dream-data update-analysis-status dream-id "analyzed"))
    (try! (ft-mint? dream-analysis-token u10 tx-sender))
    (map-set analyst-data
      { analyst: tx-sender }
      {
        total-analyses: (+ (get total-analyses analyst-info) u1),
        reputation-score: (+ (get reputation-score analyst-info) u1)
      }
    )
    (ok true)
  )
)

(define-public (transfer-tokens (amount uint) (recipient principal))
  (ft-transfer? dream-analysis-token amount tx-sender recipient)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance dream-analysis-token account))
)

(define-read-only (get-analyst-data (analyst principal))
  (ok (map-get? analyst-data { analyst: analyst }))
)

