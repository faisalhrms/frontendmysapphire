import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
    TrendingUp,
    Landmark,
    BadgePercent,
    RotateCcw,
    AlertTriangle,
    UserX,
    Ban,
    PencilLine,
    ArrowUpRight,
    FileText,
    Truck,
    Boxes,
    Clock,
    Users,
    Info,
} from "lucide-react";
import { createPortal } from "react-dom";

import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

// ✅ money keys
const MONEY_KEYS = new Set([
    "avg_order_price",
    "coupon_amount",
    "store_credit",
    "employee_discount",
    "payment_gateway_total",
    "return_amount",
    "dispatch_total_amount",
]);

const PCT_KEYS = new Set(["return_percent"]);

const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function toNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function unwrapPayload(resp) {
    if (!resp) return {};
    if (resp?.data?.summary || resp?.data?.rows) return resp.data;
    return resp;
}

// ✅ currency mapping
function getCurrencyByCountry(country) {
    const c = String(country || "PK").toUpperCase();
    if (c === "INT") return "USD";
    if (c === "UAE") return "AED";
    if (c === "UK") return "EURO";
    return "PKR";
}

function fmtValue({ key, value, formatRoundedAmountWithCommas, currency }) {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;

    const n = toNum(value);
    if (PCT_KEYS.has(key)) return `${n.toFixed(2)}%`;
    if (MONEY_KEYS.has(key)) return `${currency} ${formatRoundedAmountWithCommas(n)}`;
    return formatRoundedAmountWithCommas(n);
}

function cardsToMap(cardsArr) {
    const m = {};
    (Array.isArray(cardsArr) ? cardsArr : []).forEach((c) => {
        if (c?.key) m[c.key] = c;
    });
    return m;
}

const GRADIENTS = {
    sales: "bg-gradient-to-br from-black to-blue",
    payments: "bg-gradient-to-br from-black to-green",
    promo: "bg-gradient-to-br from-black to-black",
    orders: "bg-gradient-to-br from-rose-950 to-rose-600",
    returns: "bg-gradient-to-br from-purple to-pink",
    fulfillment: "bg-gradient-to-br from-amber-950 to-amber-500",
    customers: "bg-gradient-to-br from-sky-950 to-sky-600",
    users: "bg-gradient-to-br from-slate-950 to-slate-700",
};

function InfoHover({ text, widthClass = "w-72" }) {
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!open) return;

        const update = () => {
            const el = ref.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            setPos({
                top: r.bottom + 10,
                left: r.left + r.width / 2,
            });
        };

        update();
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [open]);

    if (!text) return null;

    return (
        <span
            ref={ref}
            className="inline-flex items-center"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* ✅ removed cursor-help (question mark cursor) */}
            <Info size={16} className="text-white/80 hover:text-white" />

            {open && typeof document !== "undefined"
                ? createPortal(
                    <div
                        className={[
                            "fixed -translate-x-1/2",
                            widthClass,
                            "rounded-lg bg-black/90 text-white text-xs px-3 py-2 shadow-lg backdrop-blur-sm",
                            "z-[999999]",
                            "pointer-events-none",
                        ].join(" ")}
                        style={{ top: pos.top, left: pos.left }}
                    >
                        {text}
                    </div>,
                    document.body
                )
                : null}
        </span>
    );
}

function PromoMiniCard({
                           title,
                           Icon,
                           amountKey,
                           amountValue,
                           countLabel,
                           countValue,
                           loading,
                           formatRoundedAmountWithCommas,
                           infoText,
                           currency,
                       }) {
    return (
        <div className="relative z-0 hover:z-50 bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Icon size={18} className="text-white" />
                    {title}
                    {infoText ? <InfoHover text={infoText} /> : null}
                </h3>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                {loading ? (
                    <div className="space-y-2">
                        <PulseScan />
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {fmtValue({
                                key: amountKey,
                                value: amountValue,
                                formatRoundedAmountWithCommas,
                                currency,
                            })}
                        </p>

                        <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                            {countLabel && countValue !== null && countValue !== undefined
                                ? typeof countValue === "number"
                                    ? `${countLabel}: ${formatRoundedAmountWithCommas(toNum(countValue))}`
                                    : `${countLabel}: ${String(countValue)}`
                                : "\u00A0"}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

function ArrowNavButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.();
            }}
            className="bg-white/20 p-2 rounded-lg backdrop-blur-sm hover:bg-white/25 transition"
            aria-label="Open details"
            title="Open details"
        >
            <ArrowUpRight size={22} className="text-white" />
        </button>
    );
}

function KpiMiniCard({ title, Icon, value, loading }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                {Icon ? <Icon size={18} className="text-white/90" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="mt-2">
                    <PulseScan />
                </div>
            ) : (
                <p className="mt-3 text-2xl font-bold text-white tabular-nums">{value ?? "-"}</p>
            )}
        </div>
    );
}

function UsersSourceCard({ title, totalActiveUsers = 0, dormantUsers = 0, loading = false }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
            <div className="text-sm font-semibold text-white/90">{title}</div>

            {loading ? (
                <div className="mt-3">
                    <PulseScan />
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/85 tabular-nums">
                        <span>Total Active Users:</span>
                        <span className="font-semibold text-white">{NF0.format(toNum(totalActiveUsers))}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/85 tabular-nums">
                        <span>Dormant Users:</span>
                        <span className="font-semibold text-white">{NF0.format(toNum(dormantUsers))}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const EcomOverview = ({
                          kpiResp,
                          kpiLoading,
                          formatRoundedAmountWithCommas,

                          setActiveTab,
                          setActiveReturnsTab,
                          setActiveCustomersTab,

                          dispatchSummaryRes,
                          dispatchSummaryLoading,

                          inactiveUsersRes,
                          inactiveUsersLoading,

                          filters,
                          cache,
                      }) => {
    // ✅ currency based on selected country
    const currency = useMemo(() => getCurrencyByCountry(filters?.country), [filters?.country]);

    // ✅ segmentation summary for Loyal + Churned
    const customerFilters = useMemo(() => ({ country: filters?.country || "PK" }), [filters?.country]);

    const { data: segmentationRes, isLoading: segmentationLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customers/segmentation/summary/",
        customerFilters,
        { enabled: true, ...(cache || {}) }
    );

    const segmentationPayload = useMemo(() => unwrapPayload(segmentationRes), [segmentationRes]);
    const segmentationRows = Array.isArray(segmentationPayload?.rows) ? segmentationPayload.rows : [];

    const isPK = useMemo(
        () => String(filters?.country || "PK").toUpperCase() === "PK",
        [filters?.country]
    );
    const isINT = useMemo(
        () => String(filters?.country || "PK").toUpperCase() === "INT",
        [filters?.country]
    );
    const loyalCount = useMemo(() => {
        if (!isPK) return 0;
        const row = segmentationRows.find((r) => String(r?.customer_type || "").toLowerCase() === "loyal");
        return toNum(row?.customer_count);
    }, [segmentationRows, isPK]);

    const churnedCount = useMemo(() => {
        if (!isPK) return 0;
        const row = segmentationRows.find((r) => String(r?.customer_type || "").toLowerCase() === "churned");
        return toNum(row?.customer_count);
    }, [segmentationRows, isPK]);

    const loyalInfoText = `Criteria: 3 or more orders in past 6 months.`;
    const churnedInfoText = `Criteria: No order in past 6 months.`;

    const cardsArr = useMemo(() => {
        const c = kpiResp?.data?.cards ?? kpiResp?.cards;
        return Array.isArray(c) ? c : [];
    }, [kpiResp]);

    const cards = useMemo(() => cardsToMap(cardsArr), [cardsArr]);

    const orders = cards.orders;
    const orderQty = cards.order_qty; // ✅ NEW

    const aov = cards.avg_order_price;
    const pg = cards.payment_gateway_total;

    const couponAmount = cards.coupon_amount;
    const coupons = cards.coupons;
    const storeCredit = cards.store_credit;
    const empDisc = cards.employee_discount;
    const empOrders = cards.employee_discount_orders;
    const storeCreditTx = cards.store_credit_transactions;

    // ✅ KEEP Total Orders as-is (top number)
    const salesTopValue = orders
        ? fmtValue({
            key: "orders",
            value: orders.value,
            formatRoundedAmountWithCommas,
            currency,
        })
        : "-";

    const sectionsArr = useMemo(() => {
        const s = kpiResp?.data?.sections ?? kpiResp?.sections;
        return Array.isArray(s) ? s : [];
    }, [kpiResp]);

    const returnsSection = useMemo(() => sectionsArr.find((s) => s?.key === "returns_section") || null, [sectionsArr]);

    const returnsItems = Array.isArray(returnsSection?.items) ? returnsSection.items : [];
    const returnsMap = useMemo(() => {
        const m = {};
        returnsItems.forEach((c) => {
            if (c?.key) m[c.key] = c;
        });
        return m;
    }, [returnsItems]);

    const retOrders = returnsMap.returns;
    const retQty = returnsMap.return_qty;
    const retAmount = returnsMap.return_amount;
    const retAvgAty = returnsMap.avg_return_qty;

    const pgTotal = toNum(pg?.value);
    const pgRows = (Array.isArray(pg?.rows) ? pg.rows : [])
        .slice()
        .sort((x, y) => toNum(y?.amount_sum) - toNum(x?.amount_sum))
        .map((r) => {
            const name = r?.PaymentGatewayName || "Unknown";
            const amt = toNum(r?.amount_sum);
            const share = pgTotal > 0 ? (amt / pgTotal) * 100 : 0;

            return {
                key: name,
                label: name,
                countLabel: "Share",
                countValue: `${share.toFixed(2)}%`,
                amount: amt,
            };
        });

    const promoTotalAmt = toNum(couponAmount?.value) + toNum(storeCredit?.value) + toNum(empDisc?.value);
    const promoTotalOrders = toNum(coupons?.value) + toNum(empOrders?.value) + toNum(storeCreditTx?.value);

    function gridColsClass(n) {
        if (n <= 1) return "md:grid-cols-1";
        if (n === 2) return "md:grid-cols-2";
        if (n === 3) return "md:grid-cols-3";
        return "md:grid-cols-4";
    }

    const customerSection = useMemo(() => sectionsArr.find((s) => s?.key === "customer_snapshot") || null, [sectionsArr]);

    const customerItems = Array.isArray(customerSection?.items) ? customerSection.items : [];
    const customerMap = useMemo(() => {
        const m = {};
        customerItems.forEach((c) => {
            if (c?.key) m[c.key] = c;
        });
        return m;
    }, [customerItems]);

    const totalCustomers = customerMap.total_customers;
    const habitualReturns = customerMap.habitual_returns;

    const orderSection = useMemo(() => sectionsArr.find((s) => s?.key === "order_snapshot") || null, [sectionsArr]);

    const orderItems = Array.isArray(orderSection?.items) ? orderSection.items : [];
    const orderMap = useMemo(() => {
        const m = {};
        orderItems.forEach((c) => {
            if (c?.key) m[c.key] = c;
        });
        return m;
    }, [orderItems]);

    const ordOrders = orderMap.orders;
    const ordCancelWhatsapp = orderMap.cancelled_by_whatsapp;
    const ordCancelEcom = orderMap.cancel_order_cancel;
    const ordEditedEcom = orderMap.cancel_edited_reason;

    // Dispatch
    const dispatchPayload = useMemo(() => unwrapPayload(dispatchSummaryRes), [dispatchSummaryRes]);
    const dispatchSummary = dispatchPayload?.summary || {};
    const dispatchedAmount = toNum(dispatchSummary.dispatch_total_amount);
    const dispatchedOrders = toNum(dispatchSummary.dispatch_total_orders);
    const dispatchedQty = toNum(dispatchSummary.dispatch_total_qty);
    const pendingDispatchOrders = toNum(dispatchSummary.pending_total_orders);
    const avgQtyPerOrder = dispatchedOrders > 0 ? dispatchedQty / dispatchedOrders : 0;

    // Users
    const usersPayload = useMemo(() => unwrapPayload(inactiveUsersRes), [inactiveUsersRes]);
    const usersSummary = usersPayload?.summary || {};
    const omsDormantUsers = toNum(usersSummary.dormant_users ?? usersSummary.inactive_users);
    const omsTotalActiveUsers = toNum(usersSummary.total_active_users ?? 0);

    const sfccTotalUsers = 0;
    const sfccDormantUsers = 0;

    return (
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.sales} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp size={20} className="text-white" />
                                    Sales
                                    <InfoHover text="Orders placed within the applied date range which have been successfully synced to the OMS." />
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white" />
                                </div>
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Orders</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">{salesTopValue}</p>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                {/* ✅ ONLY THIS CARD changed: Orders -> Order Qty */}
                                <PromoMiniCard
                                    title={orderQty?.title || "Order Qty"}
                                    Icon={Boxes}
                                    amountKey="order_qty"
                                    amountValue={orderQty?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title="Avg Order Value"
                                    Icon={BadgePercent}
                                    amountKey="avg_order_price"
                                    amountValue={aov?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.payments} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Landmark size={20} className="text-white" />
                                    Payment Breakdown
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white" />
                                </div>
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Sales</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {currency} {formatRoundedAmountWithCommas(pgTotal)}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className={`grid grid-cols-1 ${gridColsClass(pgRows.length)} gap-4 items-stretch`}>
                                {kpiLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
                                            <div className="mt-2">
                                                <PulseScan />
                                            </div>
                                        </div>
                                        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full">
                                            <div className="mt-2">
                                                <PulseScan />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    pgRows.map((r) => (
                                        <PromoMiniCard
                                            key={r.key}
                                            title={r.label}
                                            Icon={Landmark}
                                            amountKey="payment_gateway_total"
                                            amountValue={r.amount}
                                            countLabel={r.countLabel}
                                            countValue={r.countValue}
                                            loading={kpiLoading}
                                            formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                            currency={currency}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ REST OF YOUR FILE UNCHANGED */}
            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.promo} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <BadgePercent size={20} className="text-white" />
                                    Discount Snapshot
                                </h3>
                                <ArrowNavButton onClick={() => setActiveTab?.("promos")} />
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Amount</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {currency} {formatRoundedAmountWithCommas(promoTotalAmt)}
                                        </p>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">
                                            Total Orders: {formatRoundedAmountWithCommas(promoTotalOrders)}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                                <PromoMiniCard
                                    title="Coupons"
                                    Icon={BadgePercent}
                                    amountKey="coupon_amount"
                                    amountValue={couponAmount?.value}
                                    countLabel="Orders"
                                    countValue={coupons?.value}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title="Store Credit"
                                    Icon={Landmark}
                                    amountKey="store_credit"
                                    amountValue={storeCredit?.value}
                                    countLabel="Orders"
                                    countValue={storeCreditTx?.value}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title="Employee Discount"
                                    Icon={BadgePercent}
                                    amountKey="employee_discount"
                                    amountValue={empDisc?.value}
                                    countLabel="Orders"
                                    countValue={empOrders?.value}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.orders} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FileText size={20} className="text-white" />
                                    {/* ✅ removed Snapshot */}
                                    {(orderSection?.title || "Orders Snapshot").replace(/\s*Snapshot\s*/i, "")}
                                </h3>

                                <ArrowNavButton onClick={() => setActiveTab?.("orders")} />
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Orders</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "orders",
                                                value: ordOrders?.value,
                                                formatRoundedAmountWithCommas,
                                                currency,
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                                <PromoMiniCard
                                    title={ordCancelWhatsapp?.title || "WhatsApp Cancellation"}
                                    Icon={UserX}
                                    amountKey="cancelled_by_whatsapp"
                                    amountValue={ordCancelWhatsapp?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title={ordCancelEcom?.title || "Canceled By ECOM"}
                                    Icon={Ban}
                                    amountKey="cancel_order_cancel"
                                    amountValue={ordCancelEcom?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title={ordEditedEcom?.title || "Edited By ECOM"}
                                    Icon={PencilLine}
                                    amountKey="cancel_edited_reason"
                                    amountValue={ordEditedEcom?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.fulfillment} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Truck size={20} className="text-white" />
                                    {/* ✅ removed Snapshot */}
                                    Dispatch
                                    <InfoHover text="FOs dispatched within the applied date range." />
                                </h3>

                                <ArrowNavButton
                                    onClick={() => {
                                        setActiveTab?.("returns");
                                        setActiveReturnsTab?.("cancelled");
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                {dispatchSummaryLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Amount</p>

                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {currency} {formatRoundedAmountWithCommas(dispatchedAmount)}
                                        </p>


                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                                <KpiMiniCard
                                    title="Dispatch Orders"
                                    Icon={Boxes}
                                    value={NF0.format(dispatchedOrders)}
                                    loading={dispatchSummaryLoading}
                                />

                                {/* ✅ Avg Order -> Avg Qty */}
                                <KpiMiniCard
                                    title="Avg Qty"
                                    Icon={TrendingUp}
                                    value={NF2.format(avgQtyPerOrder)}
                                    loading={dispatchSummaryLoading}
                                />

                                <KpiMiniCard
                                    title="Pending Dispatch"
                                    Icon={Clock}
                                    value={NF0.format(pendingDispatchOrders)}
                                    loading={dispatchSummaryLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.returns} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <RotateCcw size={20} className="text-white" />
                                    {/* ✅ removed Snapshot */}
                                    {(returnsSection?.title || "Returns Snapshot").replace(/\s*Snapshot\s*/i, "")}
                                    <InfoHover text="FOs Returns within the applied date range." />
                                </h3>

                                <ArrowNavButton
                                    onClick={() => {
                                        setActiveTab?.("returns");
                                        setActiveReturnsTab?.("location");
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Amount</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "return_amount",
                                                value: retAmount?.value,
                                                formatRoundedAmountWithCommas,
                                                currency,
                                            })}
                                        </p>

                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                                <PromoMiniCard
                                    title={retOrders?.title || "Orders"}
                                    Icon={RotateCcw}
                                    amountKey="returns"
                                    amountValue={retOrders?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title={retQty?.title || "Qty"}
                                    Icon={AlertTriangle}
                                    amountKey="return_qty"
                                    amountValue={retQty?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />

                                <PromoMiniCard
                                    title={retAvgAty?.title || "Avg Qty"}
                                    Icon={TrendingUp}
                                    amountKey="avg_return_qty"
                                    amountValue={retAvgAty?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.customers} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <UserX size={20} className="text-white" />
                                    {/* ✅ removed Snapshot */}
                                    {(customerSection?.title || "Customers Snapshot").replace(/\s*Snapshot\s*/i, "")}
                                </h3>

                                <ArrowNavButton
                                    onClick={() => {
                                        setActiveTab?.("customers");
                                        setActiveCustomersTab?.("habitual");
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Customers</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "total_customers",
                                                value: isPK ? totalCustomers?.value : 0,
                                                formatRoundedAmountWithCommas,
                                                currency,
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">


                                <PromoMiniCard
                                    title="Loyal"
                                    Icon={Users}
                                    amountKey="loyal"
                                    amountValue={loyalCount}
                                    countLabel={null}
                                    countValue={null}
                                    loading={segmentationLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                    infoText={loyalInfoText}
                                />

                                <PromoMiniCard
                                    title="Churned"
                                    Icon={UserX}
                                    amountKey="churned"
                                    amountValue={churnedCount}
                                    countLabel={null}
                                    countValue={null}
                                    loading={segmentationLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                    infoText={churnedInfoText}
                                />
                                <PromoMiniCard
                                    // title={habitualReturns?.title || "High Returners"}
                                    title={ "High Returners"}

                                    Icon={RotateCcw}
                                    amountKey="habitual_returns"
                                    amountValue={isPK ? habitualReturns?.value : 0}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                    currency={currency}
                                    infoText="Criteria: More than 5 orders placed and return ratio above 50%."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className={`${GRADIENTS.users} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-20">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Users size={20} className="text-white" />
                                    {/* ✅ removed Snapshot */}
                                    Users
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                <UsersSourceCard
                                    title="OMS/SFSC"
                                    totalActiveUsers={omsTotalActiveUsers}
                                    dormantUsers={omsDormantUsers}
                                    loading={inactiveUsersLoading}
                                />

                                <UsersSourceCard
                                    title="SFCC (InProcess)"
                                    totalUsers={sfccTotalUsers}
                                    dormantUsers={sfccDormantUsers}
                                    loading={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(EcomOverview);
