import React, { memo, useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { Truck, MapPin, Clock, Boxes, ArrowUpRight } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US");
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const unwrap = (resp) => {
    if (!resp) return {};
    if (resp?.summary || resp?.courier_rows || resp?.location_rows || resp?.pending_location_rows) return resp;
    if (
        resp?.data?.summary ||
        resp?.data?.courier_rows ||
        resp?.data?.location_rows ||
        resp?.data?.pending_location_rows
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
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">{subtitle ?? "\u00A0"}</p>
                </>
            )}
        </div>
    );
}

/**
 * ✅ ReturnsLocationWise-style list (bigger, name first, value right)
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

    const courierPayload = useMemo(() => unwrap(courierResp), [courierResp]);
    const locationPayload = useMemo(() => unwrap(locationResp), [locationResp]);
    const pendingPayload = useMemo(() => unwrap(pendingResp), [pendingResp]);

    const courierSummary = courierPayload?.summary || {};
    const locationSummary = locationPayload?.summary || {};
    const pendingSummary = pendingPayload?.summary || {};

    const courierRows = useMemo(() => (courierPayload?.courier_rows || []).slice(), [courierPayload]);
    const locationRows = useMemo(() => (locationPayload?.location_rows || []).slice(), [locationPayload]);
    const pendingRows = useMemo(() => (pendingPayload?.pending_location_rows || []).slice(), [pendingPayload]);

    // ✅ Dispatch totals: use courier/location summary
    const dispatchTotalOrdersRaw = toNum(
        courierSummary?.dispatch_total_orders ?? locationSummary?.dispatch_total_orders
    );
    const dispatchTotalQtyRaw = toNum(
        courierSummary?.dispatch_total_qty ?? locationSummary?.dispatch_total_qty
    );

    // ✅ Pending totals: MUST use pending summary
    const pendingTotalOrdersRaw = toNum(pendingSummary?.pending_total_orders);
    const pendingTotalQtyRaw = toNum(pendingSummary?.pending_total_qty);

    // ✅ Fallback safety
    const dispatchTotalOrders =
        dispatchTotalOrdersRaw ||
        courierRows.reduce((s, r) => s + toNum(r.order_count), 0) ||
        locationRows.reduce((s, r) => s + toNum(r.order_count), 0);

    const dispatchTotalQty =
        dispatchTotalQtyRaw ||
        courierRows.reduce((s, r) => s + toNum(r.total_qty), 0) ||
        locationRows.reduce((s, r) => s + toNum(r.total_qty), 0);

    const pendingTotalOrders =
        pendingTotalOrdersRaw || pendingRows.reduce((s, r) => s + toNum(r.order_count), 0);

    const pendingTotalQty =
        pendingTotalQtyRaw || pendingRows.reduce((s, r) => s + toNum(r.total_qty), 0);

    const anyLoading = courierLoading || locationLoading || pendingLoading;

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
                    <CardShell title="Total Dispatched" icon={Truck} gradient={GRADIENTS.dispatched}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                            <MiniKpiCard
                                title="Dispatched Orders"
                                Icon={Truck}
                                value={nf0.format(dispatchTotalOrders)}
                                subtitle="Total shipped"
                                loading={anyLoading}
                            />
                            <MiniKpiCard
                                title="Dispatched Qty"
                                Icon={Boxes}
                                value={nf1.format(dispatchTotalQty)}
                                subtitle="Items shipped"
                                loading={anyLoading}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-6">
                    <CardShell title="Pending Dispatched" icon={Clock} gradient={GRADIENTS.pendingTop}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                            <MiniKpiCard
                                title="Pending Orders"
                                Icon={Clock}
                                value={nf0.format(pendingTotalOrders)}
                                subtitle="Pending dispatch"
                                loading={anyLoading}
                            />
                            <MiniKpiCard
                                title="Pending Qty"
                                Icon={Boxes}
                                value={nf1.format(pendingTotalQty)}
                                subtitle="Items pending"
                                loading={anyLoading}
                            />
                        </div>
                    </CardShell>
                </div>
            </div>

            {/* Row 2: 3 listings (Totals styled like ReturnsLocationWise) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4">
                    <CardShell title="Courier Wise Dispatch" icon={Truck} gradient={GRADIENTS.courier}>
                        {/* ✅ like ReturnsLocationWise: Total label + big number (and removed "Couriers: X") */}
                        {anyLoading ? (
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
                                loading={anyLoading}
                                getKey={(r, idx) => `${(r?.courier || "Unknown")}-${idx}`}
                                getName={(r) => (r?.courier || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Location Wise Dispatch" icon={MapPin} gradient={GRADIENTS.location}>
                        {/* ✅ like ReturnsLocationWise: Total label + big number */}
                        {anyLoading ? (
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
                                loading={anyLoading}
                                getKey={(r, idx) => `${r?.location_name || "Unknown"}-${idx}`}
                                getName={(r) => (r?.location_name || "Unknown").trim() || "Unknown"}
                                getCount={(r) => r?.order_count}
                            />
                        </div>
                    </CardShell>
                </div>

                <div className="lg:col-span-4">
                    <CardShell title="Pending Dispatch (Location Wise)" icon={Clock} gradient={GRADIENTS.pendingList}>
                        {/* ✅ like ReturnsLocationWise: Total label + big number (use pending total) */}
                        {anyLoading ? (
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
                                loading={anyLoading}
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
