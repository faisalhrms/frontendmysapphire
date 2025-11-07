import React from "react"
import KV from "./KV.jsx"
const AgreementFabric = ({ fabricDetail, construction, warpBlend, weftBlend ,yarn_dyed_or_greige}) => (
  <div>
    <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Fabric</div>
    <div className="rounded-xl border border-slate-200/70 dark:border-white/10 divide-y divide-slate-200/70 dark:divide-white/10 bg-white/60 dark:bg-white/5">
      <KV k="Type" v={yarn_dyed_or_greige} />
      <KV k="Fabric Detail" v={fabricDetail} />
      <KV k="Construction" v={construction} />
      <KV k="Warp Blend" v={warpBlend} />
      <KV k="Weft Blend" v={weftBlend} />
    </div>
  </div>
)
export default AgreementFabric
