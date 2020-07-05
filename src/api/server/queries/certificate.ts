export const selectActiveCert = `
  SELECT *
  FROM certificate c
  WHERE c.instrumentId = i.id AND (
    c.date IS NULL OR (
      c.date >= o.arrivedAt AND (
        o.departedAt IS NULL OR
        c.date <= o.departedAt
      )
    )
  )
  ORDER BY c.date DESC
  FETCH FIRST 1 ROWS ONLY`

export const selectPastCert = `
  SELECT c.sign
  FROM certificate c
  WHERE c.instrumentId = i.id
  AND c.date < o.arrivedAt
  ORDER BY c.date DESC
  FETCH FIRST 1 ROWS ONLY`
