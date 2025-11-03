import React from "react"
const ChipAgreement = ({ k, v }) => (v ? <span className="inline-flex items-center gap-1 rounded-full border dark:border-defaultborder/20 px-2 py-1 text-xs"><span className="opacity-70">{k}:</span><span className="font-medium">{v}</span></span> : null)
export default ChipAgreement
