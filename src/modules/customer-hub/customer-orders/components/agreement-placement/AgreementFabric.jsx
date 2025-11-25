import React from "react"
import KV from "@modules/customer-hub/customer-orders/components/agreement-placement/KV.jsx"

const AgreementFabric = ({
  fabricDetail,
  construction,
  weave,
  selvedge,
  warpBlend,
  weftBlend,
  warpYarnGrade,
  warpSpinMethod,
  weftYarnGrade,
  weftSpinMethod,
  yarn_dyed_or_greige,
  source,
}) => {
  const showFabricDetail = source !== "manual"

  const formatBlend = (blend, grade, spin) => {
    const primary = (blend || "").trim()
    const extras = [grade, spin].map((x) => (x || "").trim()).filter(Boolean)

    if (!primary && !extras.length) return ""
    if (!primary) return extras.join(" / ")
    if (!extras.length) return primary
    return `${primary} · ${extras.join(" / ")}`
  }

  const warpBlendDisplay = formatBlend(warpBlend, warpYarnGrade, warpSpinMethod)
  const weftBlendDisplay = formatBlend(weftBlend, weftYarnGrade, weftSpinMethod)

  return (
    <div>
      <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">
        Fabric
      </div>
      <div className="rounded-xl border border-slate-200/70 dark:border-white/10 divide-y divide-slate-200/70 dark:divide-white/10 bg-white/60 dark:bg-white/5">
        <KV k="Type" v={yarn_dyed_or_greige} />
        {showFabricDetail && <KV k="Fabric Detail" v={fabricDetail} />}
        <KV k="Construction" v={construction} />
        <KV k="Weave" v={weave} />
        <KV k="Selvedge" v={selvedge} />
        <KV k="Warp Blend" v={warpBlendDisplay} />
        <KV k="Weft Blend" v={weftBlendDisplay} />
      </div>
    </div>
  )
}

export default AgreementFabric
