import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { getAirjetCostingBasePreferSaved, upsertAirjetCostingBase } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import {buildParams} from "@modules/customer-hub/customer-orders/services/airjetCosting.js";
import {shallowEqual} from "react-redux";

export const useAirjetCostingBase = (seed) => {
  const [params, setParams] = useState(() => buildParams(seed))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showingSaved, setShowingSaved] = useState(false)
  const keyRef = useRef(null)
  const abortRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const next = buildParams(seed)
    if (shallowEqual(next, params)) return
    setParams(next)
  }, [seed])

  useEffect(() => {
    const hasKeys = params.quality_code || params.greige_item_code || params.design || params.color || params.greige_width
    if (!hasKeys) {
      setData(null)
      setShowingSaved(false)
      keyRef.current = null
      return
    }
    const key = JSON.stringify(params)
    if (keyRef.current === key) return
    keyRef.current = key
    if (timerRef.current) clearTimeout(timerRef.current)
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await getAirjetCostingBasePreferSaved(params, { signal: ac.signal })
        setData(res)
        setShowingSaved(!!res?.id)
      } finally {
        setLoading(false)
      }
    }, 150)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [params])

  const onChangeCosts = useCallback((patch) => setData((d) => ({ ...d, ...patch })), [])

  const onSave = useCallback(async () => {
    if (!data) return
    setSaving(true)
    try {
      const keys = {
        agreement_id: params.agreement_id,
        greige_item_code: params.greige_item_code,
        quality_code: params.quality_code,
        design: params.design,
        color: params.color,
        width: params.greige_width,
        email_id: params.agreement_id ? undefined : params.email_id
      }
      const saved = await upsertAirjetCostingBase(keys, data)
      setData(saved || data)
      setShowingSaved(true)
    } finally {
      setSaving(false)
    }
  }, [params, data])

  return { params, data, loading, saving, showingSaved, onChangeCosts, onSave }
}
