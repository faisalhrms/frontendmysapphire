import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import YarnConsumptionCard from "@modules/customer-hub/customer-orders/components/agreement-placement/YarnConsumptionCard.jsx"

const YarnConsumptionModal = ({
  open,
  onClose,
  item,
  totalMeters,
  onTotalMetersChange,
  widthInches,
  widthCm,
  onComputed,
  dyeingMeta,
  rejPct,
  finishedMeters,
  onFinishedMetersChange,
  marginPct,
  onMarginPctChange,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.classList.add("overflow-hidden")
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.classList.remove("overflow-hidden")
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full md:max-w-4xl rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-bodybg pointer-events-auto">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="text-[.98rem] font-semibold">Yarn Consumption</div>
          <button type="button" className="ti-btn ti-btn-light !mb-0" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <YarnConsumptionCard
            item={item}
            totalMeters={totalMeters}
            onTotalMetersChange={onTotalMetersChange}
            widthInches={widthInches}
            widthCm={widthCm}
            onComputed={onComputed}
            dyeingMeta={dyeingMeta}
            initialRejPct={rejPct}
            finishedMeters={finishedMeters}
            onFinishedMetersChange={onFinishedMetersChange}
            marginPct={marginPct}
            onMarginPctChange={onMarginPctChange}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default YarnConsumptionModal
