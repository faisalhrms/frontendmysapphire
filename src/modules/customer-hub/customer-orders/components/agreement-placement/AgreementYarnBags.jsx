import React from "react"
import KV from "./KV.jsx"
import Stat from "./Stat.jsx"
import { Package } from "lucide-react"
const AgreementYarnBags = ({ values }) => (
  <div>
    <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Yarn Bags</div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Dyed Bags" v={values.dyed_warp_bags} /></div>
      <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Ecru Bags" v={values.ecru_warp_bags} /></div>
      <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Dyed Bags" v={values.dyed_weft_bags} /></div>
      <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Ecru Bags" v={values.ecru_weft_bags} /></div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-3">
      <Stat Icon={Package} label="Total Dyed" value={values.dyed_bags || 0} />
      <Stat Icon={Package} label="Total Ecru" value={values.ecru_bags || 0} />
    </div>
  </div>
)
export default AgreementYarnBags
