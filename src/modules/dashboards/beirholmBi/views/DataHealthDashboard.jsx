import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react"
import { useWatch } from "react-hook-form"
import { BarChart3, Database, ShieldCheck, Globe2, Layers3 } from "lucide-react"

import useFilters from "@hooks/useFilters"
import DataHealthDashboardFilter from "@modules/dashboards/beirholmBi/components/data-health/DataHealthDashboardFilter.jsx"
import useDataHealth from "@modules/dashboards/beirholmBi/hooks/useDataHealth.js"
import ReChart from "@components/charts/ReChart.jsx"
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js"

const COLORS = DEFAULT_CHART_COLORS

export const productCountry = [
  { value: "pakistan", label: "Pakistan" },
  { value: "india", label: "India" },
  { value: "vietnam", label: "Vietnam" },
  { value: "turkey", label: "Turkey" },
]

const formatPercent = value => {
  if (typeof value !== "number" || Number.isNaN(value)) return "--"
  return `${value.toFixed(2)}%`
}

const clampPct = value => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 100) return 100
  return value
}

const formatInt = value => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0"
  return value.toLocaleString()
}

export default function DataHealthDashboard() {
  const { control, errors } = useFilters(
    useMemo(() => ({ initialFilters: [] }), [])
  )
  const filters = useWatch({ control }) || {}

  const { data, isLoading } = useDataHealth(filters)

  const kpis = data?.kpis || {}
  const fieldOverview = data?.field_overview || []
  const dqTrendRaw = data?.dq_trend || {}
  const table = data?.table || []
  const perCategory = data?.per_category || []
  const perCountry = data?.per_country || []
  const monthlyValidityRaw = data?.monthly_validity || {}

  const monthlyValidityAll = Array.isArray(monthlyValidityRaw.all)
    ? monthlyValidityRaw.all
    : []
  const monthlyValidityByHeader = Array.isArray(monthlyValidityRaw.by_header)
    ? monthlyValidityRaw.by_header
    : []

  const totalRows = typeof kpis.total_rows === "number" ? kpis.total_rows : 0
  const issueRows = typeof kpis.issue_rows === "number" ? kpis.issue_rows : 0
  const cleanRows = Math.max(0, totalRows - issueRows)

  const totalRowsValue = formatInt(totalRows)
  const cleanRowsValue = formatInt(cleanRows)
  const issueRowsValue = formatInt(issueRows)

  const completenessValue = formatPercent(kpis.completeness_pct)
  const validityValue = formatPercent(kpis.validity_pct)
  const invalidityValue = formatPercent(kpis.invalid_pct) // now from backend (unknown+invalid)
  const dqScoreValue = formatPercent(kpis.dq_score)

  // Category mapping (Bed / Towel)
  const categoryByName = useMemo(() => {
    const map = new Map()
    perCategory.forEach(cat => {
      if (!cat) return
      const key = String(cat.name || "").toLowerCase()
      if (key) map.set(key, cat)
    })
    return map
  }, [perCategory])

  const bedCategory = categoryByName.get("bed") || {}
  const towelCategory = categoryByName.get("towel") || {}

  const bedValidPct = clampPct(
    typeof bedCategory.valid_pct === "number" ? bedCategory.valid_pct : 0
  )
  const towelValidPct = clampPct(
    typeof towelCategory.valid_pct === "number" ? towelCategory.valid_pct : 0
  )

  const bedRows = formatInt(
    typeof bedCategory.rows === "number" ? bedCategory.rows : 0
  )
  const towelRows = formatInt(
    typeof towelCategory.rows === "number" ? towelCategory.rows : 0
  )

  // Country stats (Pakistan, India, Vietnam, Turkey etc.)
  const countryStats = useMemo(() => {
    const map = new Map()
    perCountry.forEach(c => {
      const key = String(c.country || "").toLowerCase()
      if (key) map.set(key, c)
    })

    return productCountry.map(opt => {
      const stats = map.get(opt.value) || {}
      const rows = typeof stats.rows === "number" ? stats.rows : 0
      const valid_pct =
        typeof stats.valid_pct === "number" ? clampPct(stats.valid_pct) : 0
      const invalid_pct =
        typeof stats.invalid_pct === "number" ? clampPct(stats.invalid_pct) : 0
      const null_pct =
        typeof stats.null_pct === "number" ? clampPct(stats.null_pct) : 0

      return {
        ...opt,
        rows,
        valid_pct,
        invalid_pct,
        null_pct,
      }
    })
  }, [perCountry])

  const totalCountryRows = countryStats.reduce(
    (sum, c) => sum + (typeof c.rows === "number" ? c.rows : 0),
    0
  )
  const totalCountryRowsValue = formatInt(totalCountryRows)
  const activeCountriesCount =
    countryStats.filter(c => c.rows > 0).length || countryStats.length

  const topCountries = [...countryStats]
    .sort((a, b) => b.rows - a.rows)
    .slice(0, 4)

  // Overall DQ score trend (last 12 months)
  const dqTrendData = useMemo(() => {
    const categories = dqTrendRaw.categories || []
    const series =
      dqTrendRaw.series && dqTrendRaw.series[0]
        ? dqTrendRaw.series[0].data || []
        : []
    if (!categories.length || !series.length) return []
    return categories.map((name, index) => ({
      name,
      value: typeof series[index] === "number" ? series[index] : 0,
    }))
  }, [dqTrendRaw])

  // Tabs: "All" + 1 per header
  const [selectedHeaderId, setSelectedHeaderId] = useState("all")

  const headerTabs = useMemo(
    () => [
      { id: "all", label: "All" },
      ...monthlyValidityByHeader.map(h => ({
        id: h.header?.id,
        label: h.header?.name || `Header ${h.header?.id}`,
      })),
    ],
    [monthlyValidityByHeader]
  )

  const handleHeaderTabClick = useCallback(id => {
    setSelectedHeaderId(id)
  }, [])

  // Reset tab if headers change
  useEffect(() => {
    if (
      selectedHeaderId !== "all" &&
      !monthlyValidityByHeader.some(
        h => String(h.header?.id) === String(selectedHeaderId)
      )
    ) {
      setSelectedHeaderId("all")
    }
  }, [monthlyValidityByHeader, selectedHeaderId])

  // Monthly validity series (All tab or individual header)
  const monthlyValidityTrend = useMemo(() => {
    let source = []

    if (monthlyValidityAll.length || monthlyValidityByHeader.length) {
      if (selectedHeaderId === "all") {
        source = monthlyValidityAll
      } else {
        const match = monthlyValidityByHeader.find(
          h => String(h.header?.id) === String(selectedHeaderId)
        )
        source = match?.points || []
      }

      return (source || []).map(p => {
        const valid = clampPct(
          typeof p.valid_pct === "number" ? p.valid_pct : 0
        )
        const invalid = clampPct(
          typeof p.invalid_pct === "number" ? p.invalid_pct : 0
        )
        const nullPct = clampPct(
          typeof p.null_pct === "number" ? p.null_pct : 0
        )

        return {
          name: p.period || "",
          value: valid, // chart line
          valid_pct: valid,
          invalid_pct: invalid,
          null_pct: nullPct,
        }
      })
    }

    // Fallback from table
    if (!Array.isArray(table) || table.length === 0) return []
    return table.map(row => {
      const blanks = typeof row.blanks_pct === "number" ? row.blanks_pct : 0
      const unknown = typeof row.unknown_pct === "number" ? row.unknown_pct : 0
      const dots = typeof row.dots_pct === "number" ? row.dots_pct : 0
      const invalid = typeof row.invalid_pct === "number" ? row.invalid_pct : 0

      const nullPct = clampPct(blanks + dots)
      const invalidPct = clampPct(unknown + invalid)
      const validPct = clampPct(100 - nullPct - invalidPct)

      return {
        name: row.period || "",
        value: validPct,
        valid_pct: validPct,
        invalid_pct: invalidPct,
        null_pct: nullPct,
      }
    })
  }, [
    monthlyValidityAll,
    monthlyValidityByHeader,
    selectedHeaderId,
    table,
  ])

  // Custom tooltip for Monthly Validity chart
  const renderMonthlyTooltip = useCallback(
    ({ active, payload, label }) => {
      if (!active || !payload || !payload.length) return null
      const p = payload[0]?.payload || {}

      const valid = formatPercent(
        typeof p.valid_pct === "number" ? p.valid_pct : 0
      )
      const invalid = formatPercent(
        typeof p.invalid_pct === "number" ? p.invalid_pct : 0
      )
      const nullPct = formatPercent(
        typeof p.null_pct === "number" ? p.null_pct : 0
      )

      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-xs">
          <div className="font-semibold text-gray-800 mb-1">{label}</div>
          <div className="space-y-0.5">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Valid</span>
              <span className="font-medium text-emerald-600">{valid}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Invalid</span>
              <span className="font-medium text-rose-600">{invalid}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Null</span>
              <span className="font-medium text-slate-600">{nullPct}</span>
            </div>
          </div>
        </div>
      )
    },
    []
  )

  return (
    <div className="space-y-8 mx-auto pb-10 px-4 lg:px-0">
      {/* Header + Filters */}
      <div className="bg-white my-6 dark:bg-bodybg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 size={22} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight dark:text-white">
                EXPORT DATA HEALTH DASHBOARD
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Monitors processed rows, data quality, completeness, validity,
                monthly trends, and null values.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <DataHealthDashboardFilter control={control} errors={errors} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Data Quality Overview */}
        <div className="bg-gradient-to-br from-blue to-purple rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Data Quality Overview
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <ShieldCheck className="text-white" size={24} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">Overall Data Quality Score</p>
                <p className="text-4xl font-bold text-white">{dqScoreValue}</p>
                <p className="text-xs text-white">
                  Based on valid, invalid, and null cells across all headers.
                </p>
              </div>

              <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-xs text-white">Bed Rows</p>
                  <p className="text-2xl font-bold text-white">{bedRows}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-xs text-white">Towel Rows</p>
                  <p className="text-2xl font-bold text-white">{towelRows}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                <Database size={16} />
                <span className="text-sm font-medium">
                  {issueRowsValue} rows with detected issues
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Completeness / Validity by Category */}
        <div className="bg-gradient-to-br from-black to-green rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Completeness by Category
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Layers3 className="text-white" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">
                  Overall Validity and Invalidity Score
                </p>
                <p className="text-3xl font-bold text-white">
                  {validityValue} valid
                </p>
                <p className="text-xs text-white mt-1">
                  Invalid:{" "}
                  <span className="font-semibold">{invalidityValue}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-white/30 space-y-3">
                {/* Bed */}
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">Bed (Valid)</span>
                    <span className="text-sm font-bold text-white">
                      {formatPercent(bedValidPct)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${bedValidPct}%` }}
                    />
                  </div>
                </div>

                {/* Towel */}
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">Towel (Valid)</span>
                    <span className="text-sm font-bold text-white">
                      {formatPercent(towelValidPct)}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${towelValidPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                <ShieldCheck size={16} />
                <span className="text-sm font-medium">
                  Completeness: {completenessValue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Country Validity */}
        <div className="bg-gradient-to-br from-red to-orange rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Country Validity
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Globe2 className="text-white" size={24} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">Total Countries</p>
                <p className="text-4xl font-bold text-white">
                  {activeCountriesCount}
                </p>
                <p className="text-xs text-white">
                  Active product countries with data
                </p>
              </div>

              <div className="pt-4 border-t border-white/30 space-y-3 max-h-[140px] overflow-y-auto pr-2">
                {topCountries.length > 0 ? (
                  topCountries.map((country, index) => (
                    <div
                      key={country.value || index}
                      className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {country.label}
                          </p>
                          <p className="text-xs text-white">
                            {formatInt(country.rows)} rows
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {formatPercent(country.valid_pct)}
                          </p>
                          <p className="text-xs text-white">
                            Invalid {formatPercent(country.invalid_pct)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-xs text-white">
                      No country-level data available
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                <Globe2 size={16} />
                <span className="text-sm font-medium">
                  {totalCountryRowsValue} total rows across countries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall DQ chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Overall Data Quality (last 12 months)
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Shows the trend of overall data quality scores for the last 12
              months.
            </p>
          </div>
        </div>
        <div className="px-4 pb-6 pt-4">
          <div className="h-[260px]">
            <ReChart
              data={dqTrendData}
              chartType="line"
              colors={DEFAULT_CHART_COLORS}
              dimensions={{ height: 260 }}
              chartConfig={{
                line: {
                  strokeWidth: 3,
                  dotSize: 5,
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Monthly Validity Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 flex-wrap">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Monthly Validity Overview
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Shows validity trend by month. Use the tabs to switch between all
              data and individual headers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {headerTabs.map(tab => {
              const active = String(selectedHeaderId) === String(tab.id)
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleHeaderTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all border ${
                    active
                      ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="px-4 pb-6 pt-4">
          <div className="h-[260px]">
            <ReChart
              data={monthlyValidityTrend}
              chartType="line"
              colors={DEFAULT_CHART_COLORS}
              dimensions={{ height: 260 }}
              chartConfig={{
                line: {
                  strokeWidth: 3,
                  dotSize: 5,
                },
                tooltipRenderer: renderMonthlyTooltip,
              }}
            />
          </div>
        </div>
      </div>

      {/* Data Quality Status by Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Data Quality Status by Header
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Breakdown of valid, invalid, and null percentages for each header.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Header
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Valid
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Invalid
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Null
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fieldOverview.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No field level data available for current filters.
                  </td>
                </tr>
              )}
              {fieldOverview.map(row => {
                const valid = clampPct(
                  typeof row.valid_pct === "number" ? row.valid_pct : 0
                )
                const invalid = clampPct(
                  typeof row.invalid_pct === "number" ? row.invalid_pct : 0
                )
                const nullPct = clampPct(
                  typeof row.null_pct === "number" ? row.null_pct : 0
                )

                return (
                  <tr
                    key={row.header?.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.header?.name || "-"}
                    </td>

                    {/* Valid */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(valid)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${valid}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Invalid */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(invalid)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-rose-500 transition-all duration-500"
                            style={{ width: `${invalid}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Null */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(nullPct)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-slate-400 transition-all duration-500"
                            style={{ width: `${nullPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && (
        <div className="text-xs text-gray-500">Loading data health metrics…</div>
      )}
    </div>
  )
}
