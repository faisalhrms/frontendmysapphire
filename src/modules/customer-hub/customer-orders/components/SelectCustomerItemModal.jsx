import React, { useMemo, useState } from "react"
import { Search, X, CheckCircle2 } from "lucide-react"

const Chip = ({ k, v }) =>
  v ? (
    <span className="inline-flex items-center gap-1 rounded-full border dark:border-defaultborder/20 px-2 py-1 text-xs">
      <span className="opacity-70">{k}:</span>
      <span className="font-medium">{v}</span>
    </span>
  ) : null

const SelectCustomerItemModal = ({ open, onClose, choices = [], onUse, queryMeta = {} }) => {
  const [filterText, setFilterText] = useState("")
  const [hoverItem, setHoverItem] = useState(null)

  const filteredChoices = useMemo(() => {
    const q = filterText.trim().toLowerCase()
    if (!q) return choices
    return choices.filter((i) => {
      const bag = [
        i.processed_item_code,
        i.quality_code,
        i.greige_design,
        i.finished_design_description,
        i.greige_color,
        i.finished_color_description,
        String(i.finished_width_cm || ""),
        String(i.finished_width_inches || "")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return bag.includes(q)
    })
  }, [choices, filterText])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-bodybg rounded-2xl shadow-2xl w-[96vw] max-w-5xl max-h-[86vh] overflow-hidden border dark:border-defaultborder/20">
        <div className="px-5 py-4 border-b dark:border-defaultborder/20 flex items-center justify-between">
          <div className="text-[.95rem] font-semibold">Select Customer Item</div>
          <button onClick={onClose} className="ti-btn ti-btn-light !mb-0 h-8 w-8 grid place-items-center">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-3 flex items-center gap-2 bg-light/40 dark:bg-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 opacity-60" size={16} />
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search item code, design, color, width"
              className="w-full pl-9 pr-3 h-9 rounded-md border dark:border-defaultborder/20 bg-white dark:bg-transparent text-sm"
            />
          </div>
          <div className="hidden md:flex flex-wrap gap-2">
            <Chip k="Quality" v={queryMeta.quality_code} />
            <Chip k="Design" v={queryMeta.design} />
            <Chip k="Color" v={queryMeta.color} />
            <Chip k="Width" v={queryMeta.width} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 lg:col-span-7 border-r dark:border-defaultborder/20 overflow-auto max-h-[62vh]">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-bodybg border-b dark:border-defaultborder/20">
                <tr className="text-left">
                  <th className="py-2 px-4">Item Code</th>
                  <th className="py-2 px-4">Design</th>
                  <th className="py-2 px-4">Color</th>
                  <th className="py-2 px-4">Width(cm)</th>
                  <th className="py-2 px-4">Width(in)</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChoices.map((i) => (
                  <tr
                    key={i.id}
                    onMouseEnter={() => setHoverItem(i)}
                    className="border-b dark:border-defaultborder/20 hover:bg-light/60 dark:hover:bg-white/5"
                  >
                    <td className="py-2 px-4 font-medium">{i.processed_item_code}</td>
                    <td className="py-2 px-4">{i.finished_design_description || i.greige_design}</td>
                    <td className="py-2 px-4">{i.finished_color_description || i.greige_color}</td>
                    <td className="py-2 px-4">{i.finished_width_cm}</td>
                    <td className="py-2 px-4">{i.finished_width_inches}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => onUse && onUse(i)}
                        className="ti-btn ti-btn-primary !mb-0 text-xs"
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredChoices.length ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-sm opacity-70">
                      No items in the list
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="col-span-12 lg:col-span-5 max-h-[62vh] overflow-auto">
            <div className="p-5">
              {hoverItem ? (
                <div className="rounded-xl border dark:border-defaultborder/20 p-4 space-y-3">
                  <div className="text-[.95rem] font-semibold">{hoverItem.processed_item_code}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="opacity-70">Quality</div>
                    <div className="font-medium">{hoverItem.quality_code || "-"}</div>
                    <div className="opacity-70">Design</div>
                    <div className="font-medium">{hoverItem.finished_design_description || hoverItem.greige_design || "-"}</div>
                    <div className="opacity-70">Color</div>
                    <div className="font-medium">{hoverItem.finished_color_description || hoverItem.greige_color || "-"}</div>
                    <div className="opacity-70">Width (cm)</div>
                    <div className="font-medium">{hoverItem.finished_width_cm || "-"}</div>
                    <div className="opacity-70">Width (in)</div>
                    <div className="font-medium">{hoverItem.finished_width_inches || "-"}</div>
                    <div className="opacity-70">Construction</div>
                    <div className="font-medium">{hoverItem.fab_construction || "-"}</div>
                    <div className="opacity-70">Warp Blend</div>
                    <div className="font-medium">{hoverItem.warp_blend || "-"}</div>
                    <div className="opacity-70">Weft Blend</div>
                    <div className="font-medium">{hoverItem.weft_blend || "-"}</div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => onUse && onUse(hoverItem)}
                      className="ti-btn ti-btn-success !mb-0 w-full inline-flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Use this item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border dark:border-defaultborder/20 p-8 text-center">
                  <div className="opacity-70">Hover a row to preview details</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t dark:border-defaultborder/20 flex items-center justify-between">
          <div className="text-xs opacity-70">Showing {filteredChoices.length} of {choices.length}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="ti-btn ti-btn-light !mb-0 text-sm">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectCustomerItemModal
