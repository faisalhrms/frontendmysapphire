import React, { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { Activity, Database, Percent, CheckCircle2, ShieldCheck } from "lucide-react"
import useFilters from "@hooks/useFilters"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import useDataHealth from "@modules/dashboards/beirholmBi/hooks/useDataHealth.js"
import DataHealthDashboardFilter from "@modules/dashboards/beirholmBi/components/data-health/DataHealthDashboardFilter.jsx"
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx"
import ReChart from "@components/charts/ReChart.jsx"
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js"

const COLORS = DEFAULT_CHART_COLORS

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

const buildPieData = (primaryValue, primaryLabel, secondaryLabel) => {
  if (typeof primaryValue !== "number" || Number.isNaN(primaryValue)) return []
  const v = clampPct(primaryValue)
  return [
    { name: primaryLabel, value: v },
    { name: secondaryLabel, value: 100 - v },
  ]
}

export default function DataHealthDashboard() {
  const { control, errors } = useFilters(useMemo(() => ({ initialFilters: [] }), []))
  const filters = useWatch({ control })
  const { data } = useDataHealth(filters)

  const kpis = data?.kpis || {}
  const fieldOverview = data?.field_overview || []
  const dqTrendRaw = data?.dq_trend || {}

  const dqTrendData = useMemo(() => {
    const categories = dqTrendRaw.categories || []
    const series = dqTrendRaw.series && dqTrendRaw.series[0] ? dqTrendRaw.series[0].data || [] : []
    if (!categories.length || !series.length) return []
    return categories.map((name, index) => ({
      name,
      value: typeof series[index] === "number" ? series[index] : 0,
    }))
  }, [dqTrendRaw])

  const completenessPie = useMemo(
    () => buildPieData(kpis.completeness_pct, "Complete", "Blank/Null"),
    [kpis.completeness_pct]
  )

  const validityPie = useMemo(
    () => buildPieData(kpis.validity_pct, "Valid", "Invalid/Unknown"),
    [kpis.validity_pct]
  )

  const totalRowsValue =
    typeof kpis.total_rows === "number"
      ? kpis.total_rows.toLocaleString()
      : kpis.total_rows || "--"

  const dqScoreValue = formatPercent(kpis.dq_score)

  return (
    <>
      <PageHeader
        currentpage="Data Health Dashboard"
        activepage="Dashboards"
        mainpage="Data Health Dashboard"
      />

      <div className="space-y-6 pb-8 pt-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
                  Data Quality Overview
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor processed rows and overall data quality, completeness and validity
              </p>
            </div>
          </div>

          <DataHealthDashboardFilter control={control} errors={errors} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={Database}
            title="Total rows processed"
            value={totalRowsValue}
            subtitle={
              typeof kpis.issue_rows === "number"
                ? `${kpis.issue_rows.toLocaleString()} rows with issues`
                : undefined
            }
          />
          <StatCard
            icon={Percent}
            title="Overall DQ score"
            value={dqScoreValue}
            subtitle={
              typeof kpis.issue_cells === "number"
                ? `${kpis.issue_cells.toLocaleString()} issue cells`
                : undefined
            }
          />
          <StatCard
            icon={CheckCircle2}
            title="Completeness"
            value={formatPercent(kpis.completeness_pct)}
            subtitle="Non blank and non null cells"
          />
          <StatCard
            icon={ShieldCheck}
            title="Validity"
            value={formatPercent(kpis.validity_pct)}
            subtitle="Valid and known values"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overall data quality score (last 12 months)
              </h3>
            </div>
            <div className="h-[260px] mb-6">
              <ReChart
                data={dqTrendData}
                chartType="line"
                colors={DEFAULT_CHART_COLORS}
                dimensions={{ height: 300 }}
                chartConfig={{
                  line: {
                    strokeWidth: 3,
                    dotSize: 6,
                  },
                }}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Field wise data quality overview
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Per field distribution of valid, invalid and null values
                  </p>
                </div>
              </div>
              {fieldOverview.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No field level data available for current filters
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                          Field
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                          Valid
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                          Invalid
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                          Null
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {fieldOverview.map((row, index) => {
                        const rawValid = typeof row.valid_pct === "number" ? row.valid_pct : 0
                        const rawInvalid = typeof row.invalid_pct === "number" ? row.invalid_pct : 0
                        const rawNull = typeof row.null_pct === "number" ? row.null_pct : 0

                        const valid = clampPct(rawValid)
                        const invalid = clampPct(rawInvalid)
                        const nullPct = clampPct(rawNull)

                        const rowsValue =
                          typeof row.rows === "number"
                            ? row.rows.toLocaleString()
                            : row.rows || "-"

                        return (
                          <tr
                            key={row.header?.id || index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                              {row.header?.name || "-"}
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex items-center gap-3">
                                <span className="w-14 text-xs font-medium text-gray-900 dark:text-white">
                                  {formatPercent(valid)}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${valid}%`,
                                      backgroundColor: COLORS[0 % COLORS.length],
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex items-center gap-3">
                                <span className="w-14 text-xs font-medium text-gray-900 dark:text-white">
                                  {formatPercent(invalid)}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${invalid}%`,
                                      backgroundColor: COLORS[1 % COLORS.length],
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                              <div className="flex items-center gap-3">
                                <span className="w-14 text-xs font-medium text-gray-900 dark:text-white">
                                  {formatPercent(nullPct)}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${nullPct}%`,
                                      backgroundColor: COLORS[2 % COLORS.length],
                                    }}
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
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Completeness
              </h3>
              <div className="relative h-64 flex items-center justify-center">
                <ReChart
                  data={completenessPie}
                  chartType="pie"
                  colors={DEFAULT_CHART_COLORS}
                  dimensions={{ height: 256, pieRadius: 90 }}
                  chartConfig={{
                    pie: {
                      innerRadius: 55,
                      outerRadius: 90,
                      showLabel: false,
                    },
                  }}
                  showLegend
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatPercent(kpis.completeness_pct)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Validity
              </h3>
              <div className="relative h-64 flex items-center justify-center">
                <ReChart
                  data={validityPie}
                  chartType="pie"
                  colors={DEFAULT_CHART_COLORS}
                  dimensions={{ height: 256, pieRadius: 90 }}
                  chartConfig={{
                    pie: {
                      innerRadius: 55,
                      outerRadius: 90,
                      showLabel: false,
                    },
                  }}
                  showLegend
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Valid</span>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatPercent(kpis.validity_pct)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
