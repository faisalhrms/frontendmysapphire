import React from "react"

const QCPanel = ({ qcTarget, setQcTarget, qcChecks, setQcChecks, qcRender, setQcRender }) => {
  const all = [
    ["status_code","HTTP 200"],
    ["title","Title"],
    ["meta_description","Meta Description"],
    ["h1","H1"],
    ["images_alt_ratio","Images Alt Ratio"],
    ["broken_links","Broken Links"],
    ["canonical","Canonical"],
    ["jsonld","JSON-LD"],
    ["viewport","Viewport"],
    ["html_lang","HTML Lang"],
    ["sitemap","Sitemap"],
    ["robots","Robots.txt"]
  ]
  const toggle = k => {
    if (qcChecks.includes(k)) setQcChecks(qcChecks.filter(x => x !== k))
    else setQcChecks([...qcChecks, k])
  }
  return (
    <div className="mt-2 border rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium">Target</span>
        <input
          value={qcTarget}
          onChange={e=>setQcTarget(e.target.value)}
          className="w-72 border rounded px-2 h-8 text-xs bg-white dark:bg-gray-800 truncate"
          placeholder="https://pk.sapphireonline.pk"
        />
        <label className="ml-1 text-[11px] inline-flex items-center gap-1">
          <input type="checkbox" className="form-check-input" checked={qcRender} onChange={e=>setQcRender(e.target.checked)} />
          <span>Render JS</span>
        </label>
      </div>
      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {all.map(([k,l])=>(
            <label
              key={k}
              className={`text-[10px] leading-none inline-flex items-center gap-1 border rounded-full px-2 py-[6px] ${qcChecks.includes(k) ? "ring-1 ring-info" : "bg-white dark:bg-gray-800"}`}
            >
              <input type="checkbox" className="form-check-input" checked={qcChecks.includes(k)} onChange={()=>toggle(k)} />
              <span className="truncate">{l}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QCPanel
