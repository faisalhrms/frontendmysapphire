import React, { useMemo } from "react";
import {
    MapPin,
    Truck,
    ArrowUpRight,
    Layers,
    Clock,
    RotateCcw,
    AlertTriangle,
    TrendingUp,
    Wallet
} from "lucide-react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

// ✅ full numbers (no K/M/B)
const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF_MONEY0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmtMoney0 = (v) => `PKR ${NF_MONEY0.format(toNum(v))}`;
const fmtInt = (v) => NF0.format(toNum(v));
const fmtMoney = (v) => `PKR ${NF2.format(toNum(v))}`;

const CardShell = ({ title, icon: Icon, rightSlot, gradient, children }) => (
    <div className={`rounded-xl shadow-lg p-5 relative overflow-hidden bg-gradient-to-br ${gradient} h-full`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    {Icon ? <Icon size={16} className="text-white" /> : null}
                    {title}
                </h4>

                {rightSlot ?? (
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <ArrowUpRight size={18} className="text-white" />
                    </div>
                )}
            </div>

            {children}
        </div>
    </div>
);

function Pill({ children }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {children}
        </span>
    );
}

function MiniKpiCard({ title, Icon, value, loading, subtitle }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-4 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                {Icon ? <Icon size={18} className="text-white" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="space-y-2">
                    <PulseScan />
                </div>
            ) : (
                <>
                    <p className="text-xl font-bold text-white tabular-nums">{value ?? "-"}</p>
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">{subtitle ?? "\u00A0"}</p>
                </>
            )}
        </div>
    );
}

/**
 * ✅ simple listing (NO nested boxes)
 * - name first
 * - count after name (on right)
 * - keeps scrollbar
 * - ✅ bigger item sizing (as requested)
 */
function SimpleList({ rows, total, loading, getKey, getName, getCount, valueFormatter }) {
    if (loading) {
        return (
            <div className="bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm p-3">
                <PulseScan />
            </div>
        );
    }

    if (!rows?.length) {
        return (
            <div className="bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm p-3 text-white/80 text-sm">
                No data
            </div>
        );
    }

    return (
        <div className="bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm p-3">
            <div className="max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                {rows.map((r, idx) => {
                    const key = getKey(r, idx);
                    const name = getName(r);
                    const cnt = toNum(getCount(r));
                    const share = total > 0 ? (cnt / total) * 100 : 0;

                    return (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-b-0"
                            title={name}
                        >
                            <div className="min-w-0">
                                {/* ✅ bigger */}
                                <p className="text-sm text-white font-semibold truncate">{name}</p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 tabular-nums">
                                {/* ✅ bigger */}
                                <span className="text-sm text-white/95 font-semibold">
                                    {valueFormatter ? valueFormatter(cnt) : fmtInt(cnt)}
                                </span>

                                {/* ✅ slightly bigger */}
                                <span className="text-xs text-white/70">{share.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const ReturnsLocationWise = ({
                                 rows = [],
                                 courierRows = [],
                                 categoryRows = [],
                                 pendingPunchingRows = [],
                                 courierTotalReturns = null,
                                 courierSummary = null,
                                 meta = null,
                                 loading = false,
                                 returnsSnapshot = null,
                             }) => {
    const safeRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);
    const safeCourierRows = useMemo(() => (Array.isArray(courierRows) ? courierRows : []), [courierRows]);
    const safeCategoryRows = useMemo(() => (Array.isArray(categoryRows) ? categoryRows : []), [categoryRows]);
    const safePendingRows = useMemo(
        () => (Array.isArray(pendingPunchingRows) ? pendingPunchingRows : []),
        [pendingPunchingRows]
    );

    const sortedLocations = useMemo(
        () => [...safeRows].sort((a, b) => toNum(b.count) - toNum(a.count)),
        [safeRows]
    );

    const sortedCouriers = useMemo(
        () => [...safeCourierRows].sort((a, b) => toNum(b.order_count) - toNum(a.order_count)),
        [safeCourierRows]
    );

    // Category rows are amount+qty; we can sort by qty now (since you want qty focus)
    const sortedCategories = useMemo(
        () => [...safeCategoryRows].sort((a, b) => toNum(b.total_qty) - toNum(a.total_qty)),
        [safeCategoryRows]
    );

    // Pending punching (ONLY total; no "Top:" line)
    const pendingTotal = useMemo(
        () => safePendingRows.reduce((sum, r) => sum + toNum(r.count), 0),
        [safePendingRows]
    );

    const totalReturnsFallback = useMemo(() => {
        const v = courierTotalReturns ?? courierSummary?.total_returns;
        if (v !== null && v !== undefined) return toNum(v);
        return sortedCouriers.reduce((sum, r) => sum + toNum(r.order_count), 0);
    }, [courierTotalReturns, courierSummary, sortedCouriers]);

    const locationTotal = useMemo(
        () => sortedLocations.reduce((sum, r) => sum + toNum(r.count), 0),
        [sortedLocations]
    );

    const catTotalAmount = useMemo(
        () => sortedCategories.reduce((sum, r) => sum + toNum(r.total_amount), 0),
        [sortedCategories]
    );

    const catTotalQty = useMemo(
        () => sortedCategories.reduce((sum, r) => sum + toNum(r.total_qty), 0),
        [sortedCategories]
    );

    // ✅ snapshot
    const snapTitle = "Total Returns";
    const snapTotalAmount =
        returnsSnapshot?.total_amount ??
        returnsSnapshot?.return_amount ??
        courierSummary?.total_amount ??
        0;

    const snapTotalOrders =
        returnsSnapshot?.total_orders ??
        returnsSnapshot?.returns ??
        courierSummary?.total_returns ??
        totalReturnsFallback;

    const snapOrders = returnsSnapshot?.orders ?? snapTotalOrders;
    const snapQty = returnsSnapshot?.qty ?? returnsSnapshot?.return_qty ?? courierSummary?.total_qty ?? null;
    const snapAvgQty = returnsSnapshot?.avg_qty ?? returnsSnapshot?.avg_return_qty ?? courierSummary?.avg_qty ?? null;

    return (
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-6">
                    <CardShell title={snapTitle} icon={RotateCcw} gradient="from-gray-950 to-gray-700">
                        <div className="mb-4">
                            {loading ? (
                                <div className="mt-2">
                                    <PulseScan />
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-white/70 mt-1 tabular-nums">Orders</p>
                                    <p className="text-4xl font-bold text-white tabular-nums">
                                        {fmtInt(snapTotalOrders)}
                                    </p>

                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                            <MiniKpiCard
                                title="Total Amount"
                                Icon={Wallet}
                                loading={loading}
                                value={fmtMoney0(snapTotalAmount)}
                            />
                            <MiniKpiCard
                                title="Qty"
                                Icon={AlertTriangle}
                                loading={loading}
                                value={snapQty === null || snapQty === undefined ? "-" : fmtInt(snapQty)}
                            />
                            <MiniKpiCard
                                title="Avg Qty"
                                Icon={TrendingUp}
                                loading={loading}
                                value={snapAvgQty === null || snapAvgQty === undefined ? "-" : NF2.format(toNum(snapAvgQty))}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-6">
                    <CardShell title="Pending Punching" icon={Clock} gradient="from-amber-950 to-amber-500">
                        {loading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-3xl font-bold text-white tabular-nums">{fmtInt(pendingTotal)}</p>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Pending punching (by location)</p>
                            </>
                        )}

                        {!loading && meta?.pending_punching_date ? (
                            <div className="mt-3">
                                <Pill>Date: {meta.pending_punching_date}</Pill>
                            </div>
                        ) : null}
                    </CardShell>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4">
                    <CardShell title="Courier Wise" icon={Truck} gradient="from-sky-950 to-sky-600">
                        {loading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total</p>
                                <p className="text-3xl font-bold text-white tabular-nums">{fmtInt(snapTotalOrders)}</p>
                            </>
                        )}

                        <div className="mt-3">
                            <SimpleList
                                rows={sortedCouriers.slice(0, 14)}
                                total={snapTotalOrders}
                                loading={loading}
                                getKey={(r, idx) => `${(r?.courier || "Unknown")}-${idx}`}
                                getName={(r) => (r?.courier || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Location Wise" icon={MapPin} gradient="from-rose-950 to-rose-600">
                        {loading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total</p>
                                <p className="text-3xl font-bold text-white tabular-nums">{fmtInt(locationTotal)}</p>
                            </>
                        )}

                        <div className="mt-3">
                            <SimpleList
                                rows={sortedLocations.slice(0, 14)}
                                total={locationTotal}
                                loading={loading}
                                getKey={(r, idx) => `${r?.location_id || r?.location_name}-${idx}`}
                                getName={(r) => (r?.location_name || "-").trim() || "-"}
                                getCount={(r) => r?.count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Category Wise" icon={Layers} gradient="from-emerald-950 to-emerald-600">
                        {loading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                {/* ✅ show TOTAL QTY (not amount) */}
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total Qty</p>
                                <p className="text-3xl font-bold text-white tabular-nums">{fmtInt(catTotalQty)}</p>

                                {/* (optional) keep amount hidden but still computed in case you need later */}
                                {/* <p className="text-xs text-white/60 mt-1 tabular-nums">Amount: {fmtMoney(catTotalAmount)}</p> */}
                            </>
                        )}

                        <div className="mt-3">
                            {/* ✅ list by qty, show qty as value; share is qty share */}
                            <SimpleList
                                rows={sortedCategories.slice(0, 14)}
                                total={catTotalQty}
                                loading={loading}
                                getKey={(r, idx) => `${r?.category_id || "Unknown"}-${idx}`}
                                getName={(r) => String(r?.category_id || "Unknown")}
                                getCount={(r) => r?.total_qty}
                                valueFormatter={(n) => fmtInt(n)}
                            />
                        </div>
                    </CardShell>
                </div>
            </div>
        </div>
    );
};

export default ReturnsLocationWise;
