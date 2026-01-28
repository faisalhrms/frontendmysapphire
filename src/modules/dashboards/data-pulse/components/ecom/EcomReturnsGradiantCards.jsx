import React, { useMemo } from "react";
import {
    TrendingUp,
    RotateCcw,
    BarChart3,
    ArrowUpRight,
    ShieldAlert,
    PackageCheck,
    History,
} from "lucide-react";

/**
 * Same loading pulse (kept as you shared)
 * NOTE: This component renders SVG defs with ids.
 * If you render multiple instances on same page, ids can clash.
 * This version keeps it as-is, but you can pass a uniqueId if needed.
 */
const PulseLine = () => (
    <div className="relative w-full h-10 flex items-center">
        <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/15"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-glow)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan blur-[2px]"
                style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
            />
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan"
                style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
            />
            <defs>
                <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/20" stopOpacity="0.2" />
                    <stop offset="30%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="70%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/20" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pulse-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                    <stop offset="50%" stopColor="currentColor" className="text-white/40" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
        <div className="absolute -bottom-3 left-0 flex items-center space-x-2">
            <span className="text-[9px] uppercase tracking-wider text-white/60 font-semibold">Pulse Active</span>
        </div>
    </div>
);

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const fmtPct = (v) => `${safeNum(v).toFixed(2)}%`;

const pickBucket = (buckets, key) =>
    (Array.isArray(buckets) ? buckets : []).find((x) => x?.bucket === key) || { total_orders: 0, return_orders: 0 };

const sumBuckets = (buckets = []) => {
    const safe = Array.isArray(buckets) ? buckets : [];
    return safe.reduce(
        (acc, b) => {
            acc.total_orders += safeNum(b.total_orders);
            acc.return_orders += safeNum(b.return_orders);
            return acc;
        },
        { total_orders: 0, return_orders: 0 }
    );
};

const EcomReturnsGradiantCards = ({
                                      windowKpis = {},
                                      tillKpis = {},
                                      loading = false,
                                      formatAmount = (n) => String(n),
                                      meta = {},
                                  }) => {
    // ---- Window derived ----
    const wReturn = safeNum(windowKpis.return_orders);
    const wComplete = safeNum(windowKpis.complete_orders);
    const wOther = safeNum(windowKpis.other_orders);
    const wTotal = safeNum(windowKpis.total_orders);
    const wPct = safeNum(windowKpis.overall_return_percent);
    const wBuckets = Array.isArray(windowKpis.buckets) ? windowKpis.buckets : [];
    const w80 = useMemo(() => pickBucket(wBuckets, "80-100"), [wBuckets]);
    const wAll = useMemo(() => sumBuckets(wBuckets), [wBuckets]);

    // ---- Till-yesterday derived ----
    const tReturn = safeNum(tillKpis.return_orders);
    const tComplete = safeNum(tillKpis.complete_orders);
    const tOther = safeNum(tillKpis.other_orders);
    const tTotal = safeNum(tillKpis.total_orders);
    const tPct = safeNum(tillKpis.overall_return_percent);
    const tBuckets = Array.isArray(tillKpis.buckets) ? tillKpis.buckets : [];
    const t80 = useMemo(() => pickBucket(tBuckets, "80-100"), [tBuckets]);

    // ---- Signals ----
    const gap = useMemo(() => safeNum(wPct - tPct), [wPct, tPct]);
    const signal = useMemo(() => {
        if (loading) return "Analyzing";
        // small hysteresis so it doesn’t flip for tiny changes
        if (gap > 0.25) return "Elevated";
        if (gap < -0.25) return "Improving";
        return "Normal";
    }, [gap, loading]);

    const windowLabel = meta?.window_date_from && meta?.window_date_to
        ? `${meta.window_date_from} — ${meta.window_date_to}`
        : "Selected Range";

    const tillLabel = meta?.till_yesterday_date_to
        ? `Upto: ${meta.till_yesterday_date_to}`
        : "Till Yesterday";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* 1) WINDOW SNAPSHOT */}
            <div className="bg-gradient-to-br from-black via-indigo-900 to-indigo-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-16 -mt-16" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <RotateCcw size={20} /> Window Pulse
                            </h3>
                            <p className="text-[11px] text-white/60 mt-1">{windowLabel}</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm text-white">
                            <ArrowUpRight size={22} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-white/80">Return Orders</p>
                            {loading ? (
                                <PulseLine />
                            ) : (
                                <p className="text-4xl font-bold text-white tabular-nums">{formatAmount(wReturn)}</p>
                            )}
                            {!loading && (
                                <p className="text-xs text-white/70 mt-1">
                                    Return Rate: <span className="font-semibold">{fmtPct(wPct)}</span> • Total:{" "}
                                    <span className="font-semibold">{formatAmount(wTotal)}</span>
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/25 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between gap-4">
                                <div>
                                    <p className="text-sm text-white/80">Completed</p>
                                    {loading ? <PulseLine /> : <p className="text-2xl font-bold text-white">{formatAmount(wComplete)}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-white/80">Other</p>
                                    {loading ? <PulseLine /> : <p className="text-2xl font-bold text-white">{formatAmount(wOther)}</p>}
                                </div>
                            </div>
                            {!loading && (
                                <p className="text-[10px] text-white/55 uppercase mt-2">
                                    Bucket Totals (sanity): {formatAmount(wAll.total_orders)} total • {formatAmount(wAll.return_orders)} returns
                                </p>
                            )}
                        </div>

                        <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                            <span className="font-semibold">Note:</span> Window numbers can swing a lot on small volume.
                        </div>
                    </div>
                </div>
            </div>

            {/* 2) CUMULATIVE HISTORY */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl shadow-lg p-6 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <History size={20} /> Till Yesterday
                            </h3>
                            <p className="text-[11px] text-white/60 mt-1">{tillLabel}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg text-white">
                            <BarChart3 size={22} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-white/80">Total Return Orders</p>
                            {loading ? (
                                <PulseLine />
                            ) : (
                                <p className="text-4xl font-bold text-white tabular-nums">{formatAmount(tReturn)}</p>
                            )}
                            {!loading && (
                                <p className="text-xs text-white/70 mt-1">
                                    Baseline Return Rate: <span className="font-semibold">{fmtPct(tPct)}</span>
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/10 bg-black/40 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-white/80">Total Orders</p>
                                    {loading ? <PulseLine /> : <p className="text-xl font-bold text-white">{formatAmount(tTotal)}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-white/80">Completed</p>
                                    {loading ? <PulseLine /> : <p className="text-xl font-bold text-white">{formatAmount(tComplete)}</p>}
                                </div>
                            </div>

                            {!loading && (
                                <p className="text-[10px] text-white/50 uppercase mt-2">
                                    Other: {formatAmount(tOther)} • Critical(80-100): {formatAmount(t80.return_orders)} returns / {formatAmount(t80.total_orders)} orders
                                </p>
                            )}
                        </div>

                        <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm flex items-center gap-2">
                            <TrendingUp size={16} /> Baseline helps detect spikes vs normal behavior.
                        </div>
                    </div>
                </div>
            </div>

            {/* 3) RISK SIGNAL */}
            <div className="bg-gradient-to-br from-red via-orange-600 to-warning rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-44 h-44 bg-white/10 rounded-full -ml-20 -mb-20" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ShieldAlert size={20} /> Return Risk
                            </h3>
                            <p className="text-[11px] text-white/60 mt-1">
                                Window vs Baseline • Signal: <span className="font-semibold">{signal}</span>
                            </p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm text-white">
                            <PackageCheck size={22} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-white/80">Critical Bucket Returns (80-100%)</p>
                            {loading ? (
                                <PulseLine />
                            ) : (
                                <p className="text-4xl font-bold text-white tabular-nums">
                                    {formatAmount(w80.return_orders)}
                                </p>
                            )}
                            {!loading && (
                                <p className="text-xs text-white/70 mt-1">
                                    Critical Orders in Window: <span className="font-semibold">{formatAmount(w80.total_orders)}</span>
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/25 grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-[10px] text-white/80 uppercase">Window Gap</p>
                                {loading ? (
                                    <div className="h-8"><PulseLine /></div>
                                ) : (
                                    <p className="text-lg font-bold text-white tabular-nums">{fmtPct(gap)}</p>
                                )}
                            </div>

                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-[10px] text-white/80 uppercase">Baseline (Till)</p>
                                {loading ? (
                                    <div className="h-8"><PulseLine /></div>
                                ) : (
                                    <p className="text-lg font-bold text-white tabular-nums">{fmtPct(tPct)}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-black/20 p-2 rounded-lg text-white/90 text-[11px] leading-tight">
                            Action: if <span className="font-semibold">Critical Orders</span> grows and the{" "}
                            <span className="font-semibold">Window Gap</span> stays positive, review top customers/orders contributing to returns.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcomReturnsGradiantCards;
