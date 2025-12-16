import React from "react"
import { Ruler, Activity,History } from "lucide-react"
import Stat from "@modules/customer-hub/customer-orders/components/agreement-placement/Stat.jsx"
import ChipAgreement from "@modules/customer-hub/customer-orders/components/agreement-placement/ChipAgreement.jsx"

const AgreementItemMeta = ({ qc, design, color, widthSeed,yarn_dyed_or_greige ,widthInches, widthCm, greigeItemCode, onOpenActivity, actionsCount = 0 }) => (
  <div>

    <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[.75rem]">Item Code</div>
        <div className="flex items-center gap-2">
          <span className="text-[.65rem] px-2 py-1 font-medium rounded-full bg-slate-700/5 dark:bg-white/10">
            {greigeItemCode || "-"}
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

export default AgreementItemMeta
