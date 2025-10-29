import React, { useEffect, useRef, useState, useCallback } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { getAirjetCostingBasePreferSaved, upsertAirjetCostingBase } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import AirjetCostingBaseCards from "@modules/customer-hub/customer-orders/components/AirjetCostingBaseCards.jsx"

const pick = (o, keys) => keys.map(k => o?.[k]).find(v => v !== undefined && v !== null && v !== "") || ""
const buildParams = (seed) => {
  const agreement_id = seed?.agreement_id || seed?.agreement?.id || undefined
  const email_id = agreement_id ? undefined : (seed?.email_id || seed?.email?.id || undefined)
  return {
    quality_code: pick(seed || {}, ["quality_code", "quality"]),
    greige_item_code: pick(seed || {}, ["greige_item_code", "greige_item", "item_code"]),
    design: pick(seed || {}, ["design", "greige_design", "finished_design_description"]),
    color: pick(seed || {}, ["color", "greige_color", "finished_color_description"]),
    width: pick(seed || {}, ["width", "width_cm", "finished_width_cm", "width_inches", "finished_width_inches", "greige_width"]),
    agreement_id,
    email_id
  }
}
const shallowEqual = (a, b) => {
  if (a === b) return true
  const ak = Object.keys(a), bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (let k of ak) if (a[k] !== b[k]) return false
  return true
}

const AirjetCostingBaseSection = ({ seed }) => {
  const [params, setParams] = useState(() => buildParams(seed))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showingSaved, setShowingSaved] = useState(false)
  const lastKeyRef = useRef(null)
  const abortRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const next = buildParams(seed)
    if (shallowEqual(next, params)) return
    setParams(next)
  }, [seed])

  useEffect(() => {
    const hasKeys = params.quality_code || params.greige_item_code || params.design || params.color || params.width
    if (!hasKeys) {
      setData(null)
      setShowingSaved(false)
      lastKeyRef.current = null
      return
    }
    const key = JSON.stringify(params)
    if (lastKeyRef.current === key) return
    lastKeyRef.current = key
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

  const handleSave = useCallback(async () => {
    if (!data) return
    setSaving(true)
    try {
      const keys = {
        agreement_id: params.agreement_id,
        greige_item_code: params.greige_item_code,
        quality_code: params.quality_code,
        design: params.design,
        color: params.color,
        width: params.width,
        email_id: params.agreement_id ? undefined : params.email_id
      }
      const saved = await upsertAirjetCostingBase(keys, data)
      setData(saved || data)
      setShowingSaved(true)
    } finally {
      setSaving(false)
    }
  }, [params, data])

  if (loading) return <div className="py-6"><LoadingSpinner /></div>

  return (
    <div className="relative">
      {saving && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/30 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
      <AirjetCostingBaseCards
        data={data}
        onChangeCosts={(patch) => setData(d => ({ ...d, ...patch }))}
        onSave={handleSave}
        showingSaved={showingSaved}
      />
    </div>
  )
}

export default AirjetCostingBaseSection
