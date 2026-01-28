import React, { memo, useMemo } from "react";
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
    FileText
} from "lucide-react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

const PKR_KEYS = new Set([
    "avg_order_price",
    "coupon_amount",
    "store_credit",
    "employee_discount",
    "payment_gateway_total",
    "return_amount",
]);

const PCT_KEYS = new Set(["return_percent"]);

function toNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function fmtValue({ key, value, formatRoundedAmountWithCommas }) {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;

    const n = toNum(value);
    if (PCT_KEYS.has(key)) return `${n.toFixed(2)}%`;
    if (PKR_KEYS.has(key)) return `PKR ${formatRoundedAmountWithCommas(n)}`;
    return formatRoundedAmountWithCommas(n);
}

/**
 * Since we removed delta/compare from backend, iconDirection can be driven by value.
 * This is just for coloring the icon (success/danger/white).
 */
function iconDirectionFromValue(card) {
    if (!card) return null;
    const n = Number(card?.value);
    return Number.isFinite(n) ? n : null;
}

function iconClass(n) {
    if (n === null) return "text-white";
    if (n > 0) return "text-success";
    if (n < 0) return "text-danger";
    return "text-white";
}

function cardsToMap(cardsArr) {
    const m = {};
    (Array.isArray(cardsArr) ? cardsArr : []).forEach((c) => {
        if (c?.key) m[c.key] = c;
    });
    return m;
}

/**
 * ✅ Gradient variants (NO "bg-" here, because we already apply bg-gradient-to-br in component)
 */
const GRADIENTS = {
    sales: "bg-gradient-to-br from-black to-blue",
    payments: "bg-gradient-to-br from-black to-green",
    promo: "from-black to-black",
    returns: "bg-gradient-to-br from-purple to-pink",
};

function PromoMiniCard({
                           title,
                           Icon,
                           amountKey,
                           amountValue,
                           countLabel,
                           countValue,
                           loading,
                           formatRoundedAmountWithCommas,
                       }) {

    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Icon size={18} className="text-white" />
                    {title}
                </h3>
            </div>

            {/* body */}
            <div className="flex-1 flex flex-col justify-between">
                {loading ? (
                    <div className="space-y-2">
                            <PulseScan/>
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {fmtValue({key: amountKey, value: amountValue, formatRoundedAmountWithCommas})}
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


const EcomOverview = ({kpiResp, kpiLoading, formatRoundedAmountWithCommas}) => {
    const cardsArr = useMemo(() => {
        const c = kpiResp?.data?.cards ?? kpiResp?.cards;
        return Array.isArray(c) ? c : [];
    }, [kpiResp]);

    const cards = useMemo(() => cardsToMap(cardsArr), [cardsArr]);

    const orders = cards.orders;
    const aov = cards.avg_order_price;

    const pg = cards.payment_gateway_total;

    const couponAmount = cards.coupon_amount;
    const coupons = cards.coupons;
    const storeCredit = cards.store_credit;
    const empDisc = cards.employee_discount;
    const empOrders = cards.employee_discount_orders;
    const storeCreditTx = cards.store_credit_transactions;


    const salesTopValue = orders
        ? fmtValue({ key: "orders", value: orders.value, formatRoundedAmountWithCommas })
        : "-";

    const sectionsArr = useMemo(() => {
        const s = kpiResp?.data?.sections ?? kpiResp?.sections;
        return Array.isArray(s) ? s : [];
    }, [kpiResp]);

    const returnsSection = useMemo(() => {
        return sectionsArr.find((s) => s?.key === "returns_section") || null;
    }, [sectionsArr]);

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
    // -------------------------
    // Payments
    // -------------------------
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
                countLabel: 'Share',
                countValue: `${share.toFixed(2)}%`,
                amount: amt,
                valueLine: `PKR ${formatRoundedAmountWithCommas(amt)}`,
            };
        });

    // -------------------------
    // Promo totals (TOP)
    // Total Promo Impact (PKR) = coupon_amount + store_credit + employee_discount
    // Orders affected (count) = coupons + employee_discount_orders + store_credit_transactions
    // -------------------------
    const promoTotalAmt = toNum(couponAmount?.value) + toNum(storeCredit?.value) + toNum(empDisc?.value);
    const promoTotalOrders = toNum(coupons?.value) + toNum(empOrders?.value) + toNum(storeCreditTx?.value);

    function gridColsClass(n) {
        if (n <= 1) return "md:grid-cols-1";
        if (n === 2) return "md:grid-cols-2";
        if (n === 3) return "md:grid-cols-3";
        return "md:grid-cols-4";
    }

    const customerSection = useMemo(() => {
        return sectionsArr.find((s) => s?.key === "customer_snapshot") || null;
    }, [sectionsArr]);

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
    const customerMissingEmail = customerMap.missing_email;
    const redFlags = customerMap.red_flags;


    const orderSection = useMemo(() => {
        return sectionsArr.find((s) => s?.key === "order_snapshot") || null;
    }, [sectionsArr]);

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


    return (
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ✅ Sales Trend (2 cards) */}
                <div className="lg:col-span-6">
                    <div
                        className={`bg-gradient-to-br ${GRADIENTS.sales} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16"/>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TrendingUp size={20} className="text-white"/>
                                    Sales Trend
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white"/>
                                </div>
                            </div>

                            {/* Top summary */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                    <p className="text-xs text-white/70 mt-1 tabular-nums">Total Orders</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">{salesTopValue}</p>
                                    </>
                                )}
                            </div>

                            {/* 2 cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                <PromoMiniCard
                                    title={orders?.title || "Orders"}
                                    Icon={TrendingUp}
                                    amountKey="orders"
                                    amountValue={orders?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                />

                                <PromoMiniCard
                                    title={aov?.title || "Avg Order Price"}
                                    Icon={BadgePercent}
                                    amountKey="avg_order_price"
                                    amountValue={aov?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Payment Breakdown (dynamic cards count) */}
                <div className="lg:col-span-6">
                    <div
                        className={`bg-gradient-to-br ${GRADIENTS.payments} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16"/>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Landmark size={20} className="text-white"/>
                                    Payment Breakdown
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white"/>
                                </div>
                            </div>

                            {/* Top summary */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Sales</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            PKR {formatRoundedAmountWithCommas(pgTotal)}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Dynamic cards */}
                            <div className={`grid grid-cols-1 ${gridColsClass(pgRows.length)} gap-4 items-stretch`}>
                                {kpiLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                        <div
                                            className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
                                            <div className="mt-2">
                                                <PulseScan/>
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
                                            <div className="mt-2">
                                                <PulseScan/>
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
                                        />
                                        ))
                                        )}
                                    </div>
                                    </div>
                                    </div>
                                    </div>
            </div>


            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ✅ Discount Snapshot: 3 cards */}
                <div className="lg:col-span-6">
                    <div
                        className="bg-gradient-to-br from-black to-black rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16"/>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <BadgePercent size={20} className="text-white"/>
                                    Discount Snapshot
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white"/>
                                </div>
                            </div>

                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">
                                            Total Amount
                                        </p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            PKR {formatRoundedAmountWithCommas(promoTotalAmt)}
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
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Returns card stays same */}
                <div className="lg:col-span-6">
                    <div
                        className={`bg-gradient-to-br from-gray-950 to-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16"/>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <RotateCcw size={20} className="text-white"/>
                                    {returnsSection?.title || "Returns"}
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white"/>
                                </div>
                            </div>

                            {/* ✅ Top summary (Amount + Orders) */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Amount</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "return_amount",
                                                value: retAmount?.value,
                                                formatRoundedAmountWithCommas
                                            })}
                                        </p>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">
                                            Total Orders: {formatRoundedAmountWithCommas(toNum(retOrders?.value))}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* ✅ 3 cards grid (Orders + Qty + Avg ATY) */}
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
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Row 3 - Customer + Orders Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Customer Snapshot */}
                <div className="lg:col-span-6">
                    <div className="bg-gradient-to-br from-sky-950 to-sky-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <UserX size={20} className="text-white" />
                                    {customerSection?.title || "Customer Snapshot"}
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white" />
                                </div>
                            </div>

                            {/* Top summary */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">Total Customers</p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "total_customers",
                                                value: totalCustomers?.value,
                                                formatRoundedAmountWithCommas,
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* 4 cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

                                <PromoMiniCard
                                    title={habitualReturns?.title || "Habitual Returns"}
                                    Icon={RotateCcw}
                                    amountKey="habitual_returns"
                                    amountValue={habitualReturns?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                />

                                <PromoMiniCard
                                    title={customerMissingEmail?.title || "Missing Emails"}
                                    Icon={AlertTriangle}
                                    amountKey="missing_email"
                                    amountValue={customerMissingEmail?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                />

                                <PromoMiniCard
                                    title={redFlags?.title || "Red Flags"}
                                    Icon={Ban}
                                    amountKey="red_flags"
                                    amountValue={redFlags?.value}
                                    countLabel={null}
                                    countValue={null}
                                    loading={kpiLoading}
                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Snapshot */}
                <div className="lg:col-span-6">
                    <div className="bg-gradient-to-br from-rose-950 to-rose-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FileText size={20} className="text-white" />
                                    {orderSection?.title || "Orders Snapshot"}
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white" />
                                </div>
                            </div>

                            {/* Top summary */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">
                                            Total Orders
                                        </p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: "orders",
                                                value: ordOrders?.value,
                                                formatRoundedAmountWithCommas,
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* 4 cards */}
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
