import React from "react"
import { Ruler, Activity } from "lucide-react"
import Stat from "@modules/customer-hub/customer-orders/components/agreement-placement/Stat.jsx"
import ChipAgreement from "@modules/customer-hub/customer-orders/components/agreement-placement/ChipAgreement.jsx"

const AgreementItemMeta = ({ qc, design, color, widthSeed, widthInches, widthCm, greigeItemCode, onOpenActivity, actionsCount = 0 ,yarn_dyed_or_greige}) => (
  <div>
    <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[.75rem]">Item Code</div>
        <div className="flex items-center gap-2">
          <span className="text-[.7rem] px-2 py-1 rounded-full bg-slate-700/5 dark:bg-white/10">{greigeItemCode || "-"}</span>
            <button
              type="button"
              title="Activity History"
              onClick={onOpenActivity}
              className="h-6 w-6 grid place-items-center rounded-md border border-slate-200/80 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ring-1 ring-indigo-200/60 hover:ring-indigo-300/70 text-indigo-600 dark:text-indigo-300 transition-colors"
            >
              <Activity size={14} />
            </button>

          {actionsCount ? <span className="text-[10px] opacity-60">({actionsCount})</span> : null}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
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

export default AgreementItemMeta
