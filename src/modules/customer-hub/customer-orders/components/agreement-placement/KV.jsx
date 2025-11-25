import React from "react"
const KV = ({ k, v }) => <div className="flex items-center justify-between py-2 px-3"><span className="text-gray-600 dark:text-white/70 truncate">{k}</span><span className="font-medium !text-[.68rem]">{v ?? "-"}</span></div>
export default KV
