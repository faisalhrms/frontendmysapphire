import React, { useCallback, useEffect, useState } from "react"
import { Ruler, History, Copy, Check } from "lucide-react"
import Stat from "@modules/customer-hub/customer-orders/components/agreement-placement/Stat.jsx"
import ChipAgreement from "@modules/customer-hub/customer-orders/components/agreement-placement/ChipAgreement.jsx"

const AgreementItemMeta = ({
  qc,
  design,
  color,
  widthSeed,
  yarn_dyed_or_greige,
  widthInches,
  widthCm,
  itemCode,
  greigeItemCode,
  onOpenActivity,
  actionsCount = 0,
}) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async (text) => {
    const value = String(text || "").trim()
    if (!value || value === "-") return false

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        return true
      }
    } catch (_) {
    }
    console.log(itemCode)
    try {
      const ta = document.createElement("textarea")
      ta.value = value
      ta.setAttribute("readonly", "")
      ta.style.position = "fixed"
      ta.style.top = "-9999px"
      ta.style.left = "-9999px"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch (_) {
      return false
    }
  }, [])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(itemCode)
    if (ok) setCopied(true)
  }, [copyToClipboard, itemCode])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <div>
      <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[.75rem]">Item Code</div>

          <div className="flex items-center gap-2">
            <span className="relative text-[.65rem] py-1 pr-2 pl-7 font-medium rounded-full bg-slate-700/5 dark:bg-white/10">
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? "Copied" : "Copy item code"}
                aria-label="Copy item code"
                className="absolute left-1 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-slate-900/10 dark:hover:bg-white/10 transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>

              <span className="truncate">{greigeItemCode || "-"}</span>
            </span>

            <button
              type="button"
              title="Activity History"
              onClick={onOpenActivity}
              className="relative inline-flex h-7 px-3 items-center gap-1.5 rounded-full border border-slate-300 bg-white text-[0.7rem] font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 dark:bg-slate-900 dark:border-white/15 dark:text-white/80 dark:hover:bg-slate-800 transition-colors"
            >
              <History size={13} className="shrink-0" />
              <span>Activity</span>

              {actionsCount ? (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[0.55rem] font-semibold text-white dark:bg-white dark:text-slate-900">
                  {actionsCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <ChipAgreement k="Quality" v={qc} />
          <ChipAgreement k="Design" v={design} />
          <ChipAgreement k="Color" v={color} />
          <ChipAgreement k="Width" v={widthSeed} />
        </div>
      </div>

      <div className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Stat Icon={Ruler} label="G.Width (In)" value={widthInches || "-"} />
          <Stat Icon={Ruler} label="F.Width (Cm)" value={widthCm || "-"} />
        </div>
      </div>
    </div>
  )
}

export default AgreementItemMeta
