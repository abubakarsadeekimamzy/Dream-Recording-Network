;; Dream Data Management Contract

(define-map dreams
  { dream-id: uint }
  {
    dreamer: principal,
    timestamp: uint,
    encrypted-data: (buff 1024),
    is-public: bool,
    analysis-status: (string-ascii 20)
  }
)

(define-map dream-permissions
  { dream-id: uint, accessor: principal }
  { can-view: bool, can-analyze: bool }
)

(define-data-var dream-count uint u0)

(define-public (record-dream (encrypted-data (buff 1024)) (is-public bool))
  (let
    (
      (new-dream-id (+ (var-get dream-count) u1))
    )
    (map-set dreams
      { dream-id: new-dream-id }
      {
        dreamer: tx-sender,
        timestamp: block-height,
        encrypted-data: encrypted-data,
        is-public: is-public,
        analysis-status: "unanalyzed"
      }
    )
    (var-set dream-count new-dream-id)
    (ok new-dream-id)
  )
)

(define-public (set-dream-permissions (dream-id uint) (accessor principal) (can-view bool) (can-analyze bool))
  (let
    (
      (dream (unwrap! (map-get? dreams { dream-id: dream-id }) (err u404)))
    )
    (asserts! (is-eq (get dreamer dream) tx-sender) (err u403))
    (ok (map-set dream-permissions
      { dream-id: dream-id, accessor: accessor }
      { can-view: can-view, can-analyze: can-analyze }
    ))
  )
)

(define-public (update-analysis-status (dream-id uint) (new-status (string-ascii 20)))
  (let
    (
      (dream (unwrap! (map-get? dreams { dream-id: dream-id }) (err u404)))
      (permissions (unwrap! (map-get? dream-permissions { dream-id: dream-id, accessor: tx-sender }) (err u403)))
    )
    (asserts! (get can-analyze permissions) (err u403))
    (ok (map-set dreams
      { dream-id: dream-id }
      (merge dream { analysis-status: new-status })
    ))
  )
)

(define-read-only (get-dream (dream-id uint))
  (let
    (
      (dream (unwrap! (map-get? dreams { dream-id: dream-id }) (err u404)))
    )
    (if (or (get is-public dream) (is-eq (get dreamer dream) tx-sender))
      (ok dream)
      (let
        (
          (permissions (default-to { can-view: false, can-analyze: false } (map-get? dream-permissions { dream-id: dream-id, accessor: tx-sender })))
        )
        (if (get can-view permissions)
          (ok dream)
          (err u403)
        )
      )
    )
  )
)

(define-read-only (get-dream-count)
  (ok (var-get dream-count))
)

