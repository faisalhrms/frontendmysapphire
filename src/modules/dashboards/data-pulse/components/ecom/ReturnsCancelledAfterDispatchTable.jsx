import React, { memo, useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { Truck, MapPin, Clock, Boxes, ArrowUpRight } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US");
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const unwrap = (resp) => {
    if (!resp) return {};
    if (
        resp?.summary ||
        resp?.courier_rows ||
        resp?.location_rows ||
        resp?.pending_location_rows ||
        resp?.rows
    )
        return resp;

    if (
        resp?.data?.summary ||
        resp?.data?.courier_rows ||
        resp?.data?.location_rows ||
        resp?.data?.pending_location_rows ||
        resp?.data?.rows
    )
        return resp.data;

    if (resp?.data?.data) return resp.data.data;
    return resp;
};

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const CardShell = ({ title, icon: Icon, rightSlot, gradient, children }) => (
    <div
        className={`rounded-xl shadow-lg p-5 relative overflow-hidden bg-gradient-to-br ${gradient} h-full`}
    >
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    {Icon ? <Icon size={20} className="text-white" /> : null}
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

function MiniKpiCard({ title, Icon, value, subtitle, loading }) {
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
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                        {subtitle ?? "\u00A0"}
                    </p>
                </>
            )}
        </div>
    );
}

function BucketTile({ label, orders, qty, loading }) {
    return (
        <div className="p-4 rounded-xl backdrop-blur-sm border bg-white/10 border-white/15">
            <p className="text-[10px] text-white/75 uppercase tracking-wide">{label}</p>

            {loading ? (
                <div className="mt-2">
                    <PulseScan />
                </div>
            ) : (
                <div className="mt-2 flex items-end justify-between gap-3 tabular-nums">
                    <div className="min-w-0">
                        <p className="text-[11px] text-white/70">Orders</p>
                        <p className="text-xl font-bold text-white">{nf0.format(orders)}</p>
                    </div>

                    <div className="text-right min-w-0">
                        <p className="text-[11px] text-white/70">Qty</p>
                        <p className="text-xl font-bold text-white">{nf0.format(qty)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/** ✅ Decent (smaller) left totals panel */
function PendingTotalsPanel({ loading, totalOrders, totalQty }) {
    return (
        <div className="bg-white/10 rounded-xl border border-white/15 backdrop-blur-sm p-5 h-full flex flex-col justify-center">
            {loading ? (
                <PulseScan />
            ) : (
                <>
                    {/* Heading: slightly smaller */}
                    <p className="text-xs md:text-sm font-semibold text-white/90">
                        Total Orders
                    </p>

                    {/* Total: reduced size */}
                    <p className="mt-2 text-4xl md:text-5xl font-extrabold text-white tabular-nums leading-none">
                        {nf0.format(totalOrders)}
                    </p>

                    {/* Total Qty: label + value balanced */}
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                        <p className="text-xs md:text-sm font-semibold text-white/90">Total Qty</p>
                        <p className="text-sm md:text-lg font-bold text-white tabular-nums">
                            {nf0.format(totalQty)}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

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
                                <p className="text-sm text-white font-semibold truncate">{name}</p>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 tabular-nums">
                <span className="text-sm text-white/95 font-semibold">
                  {valueFormatter ? valueFormatter(cnt) : nf0.format(cnt)}
                </span>
                                <span className="text-xs text-white/70">{share.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const GRADIENTS = {
    dispatched: "from-black to-indigo-700",
    pendingTop: "from-amber-950 to-amber-500",
    courier: "from-sky-950 to-sky-600",
    location: "from-rose-950 to-rose-600",
    pendingList: "from-amber-950 to-amber-500",
};

const ReturnsCancelledAfterDispatchTable = ({ filters, enabled = true, cache = {} }) => {
    const endpoint = "/dashboard/data-pulse/ecom/dispatch/summary/";
    const pendingBucketEndpoint =
        "/dashboard/data-pulse/ecom/dispatch/pending-punching/bucketwise-all/";

    const { data: courierResp, isLoading: courierLoading } = useFetchWithFilters(
        endpoint,
        { ...filters, dispatch_key: "courier" },
        { enabled, ...cache }
    );

    const { data: locationResp, isLoading: locationLoading } = useFetchWithFilters(
        endpoint,
        { ...filters, dispatch_key: "location" },
        { enabled, ...cache }
    );

    const { data: pendingResp, isLoading: pendingLoading } = useFetchWithFilters(
        endpoint,
        { ...filters, dispatch_key: "pending" },
        { enabled, ...cache }
    );

    const { data: pendingBucketResp, isLoading: pendingBucketLoading } = useFetchWithFilters(
        pendingBucketEndpoint,
        {},
        { enabled, ...cache }
    );

    const courierPayload = useMemo(() => unwrap(courierResp), [courierResp]);
    const locationPayload = useMemo(() => unwrap(locationResp), [locationResp]);
    const pendingPayload = useMemo(() => unwrap(pendingResp), [pendingResp]);
    const pendingBucketPayload = useMemo(() => unwrap(pendingBucketResp), [pendingBucketResp]);

    const courierSummary = courierPayload?.summary || {};
    const locationSummary = locationPayload?.summary || {};
    const pendingSummary = pendingPayload?.summary || {};

    const pendingBucketSummary = pendingBucketPayload?.summary || {};
    const pendingBucketRows = useMemo(() => (pendingBucketPayload?.rows || []).slice(), [pendingBucketPayload]);

    const courierRows = useMemo(() => (courierPayload?.courier_rows || []).slice(), [courierPayload]);
    const locationRows = useMemo(() => (locationPayload?.location_rows || []).slice(), [locationPayload]);
    const pendingRows = useMemo(() => (pendingPayload?.pending_location_rows || []).slice(), [pendingPayload]);

    const dispatchLoading = courierLoading || locationLoading;
    const pendingListLoading = pendingLoading;
    const pendingAgingLoading = pendingBucketLoading;

    const dispatchTotalOrdersRaw = toNum(
        courierSummary?.dispatch_total_orders ?? locationSummary?.dispatch_total_orders
    );
    const dispatchTotalQtyRaw = toNum(
        courierSummary?.dispatch_total_qty ?? locationSummary?.dispatch_total_qty
    );

    const dispatchTotalOrders =
        dispatchTotalOrdersRaw ||
        courierRows.reduce((s, r) => s + toNum(r.order_count), 0) ||
        locationRows.reduce((s, r) => s + toNum(r.order_count), 0);

    const dispatchTotalQty =
        dispatchTotalQtyRaw ||
        courierRows.reduce((s, r) => s + toNum(r.total_qty), 0) ||
        locationRows.reduce((s, r) => s + toNum(r.total_qty), 0);

    // ✅ NEW: Avg Qty (Qty per Order)
    const dispatchAvgQty = dispatchTotalOrders > 0 ? dispatchTotalQty / dispatchTotalOrders : 0;

    const pendingTotalOrdersRaw = toNum(pendingSummary?.pending_total_orders);
    const pendingTotalOrders =
        pendingTotalOrdersRaw || pendingRows.reduce((s, r) => s + toNum(r.order_count), 0);

    const bucketAgg = useMemo(() => {
        const s = pendingBucketSummary;

        const fromSummary = {
            orders_0_2: toNum(s.orders_0_2_days),
            qty_0_2: toNum(s.qty_0_2_days),

            orders_2_5: toNum(s.orders_2_5_days),
            qty_2_5: toNum(s.qty_2_5_days),

            orders_5_7: toNum(s.orders_5_7_days),
            qty_5_7: toNum(s.qty_5_7_days),

            orders_7p: toNum(s.orders_7_plus_days),
            qty_7p: toNum(s.qty_7_plus_days),

            total_orders: toNum(s.total_orders ?? s.total),
            total_qty: toNum(s.total_qty),
        };

        const hasSummary =
            fromSummary.total_orders > 0 ||
            fromSummary.total_qty > 0 ||
            fromSummary.orders_0_2 > 0 ||
            fromSummary.qty_0_2 > 0;

        if (hasSummary) return fromSummary;

        const sum = (k) => pendingBucketRows.reduce((acc, r) => acc + toNum(r?.[k]), 0);

        return {
            orders_0_2: sum("orders_0_2_days"),
            qty_0_2: sum("qty_0_2_days"),

            orders_2_5: sum("orders_2_5_days"),
            qty_2_5: sum("qty_2_5_days"),

            orders_5_7: sum("orders_5_7_days"),
            qty_5_7: sum("qty_5_7_days"),

            orders_7p: sum("orders_7_plus_days"),
            qty_7p: sum("qty_7_plus_days"),

            total_orders: sum("total_orders") || sum("total"),
            total_qty: sum("total_qty"),
        };
    }, [pendingBucketSummary, pendingBucketRows]);

    const pendingSnapshotTotalOrders =
        toNum(bucketAgg.total_orders) ||
        toNum(bucketAgg.orders_0_2) +
        toNum(bucketAgg.orders_2_5) +
        toNum(bucketAgg.orders_5_7) +
        toNum(bucketAgg.orders_7p);

    const pendingSnapshotTotalQty =
        toNum(bucketAgg.total_qty) ||
        toNum(bucketAgg.qty_0_2) +
        toNum(bucketAgg.qty_2_5) +
        toNum(bucketAgg.qty_5_7) +
        toNum(bucketAgg.qty_7p);

    const sortedCouriers = useMemo(
        () => courierRows.slice().sort((a, b) => toNum(b.order_count) - toNum(a.order_count)),
        [courierRows]
    );

    const sortedLocations = useMemo(
        () => locationRows.slice().sort((a, b) => toNum(b.order_count) - toNum(a.order_count)),
        [locationRows]
    );

    const sortedPending = useMemo(
        () => pendingRows.slice().sort((a, b) => toNum(b.order_count) - toNum(a.order_count)),
        [pendingRows]
    );

    return (
        <div className="space-y-6">
            {/* Row 1: Dispatched + Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-6">
                    <CardShell title="Total Dispatch" icon={Truck} gradient={GRADIENTS.dispatched}>
                        {/* ✅ 2 cards top, Avg Qty centered below */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                            <MiniKpiCard
                                title="Orders"
                                Icon={Truck}
                                value={nf0.format(dispatchTotalOrders)}
                                loading={dispatchLoading}
                            />
                            <MiniKpiCard
                                title="Quantity"
                                Icon={Boxes}
                                value={nf1.format(dispatchTotalQty)}
                                loading={dispatchLoading}
                            />

                            {/* Centered third card */}
                            <div className="md:col-span-2 flex justify-center">
                                <div className="w-full md:w-[58%]">
                                    <MiniKpiCard
                                        title="Avg Qty"
                                        Icon={Boxes}
                                        value={nf1.format(dispatchAvgQty)}
                                        subtitle="Qty per order"
                                        loading={dispatchLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </div>

                {/* Pending Dispatch */}
                <div className="lg:col-span-6">
                    <CardShell title="Pending Dispatch" icon={Clock} gradient={GRADIENTS.pendingTop}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                            <div className="md:col-span-4">
                                <PendingTotalsPanel
                                    loading={pendingAgingLoading}
                                    totalOrders={pendingSnapshotTotalOrders}
                                    totalQty={pendingSnapshotTotalQty}
                                />
                            </div>

                            <div className="md:col-span-8">
                                <div className="grid grid-cols-2 gap-3">
                                    <BucketTile
                                        label="0–2 days"
                                        orders={bucketAgg.orders_0_2}
                                        qty={bucketAgg.qty_0_2}
                                        loading={pendingAgingLoading}
                                    />
                                    <BucketTile
                                        label="2–5 days"
                                        orders={bucketAgg.orders_2_5}
                                        qty={bucketAgg.qty_2_5}
                                        loading={pendingAgingLoading}
                                    />
                                    <BucketTile
                                        label="5–7 days"
                                        orders={bucketAgg.orders_5_7}
                                        qty={bucketAgg.qty_5_7}
                                        loading={pendingAgingLoading}
                                    />
                                    <BucketTile
                                        label="7+ days"
                                        orders={bucketAgg.orders_7p}
                                        qty={bucketAgg.qty_7p}
                                        loading={pendingAgingLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </div>
            </div>

            {/* Row 2: listings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4">
                    <CardShell title="Courier Wise" icon={Truck} gradient={GRADIENTS.courier}>
                        {courierLoading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total</p>
                                <p className="text-3xl font-bold text-white tabular-nums">
                                    {nf0.format(dispatchTotalOrders)}
                                </p>
                            </>
                        )}

                        <div className="mt-3">
                            <SimpleList
                                rows={sortedCouriers.slice(0, 14)}
                                total={dispatchTotalOrders}
                                loading={courierLoading}
                                getKey={(r, idx) => `${(r?.courier || "Unknown")}-${idx}`}
                                getName={(r) => (r?.courier || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Location Wise" icon={MapPin} gradient={GRADIENTS.location}>
                        {locationLoading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total</p>
                                <p className="text-3xl font-bold text-white tabular-nums">
                                    {nf0.format(dispatchTotalOrders)}
                                </p>
                            </>
                        )}

                        <div className="mt-3">
                            <SimpleList
                                rows={sortedLocations.slice(0, 14)}
                                total={dispatchTotalOrders}
                                loading={locationLoading}
                                getKey={(r, idx) => `${r?.location_name || "Unknown"}-${idx}`}
                                getName={(r) => (r?.location_name || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Pending (Location Wise)" icon={Clock} gradient={GRADIENTS.pendingList}>
                        {pendingListLoading ? (
                            <div className="space-y-2">
                                <PulseScan />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mt-1 tabular-nums">Total</p>
                                <p className="text-3xl font-bold text-white tabular-nums">
                                    {nf0.format(pendingTotalOrders)}
                                </p>
                            </>
                        )}

                        <div className="mt-3">
                            <SimpleList
                                rows={sortedPending.slice(0, 14)}
                                total={pendingTotalOrders}
                                loading={pendingListLoading}
                                getKey={(r, idx) => `${r?.location_name || "Unknown"}-${idx}`}
                                getName={(r) => (r?.location_name || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>
            </div>
        </div>
    );
};

export default memo(ReturnsCancelledAfterDispatchTable);
