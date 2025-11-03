import React from "react"
import { FileSpreadsheet } from "lucide-react"

const Key = ({ children }) => <span className="text-[.70rem] uppercase tracking-wide text-[#8c9097]">{children}</span>
const Val = ({ children }) => <span className="text-[.95rem] font-medium">{children ?? "-"}</span>

const ExtractionGrid = ({ data }) => {
  const entries = Object.entries(data || {})
  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-defaultborder/20 flex items-center gap-2">
        <FileSpreadsheet size={16} />
        <div className="text-[.9rem] font-semibold">Extracted Information</div>
      </div>
      <div className="p-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {entries.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-defaultborder/100 dark:border-defaultborder/20 p-3">
              <Key>{k.replace(/_/g, " ")}</Key>
              <div className="mt-1 break-words"><Val>{v}</Val></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExtractionGrid
