import { useCallback, useEffect, useMemo, useState } from "react"
import { getPrGenerationBase, upsertPrGeneration } from "@modules/customer-hub/customer-orders/services/PrGenerationService.js"
import {
    getAirjetCostingBasePreferSaved
} from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js";

const buildKeys = (seed) => {
  if (!seed) {
    return {
      agreement_id: null,
      greige_item_code: "",
      processed_item_code: "",
      quality_code: "",
      design: "",
      color: "",
      width: "",
    }
  }

  const greige =
    seed.payload?.greige_item_code ||
    seed.customer_item_matches?.[0]?.greige_item_code ||
    seed.greige_item_code ||
    ""

  const processed =
    seed.payload?.processed_item_code ||
    seed.item_no ||
    seed.customer_item_matches?.[0]?.processed_item_code ||
    ""

  const quality =
    seed.query_meta?.quality_code ||
    seed.quality ||
    seed.customer_item_matches?.[0]?.quality_code ||
    ""

  const design =
    seed.query_meta?.design ||
    seed.design ||
    seed.customer_item_matches?.[0]?.greige_design ||
    ""

  const color =
    seed.query_meta?.color ||
    seed.colour ||
    seed.customer_item_matches?.[0]?.greige_color ||
    ""

  const width =
    seed.query_meta?.width ||
    seed.width ||
    String(seed.customer_item_matches?.[0]?.greige_width || "") ||
    ""

  return {
    agreement_id: seed.id || null,
    greige_item_code: greige,
    processed_item_code: processed,
    quality_code: quality,
    design,
    color,
    width,
  }
}

export const usePrGeneration = (seed) => {
  const [keys, setKeys] = useState(() => buildKeys(seed))
  const [costingId, setCostingId] = useState(null)
  const [costingChecked, setCostingChecked] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setKeys(buildKeys(seed))
    setCostingId(null)
    setCostingChecked(false)
    setData(null)
  }, [seed])

  useEffect(() => {
    if (!keys.agreement_id && !keys.greige_item_code) {
      setCostingId(null)
      setCostingChecked(true)
      return
    }

    let cancelled = false

    const run = async () => {
      setCostingChecked(false)
      try {
        const res = await getAirjetCostingBasePreferSaved({
          agreement_id: keys.agreement_id,
          greige_item_code: keys.greige_item_code,
          quality_code: keys.quality_code,
          design: keys.design,
          color: keys.color,
          width: keys.width,
        })
        if (cancelled) return
        setCostingId(res && res.id ? res.id : null)
      } catch {
        if (cancelled) return
        setCostingId(null)
      } finally {
        if (!cancelled) setCostingChecked(true)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [keys])

  const hasAgreement = useMemo(() => !!keys.agreement_id, [keys])
  const hasCosting = useMemo(() => !!costingId, [costingId])

  const fetchData = useCallback(async () => {
    if (!hasAgreement || !hasCosting) {
      setLoading(false)
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await getPrGenerationBase({
        agreement_id: keys.agreement_id,
        costing_id: costingId,
        greige_item_code: keys.greige_item_code,
        processed_item_code: keys.processed_item_code,
      })
      setData(res)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [hasAgreement, hasCosting, keys, costingId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const save = useCallback(
    async (payload) => {
      if (!hasAgreement || !hasCosting) return null
      setSaving(true)
      setError(null)
      try {
        const res = await upsertPrGeneration({
          keys: {
            agreement_id: keys.agreement_id,
            costing_id: costingId,
          },
          patch: payload,
        })
        setData(res)
        return res
      } catch (e) {
        setError(e)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [hasAgreement, hasCosting, keys, costingId],
  )

  return {
    keys,
    data,
    setData,
    loading,
    saving,
    error,
    reload: fetchData,
    save,
    hasAgreement,
    hasCosting,
    costingChecked,
  }
}
