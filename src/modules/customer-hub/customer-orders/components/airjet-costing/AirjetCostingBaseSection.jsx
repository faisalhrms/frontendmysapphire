import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import AirjetCostingBaseCards from "@modules/customer-hub/customer-orders/components/airjet-costing/AirjetCostingBaseCards.jsx"
import { useAirjetCostingBase } from "@modules/customer-hub/customer-orders/hooks/airjet-costing/useAirjetCostingBase.js"

const AirjetCostingBaseSection = ({ seed }) => {
  const { data, loading, saving, showingSaved, onChangeCosts, onSave, onReset } = useAirjetCostingBase(seed)
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
        onChangeCosts={onChangeCosts}
        onSave={onSave}
        onReset={onReset}
        showingSaved={showingSaved}
      />
    </div>
  )
}

export default AirjetCostingBaseSection
