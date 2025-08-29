import React, { useMemo, useState } from "react"

const Badge = ({ ok }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${ok ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"}`}>
    <i className={`ri-${ok ? "checkbox-circle-fill" : "close-circle-fill"} text-xs`} />
    {ok ? "Pass" : "Fail"}
  </span>
)

const StatusPill = ({ code }) => {
  let cls = "bg-gray-100 text-gray-700"
  if (code === 0) cls = "bg-orange-100 text-orange-700"
  else if (code >= 500) cls = "bg-rose-100 text-rose-700"
  else if (code >= 400) cls = "bg-yellow-100 text-yellow-700"
  else if (code >= 300) cls = "bg-blue-100 text-blue-700"
  else if (code >= 200) cls = "bg-emerald-100 text-emerald-700"
  return <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${cls}`}>{code === 0 ? "ERR" : code}</span>
}

const CellValue = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-gray-400">—</span>
  if (typeof value === "string") return <span className="break-words">{value.length > 240 ? value.slice(0, 240) + "…" : value}</span>
  try {
    const s = JSON.stringify(value, null, 2)
    return <pre className="text-[11px] leading-4 whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded p-2 max-h-40 overflow-auto">{s}</pre>
  } catch {
    return <span className="break-words">{String(value)}</span>
  }
}

const parseBaseTableHtml = html => {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html")
    const target = doc.querySelector("p")?.textContent?.trim() || ""
    const rows = [...doc.querySelectorAll("table tbody tr")]
    const summary = rows.map(tr => {
      const [c1, c2, c3] = [...tr.querySelectorAll("td")]
      const check = c1?.textContent?.trim() || ""
      const ok = (c2?.textContent?.trim() || "").toLowerCase() === "pass"
      const raw = c3?.textContent?.trim() || ""
      let value = raw
      try { if (raw.startsWith("{") || raw.startsWith("[")) value = JSON.parse(raw) } catch {}
      return { check, ok, value }
    })
    return { target, summary, links: [] }
  } catch { return null }
}

export default function QCReport({ result, html, llm, title = "Quality Control" }) {
  const parsed = !result && html && html.includes("<table") ? parseBaseTableHtml(html) : null
  const data = result || parsed || null
  const [onlyFails, setOnlyFails] = useState(false)
  const [showAllBroken, setShowAllBroken] = useState(false)

  if (!data && html) {
    return (
      <div className="rounded-xl overflow-hidden ring-1 ring-black/5 border bg-white dark:bg-gray-800">
        <div className="px-4 py-2 flex items-center justify-between border-b dark:border-gray-700">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[12px] text-gray-500 dark:text-gray-400">Rendered</div>
        </div>
        <div className="p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    )
  }

  const items = useMemo(() => (data?.summary || []).map((r, i) => ({ ...r, i })), [data])
  const filtered = useMemo(() => items.filter(x => (onlyFails ? !x.ok : true)), [items, onlyFails])
  const total = items.length
  const passed = items.filter(x => x.ok).length
  const failed = total - passed

  const brokenItem = items.find(x => x.check === "broken_links")
  const broken = Array.isArray(brokenItem?.value?.broken) ? brokenItem.value.broken : []
  const testedCount = brokenItem?.value?.tested ?? (data?.links?.length || 0)
  const shownBroken = showAllBroken ? broken : broken.slice(0, 200)

  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-black/5 border bg-white dark:bg-gray-800">
      <div className="px-4 py-3 flex items-center justify-between border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{title}</span>
          {data?.target ? <a href={data.target} target="_blank" rel="noreferrer" className="text-xs text-blue hover:underline">{data.target}</a> : null}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"><i className="ri-check-line" />{passed}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"><i className="ri-close-line" />{failed}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"><i className="ri-list-check-2" />{total}</span>
          <button onClick={() => setOnlyFails(v => !v)} className={`ml-2 h-7 px-3 rounded-full text-xs border ${onlyFails ? "bg-rose-600 text-white border-rose-600" : "bg-transparent text-gray-700 dark:text-gray-200"}`}>
            {onlyFails ? "Showing Fails" : "Show Fails"}
          </button>
        </div>
      </div>

      {llm ? (
        <div className="px-4 pt-3">
          <div className="rounded-lg border dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20 p-3">
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: llm }} />
          </div>
        </div>
      ) : null}

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(row => (
            row.check === "broken_links" ? null : (
              <div key={row.i} className="rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300">{row.check}</div>
                  <Badge ok={row.ok} />
                </div>
                <CellValue value={row.value} />
              </div>
            )
          ))}
        </div>

        {brokenItem ? (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Broken Links</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Tested: <span className="font-medium">{testedCount}</span> · Broken: <span className="font-medium">{broken.length}</span>
              </div>
            </div>
            {broken.length === 0 ? (
              <div className="text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded px-3 py-2">
                No broken links detected.
              </div>
            ) : (
              <>
                <div className="overflow-auto rounded border dark:border-gray-700">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-100 dark:bg-gray-800/60">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">URL</th>
                        <th className="text-left px-3 py-2 font-medium w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {shownBroken.map((b, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="px-3 py-2">
                            <a href={b.url} target="_blank" rel="noreferrer" className="truncate inline-block max-w-[72ch] text-blue hover:underline dark:text-gray-300">{b.url}</a>
                          </td>
                          <td className="px-3 py-2"><StatusPill code={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {broken.length > shownBroken.length ? (
                  <div className="mt-2">
                    <button onClick={() => setShowAllBroken(true)} className="text-xs px-3 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      Show all {broken.length}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {data?.links?.length ? (
          <div className="mt-5">
            <div className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Links</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.links.slice(0, 12).map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noreferrer" className="truncate text-xs px-3 py-2 rounded border bg-white dark:bg-gray-900/40 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {u}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
