import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { ArrowUpRight, ListChecks, Route, Shapes, Tag } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const normalizeRows = (rows, labelKey, valueKey = "count") => {
    const arr = Array.isArray(rows) ? rows : [];
    return arr.map((r, idx) => ({
        key: `${String(r?.[labelKey] ?? "Unknown")}-${idx}`,
        label: r?.[labelKey] ?? "Unknown",
        value: r?.[valueKey] ?? 0,
        sublabel: r?.sublabel, // optional if you ever add
    }));
};

// ✅ different bg than your example (no red/orange)
const CARD_THEMES = {
    overview: {
        wrap: "bg-gradient-to-br from-black to-black",
        glowTop: "from-black-500/12 to-transparent",
        glowBottom: "from-black-500/12 to-transparent",
        badge: "bg-indigo-500/20 text-indigo-300",
    },
    origin: {
        wrap: "bg-gradient-to-br from-black to-green",
        glowTop: "from-emerald-500/12 to-transparent",
        glowBottom: "from-teal-500/12 to-transparent",
        badge: "bg-emerald-500/20 text-emerald-300",
    },
    type: {
        wrap: "bg-gradient-to-br from-purple to-purple",
        glowTop: "from-violet-500/12 to-transparent",
        glowBottom: "from-fuchsia-500/12 to-transparent",
        badge: "bg-violet-500/20 text-violet-300",
    },
    status: {
        wrap: "bg-gradient-to-br from-red to-orange",
        glowTop: "from-sky-500/12 to-transparent",
        glowBottom: "from-cyan-500/12 to-transparent",
        badge: "bg-teal-500/20 text-red-300",
    },
};

const GradientStatCard = ({
                              title,
                              Icon,
                              theme,
                              items = [],
                              loading,
                              // ✅ status can be > 10 => scroll inside
                              scrollBody = false,
                              bodyMaxH = "max-h-[360px]",
                              heightClass = "h-[420px]",
                          }) => {
    const t = theme;

    return (
        <div
            className={`${heightClass} ${t.wrap} rounded-xl shadow-xl p-6 relative overflow-hidden`}
        >
            {/* glows */}
            <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${t.glowTop} rounded-full blur-3xl`}
            />
            <div
                className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${t.glowBottom} rounded-full blur-3xl`}
            />

            <div className="relative z-10 h-full flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className={`p-2 rounded-lg backdrop-blur-sm ${t.badge}`}>
                            {Icon ? <Icon size={18} /> : null}
                        </div>
                        {title}
                    </h3>

                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                        <ArrowUpRight size={20} className="text-white" />
                    </div>
                </div>

                {/* body */}
                {loading ? (
                    <div className="space-y-2">
                        <PulseScan />
                        <PulseScan />
                        <PulseScan />
                    </div>
                ) : (
                    <div className={`flex-1 ${scrollBody ? `overflow-y-auto ${bodyMaxH} pr-1 custom-scrollbar` : ""}`}>
                        <div className="space-y-3">
                            {items.map((it) => (
                                <div
                                    key={it.key}
                                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all hover:bg-white/15 border border-white/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{it.label}</p>
                                            {it.sublabel ? (
                                                <p className="text-xs text-white/70 mt-0.5 truncate">{it.sublabel}</p>
                                            ) : null}
                                        </div>

                                        <div className="text-right pl-4">
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {nf0.format(toNum(it.value))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {items.length === 0 ? (
                                <div className="text-sm text-white/70 italic">No data available</div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomerCareCases = ({ enabled = true, filters, cache }) => {
    // ✅ ONE BY ONE calls (same hook, different key)
    const overviewParams = useMemo(() => ({ ...(filters || {}), key: "overview" }), [filters]);
    const originParams = useMemo(() => ({ ...(filters || {}), key: "origin" }), [filters]);
    const typeParams = useMemo(() => ({ ...(filters || {}), key: "type" }), [filters]);
    const statusParams = useMemo(() => ({ ...(filters || {}), key: "status" }), [filters]);

    const baseOpts = useMemo(() => ({ enabled, ...(cache || {}) }), [enabled, cache]);

    const { data: overviewRes, isLoading: overviewLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customer-care/cases/",
        overviewParams,
        baseOpts
    );

    const { data: originRes, isLoading: originLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customer-care/cases/",
        originParams,
        baseOpts
    );

    const { data: typeRes, isLoading: typeLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customer-care/cases/",
        typeParams,
        baseOpts
    );

    const { data: statusRes, isLoading: statusLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customer-care/cases/",
        statusParams,
        baseOpts
    );

    // ---- items ----
    const overview = overviewRes?.summary || {};
    const overviewItems = useMemo(() => {
        const landed = toNum(overview?.landed_cases);
        const closed = toNum(overview?.closed);
        const resolved = toNum(overview?.resolved);
        const open = toNum(overview?.open);

        const any = landed + closed + resolved + open > 0;
        if (!any) return [];

        return [
            { key: "landed", label: "Landed cases", value: landed },
            { key: "closed", label: "Closed", value: closed },
            { key: "resolved", label: "Resolved", value: resolved },
            { key: "open", label: "Open", value: open },
        ];
    }, [overview]);

    const originItems = useMemo(
        () => (isNonEmptyArray(originRes?.rows) ? normalizeRows(originRes.rows, "Origin") : []),
        [originRes]
    );

    const typeItems = useMemo(
        () => (isNonEmptyArray(typeRes?.rows) ? normalizeRows(typeRes.rows, "Type") : []),
        [typeRes]
    );

    const statusItems = useMemo(
        () => (isNonEmptyArray(statusRes?.rows) ? normalizeRows(statusRes.rows, "Status") : []),
        [statusRes]
    );

    // ✅ show only what exists (but keep card visible if loading)
    const cards = useMemo(() => {
        const arr = [];

        if (overviewLoading || overviewItems.length > 0) {
            arr.push({
                key: "overview",
                title: "Cases Overview",
                Icon: ListChecks,
                theme: CARD_THEMES.overview,
                items: overviewItems,
                loading: overviewLoading,
                scrollBody: false,
                heightClass: "h-[420px]",
            });
        }

        if (originLoading || originItems.length > 0) {
            arr.push({
                key: "origin",
                title: "Cases By Origin",
                Icon: Route,
                theme: CARD_THEMES.origin,
                items: originItems,
                loading: originLoading,
                scrollBody: true,
                heightClass: "h-[420px]",
            });
        }

        if (typeLoading || typeItems.length > 0) {
            arr.push({
                key: "type",
                title: "Cases By Type",
                Icon: Shapes,
                theme: CARD_THEMES.type,
                items: typeItems,
                loading: typeLoading,
                scrollBody: true,
                heightClass: "h-[420px]",
            });
        }

        if (statusLoading || statusItems.length > 0) {
            arr.push({
                key: "status",
                title: "Cases By Status",
                Icon: Tag,
                theme: CARD_THEMES.status,
                items: statusItems,
                loading: statusLoading,
                scrollBody: true, // ✅ status can be > 10
                heightClass: "h-[420px]",
            });
        }

        return arr;
    }, [
        overviewLoading,
        originLoading,
        typeLoading,
        statusLoading,
        overviewItems,
        originItems,
        typeItems,
        statusItems,
    ]);

    const nothing =
        !overviewLoading && !originLoading && !typeLoading && !statusLoading && cards.length === 0;

    if (nothing) {
        return <div className="text-sm text-slate-400 italic">No data available</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {cards.map((c) => (
                <GradientStatCard
                    key={c.key}
                    title={c.title}
                    Icon={c.Icon}
                    theme={c.theme}
                    items={c.items}
                    loading={c.loading}
                    scrollBody={c.scrollBody}
                    heightClass={c.heightClass}
                    bodyMaxH="max-h-[320px]"
                />
            ))}
        </div>
    );
};

export default CustomerCareCases;
