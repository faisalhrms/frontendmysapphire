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
    ArrowUp,
    ArrowDown,
} from "lucide-react";

import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";

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

function getDeltaPct(card) {
    const v = card?.delta_percent;
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function getDelta(card) {
    const v = card?.delta;
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function dirNum(card) {
    const dp = getDeltaPct(card);
    if (dp !== null) return dp;
    return getDelta(card);
}

function iconClass(n) {
    if (n === null) return "text-white";
    if (n > 0) return "text-success";
    if (n < 0) return "text-danger";
    return "text-white";
}

function fmtDeltaAbs({ key, delta, formatRoundedAmountWithCommas }) {
    if (delta === null || delta === undefined) return null;
    const n = Number(delta);
    if (!Number.isFinite(n) || n === 0) return null;

    const abs = Math.abs(n);
    if (PKR_KEYS.has(key)) return `PKR ${formatRoundedAmountWithCommas(abs)}`;
    return formatRoundedAmountWithCommas(abs);
}

function fmtDeltaPctText(deltaPct) {
    if (deltaPct === null || deltaPct === undefined) return null;
    const n = Number(deltaPct);
    if (!Number.isFinite(n) || n === 0) return null;
    return `${Math.abs(n).toFixed(2)}%`;
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

/** ✅ Pulse skeleton line */
function PulseLine({ w = "w-full", h = "h-4", rounded = "rounded-md", className = "" }) {
    return <div className={`${w} ${h} ${rounded} bg-white/15 animate-pulse ${className}`} />;
}

/** ✅ Pulse skeleton row that mimics the list item card */
function PulseRow() {
    return (
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                    <PulseLine w="w-2/3" h="h-4" />
                    <PulseLine w="w-1/2" h="h-3" className="opacity-70" />
                </div>
                <div className="text-right space-y-2">
                    <PulseLine w="w-24" h="h-4" />
                    <PulseLine w="w-16" h="h-3" className="opacity-70" />
                </div>
            </div>
        </div>
    );
}

/** Arrow badge for delta / delta% */
function DeltaBadge({ directionNumber, text }) {
    if (!text) return null;

    const n = Number(directionNumber);
    const isPos = Number.isFinite(n) && n > 0;
    const isNeg = Number.isFinite(n) && n < 0;

    const Arrow = isPos ? ArrowUp : isNeg ? ArrowDown : null;
    const cls = isPos ? "text-success" : isNeg ? "text-danger" : "text-white/70";

    return (
        <div className={`inline-flex items-center gap-1 text-xs tabular-nums ${cls}`}>
            {Arrow ? <Arrow size={14} /> : null}
            <span>{text}</span>
        </div>
    );
}

/** Generic gradient list card (with pulse loading) */
function GradientListCard({
                              colSpanClass,
                              gradientClass,
                              title,
                              Icon,
                              iconDirection,
                              topLabel,
                              topValue,
                              topSub,
                              rows,
                              loading,
                              maxListHeight = 160,
                              skeletonRows = 3,
                              footerNote,
                          }) {
    return (
        <div className={`${colSpanClass} bg-gradient-to-br ${gradientClass} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Icon size={20} className={iconClass(iconDirection)} />
                        {title}
                    </h3>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <ArrowUpRight size={22} className="text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-white/80">{topLabel}</p>

                        {loading ? (
                            <div className="mt-2">
                                <PulseLine w="w-48" h="h-10" rounded="rounded-lg" />
                                {topSub ? <PulseLine w="w-56" h="h-3" className="mt-2 opacity-70" /> : null}
                            </div>
                        ) : (
                            <>
                                <p className="text-4xl font-bold text-white tabular-nums">{topValue}</p>
                                {topSub ? <p className="text-xs text-white/70 mt-1">{topSub}</p> : null}
                            </>
                        )}
                    </div>

                    <div
                        className="pt-4 border-t border-white/30 space-y-3 overflow-y-auto pr-2"
                    >
                        {loading ? (
                            Array.from({ length: skeletonRows }).map((_, i) => <PulseRow key={i} />)
                        ) : (
                            (rows || []).map((r, idx) => (
                                <div
                                    key={`${r.key || idx}-${idx}`}
                                    className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{r.label}</p>
                                            {r.subLine ? <p className="text-xs text-white/70 truncate">{r.subLine}</p> : null}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white tabular-nums">{r.valueLine}</p>

                                            {(r.deltaAbsText || r.deltaPctText) ? (
                                                <div className="mt-1 flex flex-col gap-0.5 items-end">
                                                    <DeltaBadge directionNumber={r.dir} text={r.deltaAbsText} />
                                                    <DeltaBadge directionNumber={r.dir} text={r.deltaPctText} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {footerNote ? (
                        <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">{footerNote}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

const EcomOverview = ({ kpiResp, kpiLoading, formatRoundedAmountWithCommas }) => {
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
    const storeCreditTx = cards.store_credit_transactions
    const retCount = cards.returns;
    const retAmount = cards.return_amount;
    const retPct = cards.return_percent;

    const cancelOrder = cards.cancel_order_cancel;
    const cancelEdited = cards.cancel_edited_reason;
    const codIssues = cards.cod_issues;
    const missingEmail = cards.missing_email;



    // -------------------------
    // Sales
    // -------------------------
    const salesTopValue = orders
        ? fmtValue({ key: "orders", value: orders.value, formatRoundedAmountWithCommas })
        : "-";

    const salesRows = [orders, aov]
        .filter(Boolean)
        .map((c) => ({
            key: c.key,
            label: c.title || c.key,
            subLine: c.subtitle || "",
            valueLine: fmtValue({ key: c.key, value: c.value, formatRoundedAmountWithCommas }),
            dir: dirNum(c),
            deltaAbsText: fmtDeltaAbs({ key: c.key, delta: c.delta, formatRoundedAmountWithCommas }),
            deltaPctText: fmtDeltaPctText(getDeltaPct(c)),
        }));

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
                subLine: `Share: ${share.toFixed(2)}%`,
                valueLine: `PKR ${formatRoundedAmountWithCommas(amt)}`,
                dir: null,
                deltaAbsText: null,
                deltaPctText: null,
            };
        });

    // -------------------------
    // Promo totals (TOP)
    // Total Promo Impact (PKR) = coupon_amount + store_credit + employee_discount
    // Orders affected (count) = coupons + employee_discount_orders
    // -------------------------
    const promoTotalAmt =
        toNum(couponAmount?.value) + toNum(storeCredit?.value) + toNum(empDisc?.value);

    const promoTotalOrders = toNum(coupons?.value) + toNum(empOrders?.value) + toNum(cards.store_credit_transactions?.value);

    const promoRows = [couponAmount, coupons, storeCredit, storeCreditTx, empDisc, empOrders]
        .filter(Boolean)
        .map((c) => ({
            key: c.key,
            label: c.title || c.key,
            subLine: c.subtitle || "",
            valueLine: fmtValue({ key: c.key, value: c.value, formatRoundedAmountWithCommas }),
            dir: dirNum(c),
            deltaAbsText: fmtDeltaAbs({ key: c.key, delta: c.delta, formatRoundedAmountWithCommas }),
            deltaPctText: fmtDeltaPctText(getDeltaPct(c)),
        }));


    // -------------------------
    // Returns
    // -------------------------
    const returnsHero = retAmount || retCount || retPct;
    const returnsTopValue = returnsHero
        ? fmtValue({ key: returnsHero.key, value: returnsHero.value, formatRoundedAmountWithCommas })
        : "-";

    const returnsRows = [retCount, retAmount, retPct]
        .filter(Boolean)
        .map((c) => ({
            key: c.key,
            label: c.title || c.key,
            subLine: c.subtitle || "",
            valueLine: fmtValue({ key: c.key, value: c.value, formatRoundedAmountWithCommas }),
            dir: dirNum(c),
            deltaAbsText: fmtDeltaAbs({ key: c.key, delta: c.delta, formatRoundedAmountWithCommas }),
            deltaPctText: fmtDeltaPctText(getDeltaPct(c)),
        }));

    return (
        <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <GradientListCard
                    colSpanClass="lg:col-span-6"
                    gradientClass={GRADIENTS.sales}
                    title="Sales Trend"
                    Icon={TrendingUp}
                    iconDirection={dirNum(orders) ?? dirNum(aov)}
                    topLabel="Total Orders"
                    topValue={salesTopValue}
                    topSub="Orders + AOV"
                    rows={salesRows}
                    loading={kpiLoading}
                    maxListHeight={140}
                    skeletonRows={2}
                />

                <GradientListCard
                    colSpanClass="lg:col-span-6"
                    gradientClass={GRADIENTS.payments}
                    title="Payment Breakdown"
                    Icon={Landmark}
                    iconDirection={dirNum(pg)}
                    topLabel="Total Sales"
                    topValue={`PKR ${formatRoundedAmountWithCommas(pgTotal)}`}
                    topSub={`Methods: ${pgRows.length}`}
                    rows={pgRows}
                    loading={kpiLoading}
                    maxListHeight={140}
                    skeletonRows={3}
                />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <GradientListCard
                    colSpanClass="lg:col-span-6"
                    gradientClass={GRADIENTS.promo}
                    title="Discount Snapshot"
                    Icon={BadgePercent}
                    iconDirection={dirNum(empDisc) ?? dirNum(couponAmount) ?? dirNum(storeCredit)}
                    topLabel="Total Amount"
                    topValue={`PKR ${formatRoundedAmountWithCommas(promoTotalAmt)}`}
                    topSub={`Total Orders: ${formatRoundedAmountWithCommas(promoTotalOrders)}`}
                    rows={promoRows}
                    loading={kpiLoading}
                    maxListHeight={220}
                    skeletonRows={5}
                    footerNote="Watch for coupon stacking & high store-credit usage."
                />

                <GradientListCard
                    colSpanClass="lg:col-span-6"
                    gradientClass={GRADIENTS.returns}
                    title="Returns Snapshot"
                    Icon={RotateCcw}
                    iconDirection={dirNum(returnsHero)}
                    topLabel={"Total Amount"}
                    topValue={returnsTopValue}
                    topSub="Count + amount + rate"
                    rows={returnsRows}
                    loading={kpiLoading}
                    maxListHeight={220}
                    skeletonRows={3}
                />
            </div>

            {/* Ops / Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { c: cancelOrder, Icon: Ban },
                    { c: cancelEdited, Icon: PencilLine },
                    { c: codIssues, Icon: AlertTriangle },
                    { c: missingEmail, Icon: UserX },
                ]
                    .filter((x) => x.c)
                    .map(({ c, Icon }) => {
                        const dp = getDeltaPct(c);
                        return (
                            <StatCard
                                key={c.key}
                                icon={Icon}
                                title={c.title || c.key}
                                value={
                                    kpiLoading
                                        ? "..."
                                        : fmtValue({ key: c.key, value: c.value, formatRoundedAmountWithCommas })
                                }
                                isLoading={kpiLoading}
                                loadingType="pulse"
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default memo(EcomOverview);
