import React, { useEffect, useMemo, useState } from "react"
import { Info, Settings } from "lucide-react"
import NumWidthRulesModal from "@modules/customer-hub/customer-orders/components/NumWidthRulesModal.jsx"
import { resolveNumWidthPanels } from "@modules/customer-hub/customer-orders/services/NumWidthRuleService.js"
import { loomTypeOptions } from "@modules/customer-hub/master-data/WeavingParameter/services/weavingSpecOptions.js"

const NumWidthStat = ({
  loomBand,
  loomType,
  widthIn,
  initialValue,
  className = "",
  ringClass = "border-amber-200/80",
  onResolved,
}) => {
  const [panels, setPanels] = useState(initialValue ?? null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const hint = useMemo(() => {
    const b = loomBand || "—"
    const lt = loomType || "All"
    const w = (widthIn ?? "") !== "" ? `${widthIn} in` : "—"
    return `${b} • ${lt} • ${w}`
  }, [loomBand, loomType, widthIn])

  const refresh = async () => {
    if (!loomBand || widthIn == null || widthIn === "") {
      setPanels(initialValue ?? null)
      onResolved && onResolved(initialValue ?? null)
      return
    }
    setLoading(true)
    try {
      const res = await resolveNumWidthPanels({
        loom_band: loomBand,
        loom_type: loomType || "",
        width_in: widthIn,
      })
      const value = res?.panels ?? initialValue ?? null
      setPanels(value)
      onResolved && onResolved(value)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [loomBand, loomType, widthIn])

  return (
    <>
        <div className={`relative rounded-lg px-4 py-3 text-center border ${ringClass} bg-white dark:bg-[#151515] ${className}`}>
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-md
                     text-slate-500 hover:text-slate-700 hover:bg-slate-100
                     dark:text-slate-300 dark:hover:bg-white/10"
          title="Edit criteria"
          onClick={() => setOpen(true)}
        >
          <Settings size={14} className="text-inherit" />
        </button>


          <div className="text-[.75rem] text-gray-600 dark:text-white/70 inline-flex items-center gap-2 justify-center">
            No. of Width
            <span className="inline-flex items-center" title={hint} aria-label={hint}>
              <Info size={12} />
            </span>
          </div>

          <div className="mt-0.5 text-[1.05rem] font-semibold">{loading ? "…" : (panels ?? "-")}</div>
        </div>


      <NumWidthRulesModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false)
          refresh()
        }}
        loomTypeOptions={loomTypeOptions}
      />
    </>
  )
}

export default NumWidthStat
