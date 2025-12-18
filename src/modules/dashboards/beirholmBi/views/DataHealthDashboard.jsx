import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { BarChart3, ShieldCheck, Globe2, Layers3 } from "lucide-react";

import useFilters from "@hooks/useFilters";
import DataHealthDashboardFilter from "@modules/dashboards/beirholmBi/components/data-health/DataHealthDashboardFilter.jsx";
import useDataHealth from "@modules/dashboards/beirholmBi/hooks/useDataHealth.js";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";

const COLORS = DEFAULT_CHART_COLORS;

export const productCountry = [
  { value: "pakistan", label: "Pakistan" },
  { value: "india", label: "India" },
  { value: "vietnam", label: "Vietnam" },
  { value: "turkey", label: "Turkey" },
];

const formatPercent = v =>
  typeof v === "number" && !Number.isNaN(v) ? `${v.toFixed(2)}%` : "--";

const clampPct = v =>
  typeof v === "number" && !Number.isNaN(v) ? Math.min(100, Math.max(0, v)) : 0;

const formatInt = v =>
  typeof v === "number" && !Number.isNaN(v) ? v.toLocaleString() : "0";

export default function DataHealthDashboard() {
  const { control, errors } = useFilters(
    useMemo(() => ({ initialFilters: [] }), [])
  );
  const filters = useWatch({ control }) || {};
  const { data, isLoading } = useDataHealth(filters);

  const kpis = data?.kpis || {};
  const fieldOverview = data?.field_overview || [];
  const dqTrendRaw = data?.dq_trend || {};
  const table = data?.table || [];
  const perCategory = data?.per_category || [];
  const perCountry = data?.per_country || [];
  const monthlyValidityRaw = data?.monthly_validity || {};
  const monthlyValidityAll = Array.isArray(monthlyValidityRaw.all)
    ? monthlyValidityRaw.all
    : [];
  const monthlyValidityByHeader = Array.isArray(monthlyValidityRaw.by_header)
    ? monthlyValidityRaw.by_header
    : [];

  const rawRows = typeof kpis.raw_rows === "number" ? kpis.raw_rows : 0;
  const cleanRows = typeof kpis.clean_rows === "number" ? kpis.clean_rows : 0;
  const totalRows =
    typeof kpis.total_rows === "number" ? kpis.total_rows : rawRows + cleanRows;

  const totalRowsValue = formatInt(totalRows);
  const cleanRowsValue = formatInt(cleanRows);
  const rawRowsValue = formatInt(rawRows);

  const maxRowCount = Math.max(cleanRows, rawRows, 0);
  const cleanRowsShare =
    maxRowCount > 0 ? clampPct((cleanRows / maxRowCount) * 100) : 0;
  const rawRowsShare =
    maxRowCount > 0 ? clampPct((rawRows / maxRowCount) * 100) : 0;

  const validityPctAll = clampPct(
    typeof kpis.validity_pct === "number" ? kpis.validity_pct : 0
  );
  const invalidPctAll = clampPct(
    typeof kpis.invalid_pct === "number" ? kpis.invalid_pct : 0
  );
  const overallValidityValue = formatPercent(validityPctAll);

  const completenessFilledPct = clampPct(validityPctAll + invalidPctAll);
  const completenessFilledValue = formatPercent(completenessFilledPct);

  const categoryByName = useMemo(() => {
    const m = new Map();
    perCategory.forEach(c => {
      const key = String(c.name || "").toLowerCase();
      if (key) m.set(key, c);
    });
    return m;
  }, [perCategory]);

  const bed = categoryByName.get("bed") || {};
  const towel = categoryByName.get("towel") || {};
  const bedValidPct = clampPct(
    typeof bed.valid_pct === "number" ? bed.valid_pct : 0
  );
  const towelValidPct = clampPct(
    typeof towel.valid_pct === "number" ? towel.valid_pct : 0
  );
  const bedRows = formatInt(typeof bed.rows === "number" ? bed.rows : 0);
  const towelRows = formatInt(typeof towel.rows === "number" ? towel.rows : 0);

  const countryStats = useMemo(() => {
    const lookup = new Map();
    perCountry.forEach(c => {
      const k = String(c.country || "").toLowerCase();
      if (k) lookup.set(k, c);
    });

    return productCountry.map(opt => {
      const s = lookup.get(opt.value) || {};
      const rows = typeof s.rows === "number" ? s.rows : 0;

      const valid_pct = clampPct(
        typeof s.valid_pct === "number" ? s.valid_pct : 0
      );
      const invalid_pct = clampPct(
        typeof s.invalid_pct === "number" ? s.invalid_pct : 0
      );
      const null_pct = clampPct(
        typeof s.null_pct === "number" ? s.null_pct : 0
      );
      const filled_pct = clampPct(valid_pct + invalid_pct);

      return {
        ...opt,
        rows,
        filled_pct,
        valid_pct,
        invalid_pct,
        null_pct,
      };
    });
  }, [perCountry]);

  const topCountries = [...countryStats]
    .sort((a, b) => b.rows - a.rows)
    .slice(0, 4);

  const dqTrendData = useMemo(() => {
    const cats = dqTrendRaw.categories || [];
    const series = dqTrendRaw.series?.[0]?.data || [];
    return cats.map((name, i) => ({
      name,
      value: typeof series[i] === "number" ? series[i] : 0,
    }));
  }, [dqTrendRaw]);

  const [selectedHeaderId, setSelectedHeaderId] = useState("all");
  const headerTabs = useMemo(
    () => [
      { id: "all", label: "All" },
      ...(monthlyValidityByHeader || []).map(h => ({
        id: h.header?.id,
        label: h.header?.name || `Header ${h.header?.id}`,
      })),
    ],
    [monthlyValidityByHeader]
  );

  useEffect(() => {
    if (
      selectedHeaderId !== "all" &&
      !monthlyValidityByHeader.some(
        h => String(h.header?.id) === String(selectedHeaderId)
      )
    ) {
      setSelectedHeaderId("all");
    }
  }, [monthlyValidityByHeader, selectedHeaderId]);

  const monthlyValidityTrend = useMemo(() => {
    let source = [];
    if (monthlyValidityAll.length || monthlyValidityByHeader.length) {
      source =
        selectedHeaderId === "all"
          ? monthlyValidityAll
          : monthlyValidityByHeader.find(
              h => String(h.header?.id) === String(selectedHeaderId)
            )?.points || [];
      return (source || []).map(p => {
        const v = clampPct(
          typeof p.valid_pct === "number" ? p.valid_pct : 0
        );
        const inv = clampPct(
          typeof p.invalid_pct === "number" ? p.invalid_pct : 0
        );
        const nul = clampPct(
          typeof p.null_pct === "number" ? p.null_pct : 0
        );
        return {
          name: p.period || "",
          value: v,
          valid_pct: v,
          invalid_pct: inv,
          null_pct: nul,
        };
      });
    }
    if (!Array.isArray(table) || table.length === 0) return [];
    return table.map(row => {
      const nul = clampPct(
        (typeof row.blanks_pct === "number" ? row.blanks_pct : 0) +
          (typeof row.unknown_pct === "number" ? row.unknown_pct : 0)
      );
      const inv = clampPct(
        (typeof row.dots_pct === "number" ? row.dots_pct : 0) +
          (typeof row.invalid_pct === "number" ? row.invalid_pct : 0)
      );
      const v = clampPct(100 - nul - inv);
      return {
        name: row.period || "",
        value: v,
        valid_pct: v,
        invalid_pct: inv,
        null_pct: nul,
      };
    });
  }, [monthlyValidityAll, monthlyValidityByHeader, selectedHeaderId, table]);

  const renderMonthlyTooltip = useCallback(({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0]?.payload || {};
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-xs">
        <div className="font-semibold text-gray-800 mb-1">{label}</div>
        <div className="space-y-0.5">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Valid</span>
            <span className="font-medium text-emerald-600">
              {formatPercent(p.valid_pct)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Invalid</span>
            <span className="font-medium text-rose-600">
              {formatPercent(p.invalid_pct)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Null</span>
            <span className="font-medium text-slate-600">
              {formatPercent(p.null_pct)}
            </span>
          </div>
        </div>
      </div>
    );
  }, []);

  const renderDQTrendTooltip = useCallback(({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const v = payload[0]?.value;
    const formatted =
      typeof v === "number" ? `${v.toFixed(2)}%` : String(v ?? "--");
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-xs">
        <div className="font-semibold text-gray-800 mb-1">{label}</div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Validity</span>
          <span className="font-medium text-emerald-600">{formatted}</span>
        </div>
      </div>
    );
  }, []);

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
                Monitors processed rows, completeness, validity, and trends.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <DataHealthDashboardFilter control={control} errors={errors} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue to-purple rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Total Rows Processed
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <ShieldCheck className="text-white" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">Overall Total Rows</p>
                <p className="text-4xl font-bold text-white">
                  {totalRowsValue}
                </p>
              </div>
              <div className="pt-6 border-t border-white/30 space-y-3">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">Clean Rows</span>
                    <span className="text-sm font-bold text-white">
                      {cleanRowsValue}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${cleanRowsShare}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">Raw Rows</span>
                    <span className="text-sm font-bold text-white">
                      {rawRowsValue}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-500"
                      style={{ width: `${rawRowsShare}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-green rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Completeness
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Layers3 className="text-white" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">
                  Overall Validity and Invalidity
                </p>
                <p className="text-4xl font-bold text-white">
                  {completenessFilledValue}
                </p>
              </div>
              <div className="pt-6 border-t border-white/30 space-y-3 max-h-[170px] overflow-y-auto pr-2">
                {topCountries.length > 0 ? (
                  topCountries.map((c, i) => (
                    <div
                      key={c.value || i}
                      className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {c.label}
                          </p>
                          <p className="text-xs text-white">
                            {formatInt(c.rows)} rows
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {formatPercent(c.filled_pct)}
                          </p>
                          <p className="text-xs text-white">
                            Valid {formatPercent(c.valid_pct)} • Invalid{" "}
                            {formatPercent(c.invalid_pct)}
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
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-600 to-blue rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Validity
              </h3>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Globe2 className="text-white" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white">Overall Validity Score</p>
                <p className="text-4xl font-bold text-white">
                  {overallValidityValue}
                </p>
              </div>
              <div className="pt-6 border-t border-white/30 space-y-3">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">
                      Bed ({bedRows} rows)
                    </span>
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
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white">
                      Towel ({towelRows} rows)
                    </span>
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
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Overall Data Quality
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Trend of data quality score.
            </p>
          </div>
        </div>
        <div className="px-4 pb-6 pt-4">
          <div className="h-[260px]">
            <ReChart
              data={dqTrendData}
              chartType="line"
              colors={DEFAULT_CHART_COLORS}
              dimensions={{ height: 300, xAxisAngle: 0 }}
              chartConfig={{
                line: { strokeWidth: 3, dotSize: 5 },
                tooltipRenderer: ({ active, payload, label }) =>
                  renderDQTrendTooltip({ active, payload, label }),
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 flex-wrap">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              Monthly Validity Overview
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Switch between all data and individual headers.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {headerTabs.map(t => {
              const active = String(selectedHeaderId) === String(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedHeaderId(t.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all border ${
                    active
                      ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-4 pb-6 pt-4">
          <div className="h-[260px]">
            <ReChart
              data={monthlyValidityTrend}
              chartType="line"
              colors={DEFAULT_CHART_COLORS}
              dimensions={{ height: 300, xAxisAngle: 0 }}
              chartConfig={{
                line: { strokeWidth: 3, dotSize: 5 },
                tooltipRenderer: ({ active, payload, label }) =>
                  renderMonthlyTooltip({ active, payload, label }),
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-4 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Data Quality Status by Header
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Breakdown of valid, invalid, and null percentages for each header.
          </p>
        </div>
        <div className="overflow-x-auto p-4">
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
                const v = clampPct(
                  typeof row.valid_pct === "number" ? row.valid_pct : 0
                );
                const inv = clampPct(
                  typeof row.invalid_pct === "number" ? row.invalid_pct : 0
                );
                const nul = clampPct(
                  typeof row.null_pct === "number" ? row.null_pct : 0
                );
                return (
                  <tr
                    key={row.header?.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.header?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(v)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${v}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(inv)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-rose-500 transition-all duration-500"
                            style={{ width: `${inv}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex flex-col items-end gap-1">
                        <span>{formatPercent(nul)}</span>
                        <div className="w-28 md:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-slate-400 transition-all duration-500"
                            style={{ width: `${nul}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && (
        <div className="text-xs text-gray-500">
          Loading data health metrics…
        </div>
      )}
    </div>
  );
}
