import React, { useEffect, useMemo, useState } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { getAirjetCostingBase } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import AirjetCostingBaseCards from "@modules/customer-hub/customer-orders/components/AirjetCostingBaseCards.jsx"

const AirjetCostingBaseSection = ({ seed }) => {
  const params = useMemo(() => {
    const pick = (o, keys) => keys.map(k => o?.[k]).find(v => v !== undefined && v !== null && v !== "") || ""
    return {
      quality_code: pick(seed || {}, ["quality_code", "quality"]),
      greige_item_code: pick(seed || {}, ["greige_item_code", "greige_item", "item_code"]),
      processed_item_code: pick(seed || {}, ["processed_item_code"]),
      design: pick(seed || {}, ["design", "greige_design", "finished_design_description"]),
      color: pick(seed || {}, ["color", "greige_color", "finished_color_description"]),
      width: pick(seed || {}, ["width", "width_cm", "finished_width_cm", "width_inches", "finished_width_inches", "greige_width"]),
    }
  }, [seed])

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      setLoading(true)
      try {
        const res = await getAirjetCostingBase(params)
        if (isMounted) setData(res)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (params.quality_code || params.greige_item_code || params.processed_item_code || params.design || params.color || params.width) run()
    else setData(null)
    return () => { isMounted = false }
  }, [params])

  if (loading) return <div className="py-6"><LoadingSpinner /></div>
  return <AirjetCostingBaseCards data={data} onChangeCosts={(patch) => setData(d => ({ ...d, ...patch }))} />
}

export default AirjetCostingBaseSection
