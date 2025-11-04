import { useEffect, useRef, useState, useCallback } from "react"
import {
  getAirjetCostingBasePreferSaved,
  upsertAirjetCostingBase,
} from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import {
  buildParams,
  makeYarnCostPerYard,
  makeVariableCostPerYard,
  makeTargetProfitPerDayLoom,
  makeTargetPricePerYard,
  makeTargetPricePerMeter,
} from "@modules/customer-hub/customer-orders/services/airjetCosting.js"
import { shallowEqual } from "react-redux"

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
    const hasKeys =
      params.quality_code ||
      params.greige_item_code ||
      params.design ||
      params.color ||
      params.width

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
        const res = await getAirjetCostingBasePreferSaved(params, {
          signal: ac.signal,
        })
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

  const onChangeCosts = useCallback(
    (patch) => setData((d) => ({ ...(d || {}), ...patch })),
    []
  )

  const onSave = useCallback(async () => {
    if (!data) return
    setSaving(true)
    try {
      const widthKey =
        params.width ??
        (data.greige_width != null ? String(data.greige_width) : undefined)

      const keys = {
        agreement_id: params.agreement_id,
        greige_item_code: params.greige_item_code,
        quality_code: params.quality_code,
        design: params.design,
        color: params.color,
        width: widthKey,
        email_id: params.agreement_id ? undefined : params.email_id,
      }

      const yarnCostFn = makeYarnCostPerYard(data)
      const varCostFn = makeVariableCostPerYard(data)
      const targetProfitFn = makeTargetProfitPerDayLoom(data)
      const targetPriceYardFn = makeTargetPricePerYard(data)
      const targetPriceMeterFn = makeTargetPricePerMeter(data)

      const yarnCost = yarnCostFn()
      const variableCost = varCostFn()
      const targetProfit = targetProfitFn()
      const targetPriceYard = targetPriceYardFn()
      const targetPriceMeter = targetPriceMeterFn()

      const patch = {
        ...data,

        greige_width: data.greige_width,

        yarn_cost_per_yard:
          yarnCost != null ? yarnCost : data.yarn_cost_per_yard,
        variable_cost_per_yard:
          variableCost != null ? variableCost : data.variable_cost_per_yard,

        recovery_after_rejection:
          targetProfit != null ? targetProfit : data.recovery_after_rejection,

        target_price_per_yard:
          targetPriceYard != null
            ? targetPriceYard
            : data.target_price_per_yard,
        target_price_per_meter:
          targetPriceMeter != null
            ? targetPriceMeter
            : data.target_price_per_meter,

        final_fabric_cost_per_meter:
          targetPriceMeter != null
            ? targetPriceMeter
            : data.final_fabric_cost_per_meter,
      }

      const saved = await upsertAirjetCostingBase(keys, patch)
      setData(saved || patch)
      setShowingSaved(true)
    } finally {
      setSaving(false)
    }
  }, [params, data])

  return { params, data, loading, saving, showingSaved, onChangeCosts, onSave }
}
