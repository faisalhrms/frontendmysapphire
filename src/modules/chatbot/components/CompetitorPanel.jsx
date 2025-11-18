import React from "react"

const allChecks = [
  { key: "unstiched", label: "Unstitched" },
  { key: "ready_to_wear", label: "Ready to wear" },
  { key: "per_site_snapshot", label: "Per-site snapshots" },
  { key: "side_by_side", label: "Side-by-side comparison" }
]

const CompetitorPanel = ({
  competitorSites = [],
  setCompetitorSites,
  competitorChecks = [],
  setCompetitorChecks
}) => {
  const sites = competitorSites && competitorSites.length ? competitorSites : []

  const toggleSiteEnabled = index => {
    const next = sites.map((s, i) =>
      i === index ? { ...s, enabled: !s.enabled } : s
    )
    setCompetitorSites(next)
  }

  const changeSiteUrl = (index, url) => {
    const next = sites.map((s, i) =>
      i === index ? { ...s, url } : s
    )
    setCompetitorSites(next)
  }

  const addSite = () => {
    const nextId = (sites.reduce((m, s) => Math.max(m, s.id || 0), 0) || 0) + 1
    const next = [
      ...sites,
      { id: nextId, url: "", enabled: true }
    ]
    setCompetitorSites(next)
  }

  const removeSite = index => {
    const next = sites.filter((_, i) => i !== index)
    setCompetitorSites(next)
  }

  const isChecked = key => Array.isArray(competitorChecks) && competitorChecks.includes(key)

  const toggleCheck = key => {
    if (!Array.isArray(competitorChecks)) {
      setCompetitorChecks([key])
      return
    }
    if (competitorChecks.includes(key)) {
      setCompetitorChecks(competitorChecks.filter(k => k !== key))
    } else {
      setCompetitorChecks([...competitorChecks, key])
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {sites.map((site, index) => (
          <div key={site.id ?? index} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={site.enabled !== false}
              onChange={() => toggleSiteEnabled(index)}
            />
            <input
              type="text"
              value={site.url || ""}
              onChange={e => changeSiteUrl(index, e.target.value)}
              placeholder="https://example.com"
              className="flex-1 !text-xs form-control !h-8"
            />
            {sites.length > 1 && (
              <button
                type="button"
                onClick={() => removeSite(index)}
                className="h-8 w-8 flex items-center justify-center rounded-full border text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSite}
        className="text-[11px] text-blue hover:underline mt-1"
      >
        + Add another site
      </button>

      <div className="mt-3 space-y-1">
        <div className="text-[11px] text-gray-500">
          Product filters
        </div>
        <div className="flex flex-wrap gap-2">
          {allChecks.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleCheck(item.key)}
              className={`px-3 py-1 rounded-full text-[11px] border ${
                isChecked(item.key)
                  ? "bg-blue text-white border-blue"
                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-2">
        Use the send button to fetch products and show side-by-side comparison.
      </p>
    </div>
  )
}

export default CompetitorPanel
