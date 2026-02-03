import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import {
    TrendingUp,
    Receipt,
    ArrowUpRight,
    Users,
    UserX,
    Ban,
    PencilLine,
    MessageCircle,
} from "lucide-react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const pickRows = (resp) => resp?.rows || resp?.data?.rows || [];
const pickMeta = (resp) => resp?.meta || resp?.data?.meta || {};
const pickSummary = (resp) => resp?.summary || resp?.data?.summary || pickMeta(resp)?.summary || {};

function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

const GRADIENTS = {
    orders: "bg-gradient-to-br from-rose-950 to-rose-600",
    onbehalf: "bg-gradient-to-br from-sky-950 to-sky-600",
};

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <TrendingUp size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

function ArrowNavBadge() {
    return (
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ArrowUpRight size={22} className="text-white" />
        </div>
    );
}

const SectionCard = ({ title, icon: Icon, children, right }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
        <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {Icon ? <Icon size={20} /> : null}
                {title}
            </h3>
            {right}
        </div>
        {children}
    </div>
);

/** Try to find "amount" from KPI item if backend provides it; else fallback 0 */
function pickItemAmount(item) {
    if (!item) return 0;
    const meta = item?.meta || {};
    const candidates = [
        item?.amount,
        item?.amount_sum,
        item?.total_amount,
        item?.total,
        item?.grand_total_amount,
        item?.value_amount,
        item?.amountValue,
        meta?.amount,
        meta?.amount_sum,
        meta?.total_amount,
        meta?.total,
        meta?.grand_total_amount,
        meta?.value_amount,
    ];
    for (const c of candidates) {
        const n = toNum(c);
        if (n) return n;
    }
    return 0;
}

function buildOrderSnapshotMap(kpiResp) {
    const sections = kpiResp?.data?.sections ?? kpiResp?.sections ?? [];
    const orderSection = Array.isArray(sections) ? sections.find((s) => s?.key === "order_snapshot") : null;
    const items = Array.isArray(orderSection?.items) ? orderSection.items : [];
    const m = {};
    items.forEach((it) => {
        if (it?.key) m[it.key] = it;
    });
    return { orderSection, orderMap: m };
}

function OrderActionMiniCard({
                                 title,
                                 Icon,
                                 orders,
                                 amount,
                                 currency,
                                 loading,
                             }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                {Icon ? <Icon size={18} className="text-white/90" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="mt-3">
                    <PulseScan />
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    <div>
                        <div className="text-[11px] text-white/70">Orders</div>
                        <div className="text-2xl font-bold text-white tabular-nums">
                            {formatRoundedAmountWithCommas(toNum(orders))}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] text-white/70">Amount</div>
                        <div className="text-lg font-semibold text-white tabular-nums">
                            {currency} {formatRoundedAmountWithCommas(toNum(amount))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrdersSnapshotCard({
                                currency,
                                loading,
                                totalOrders,
                                cards,
                            }) {
    return (
        <div className={`${GRADIENTS.orders} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Receipt size={20} className="text-white" />
                        Orders
                    </h3>
                    <ArrowNavBadge />
                </div>

                <div className="mb-5">
                    {loading ? (
                        <div className="mt-2">
                            <PulseScan />
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-white/70 mt-1 tabular-nums">Total Orders</p>
                            <p className="text-4xl font-bold text-white tabular-nums">
                                {formatRoundedAmountWithCommas(toNum(totalOrders))}
                            </p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                    {cards.map((c) => (
                        <OrderActionMiniCard
                            key={c.key}
                            title={c.title}
                            Icon={c.Icon}
                            orders={c.orders}
                            amount={c.amount}
                            currency={currency}
                            loading={c.loading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const EcomOrdersTab = ({ enabled, filters, cache, colors }) => {
    const currency = useMemo(() => getCurrencyByCountry(filters?.country), [filters?.country]);

    // ✅ KPI (for Orders Snapshot numbers like Overview)
    const { data: kpiResp, isLoading: kpiLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/kpis/",
        filters,
        { enabled, ...cache }
    );

    // ✅ Top Orders (chart section stays as is)
    const { data: topOrdersResp, isLoading: topOrdersLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/order-amounts/",
        filters,
        { enabled, ...cache }
    );

    // ✅ Orders On Behalf (used in snapshot + chart section)
    const { data: ordersOnBehalfResp, isLoading: ordersOnBehalfLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/orders/on-behalf/",
        filters,
        { enabled, ...cache }
    );

    const topOrders = useMemo(() => pickRows(topOrdersResp), [topOrdersResp]);
    const ordersOnBehalf = useMemo(() => pickRows(ordersOnBehalfResp), [ordersOnBehalfResp]);

    // ---- Orders Snapshot (from KPI like Overview) ----
    const { orderMap } = useMemo(() => buildOrderSnapshotMap(kpiResp), [kpiResp]);

    const ordOrders = orderMap.orders; // total orders
    const ordCancelWhatsapp = orderMap.cancelled_by_whatsapp;
    const ordCancelEcom = orderMap.cancel_order_cancel;
    const ordEditedEcom = orderMap.cancel_edited_reason;

    // ---- On behalf summary (already exists) ----
    const ordersOnBehalfSummary = useMemo(() => {
        const s = pickSummary(ordersOnBehalfResp);

        const countRows = ordersOnBehalf.length;
        const totalRows = ordersOnBehalf.reduce((a, r) => a + toNum(r?.ordertotal), 0);

        const uniqueEmails = new Set(
            ordersOnBehalf.map((r) => String(r?.email || "").trim()).filter(Boolean)
        ).size;

        return {
            count: toNum(s?.total_orders) || countRows || 0,
            total: toNum(s?.total_amount) || totalRows || 0,
            unique: toNum(s?.unique_customers) || uniqueEmails || 0,
            top10Total: [...ordersOnBehalf]
                .sort((a, b) => toNum(b?.ordertotal) - toNum(a?.ordertotal))
                .slice(0, 10)
                .reduce((acc, r) => acc + toNum(r?.ordertotal), 0),
        };
    }, [ordersOnBehalfResp, ordersOnBehalf]);

    // ✅ New first row: single snapshot card with 4 mini cards
    const snapshotCards = useMemo(() => {
        return [
            {
                key: "wa_cancel",
                title: "WhatsApp Cancel",
                Icon: MessageCircle,
                orders: toNum(ordCancelWhatsapp?.value),
                // if backend gives amount in KPI item, we’ll use it, else 0
                amount: pickItemAmount(ordCancelWhatsapp),
                loading: kpiLoading,
            },
            {
                key: "ecom_cancel",
                title: "Cancel By ECOM",
                Icon: Ban,
                orders: toNum(ordCancelEcom?.value),
                amount: pickItemAmount(ordCancelEcom),
                loading: kpiLoading,
            },
            {
                key: "ecom_edited",
                title: "Edited By ECOM",
                Icon: PencilLine,
                orders: toNum(ordEditedEcom?.value),
                amount: pickItemAmount(ordEditedEcom),
                loading: kpiLoading,
            },
            {
                key: "on_behalf",
                title: "Order On Behalf",
                Icon: Users,
                orders: toNum(ordersOnBehalfSummary.count),
                amount: toNum(ordersOnBehalfSummary.total),
                loading: ordersOnBehalfLoading,
            },
        ];
    }, [
        ordCancelWhatsapp,
        ordCancelEcom,
        ordEditedEcom,
        ordersOnBehalfSummary,
        kpiLoading,
        ordersOnBehalfLoading,
    ]);

    // ---------- Charts (unchanged) ----------
    const chartTopOrders = useMemo(
        () =>
            topOrders.map((r) => ({
                name: r?.OrderNumber || "-",
                value: toNum(r?.GrandTotalAmount),
            })),
        [topOrders]
    );

    const chartOrdersOnBehalf = useMemo(() => {
        return [...ordersOnBehalf]
            .map((r) => ({ name: r?.orderno || "-", value: toNum(r?.ordertotal) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }, [ordersOnBehalf]);

    return (
        <div className="space-y-6">
            {/* ✅ FIRST ROW (UPDATED AS YOU ASKED): Single card + 4 mini cards */}
            <OrdersSnapshotCard
                currency={currency}
                loading={kpiLoading}
                totalOrders={toNum(ordOrders?.value)}
                cards={snapshotCards}
            />

            {/* ✅ Rest (unchanged) */}
            <SectionCard
                title="Top 10 Orders"
                icon={TrendingUp}

            >
                {topOrdersLoading ? (
                    <LoadingSpinner />
                ) : !isNonEmptyArray(topOrders) ? (
                    <EmptyState />
                ) : (
                    <div className="h-[380px]">
                        <ReChart
                            data={chartTopOrders}
                            variant="bar"
                            dimensions={{ height: 380, bottom: 0 }}
                            colors={colors}
                        />
                    </div>
                )}
            </SectionCard>

            <SectionCard
                title="Order On Behalf"
                icon={Receipt}

            >
                {ordersOnBehalfLoading ? (
                    <LoadingSpinner />
                ) : !isNonEmptyArray(ordersOnBehalf) ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-3">
                        <div className="h-[360px]">
                            <ReChart
                                data={chartOrdersOnBehalf}
                                variant="bar"
                                dimensions={{ height: 360, bottom: 0 }}
                                colors={colors}
                            />
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Showing top 10 “on behalf” orders by amount for the selected window.
                        </div>
                    </div>
                )}
            </SectionCard>
        </div>
    );
};

export default EcomOrdersTab;
