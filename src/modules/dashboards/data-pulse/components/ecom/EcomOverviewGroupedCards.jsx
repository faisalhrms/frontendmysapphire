import React, { memo, useMemo } from "react";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import {
    Receipt,
    TrendingUp,
    Wallet,
    BadgePercent,
    AlertTriangle,
    UserX,
    RotateCcw,
    Ban,
    PencilLine,
    Landmark,
    Percent,
} from "lucide-react";

const ICONS = {
    orders: Receipt,
    revenue: TrendingUp,
    gross: TrendingUp,
    store_credit: Wallet,
    coupons: BadgePercent,
    coupon_amount: BadgePercent,

    returns: RotateCcw,
    return_percent: Percent,
    return_amount: RotateCcw, // ✅ if you add it

    employee_discount: BadgePercent,
    employee_discount_orders: BadgePercent,

    payment_gateway_total: Landmark,

    cancel_order_cancel: Ban,
    cancel_edited_reason: PencilLine,

    cod_issues: AlertTriangle,
    missing_email: UserX,
};

const PKR_KEYS = new Set([
    "revenue",
    "gross",
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

function cardMap(cardsArr) {
    const m = {};
    (Array.isArray(cardsArr) ? cardsArr : []).forEach((c) => {
        if (c?.key) m[c.key] = c;
    });
    return m;
}

function fmtValue(key, value, formatRoundedAmountWithCommas) {
    if (value === null || value === undefined) return "-";
    const n = toNum(value);

    if (PCT_KEYS.has(key)) return `${n.toFixed(2)}%`;
    if (PKR_KEYS.has(key)) return `PKR ${formatRoundedAmountWithCommas(n)}`;
    return formatRoundedAmountWithCommas(n);
}

function fmtDelta(key, delta, formatRoundedAmountWithCommas) {
    if (delta === null || delta === undefined) return null;
    const n = toNum(delta);
    const sign = n >= 0 ? "+" : "-";
    const abs = Math.abs(n);

    if (PCT_KEYS.has(key)) return `${sign}${abs.toFixed(2)} pp`; // percentage points
    if (PKR_KEYS.has(key)) return `${sign}PKR ${formatRoundedAmountWithCommas(abs)}`;
    return `${sign}${formatRoundedAmountWithCommas(abs)}`;
}

const Section = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 mb-4">
            {title}
        </h3>
        {children}
    </div>
);

const EcomOverviewGroupedCards = ({
                                      kpiResp,
                                      kpiLoading,
                                      formatRoundedAmountWithCommas,
                                      DateInfo,
                                  }) => {
    const cardsArr = useMemo(() => (Array.isArray(kpiResp?.cards) ? kpiResp.cards : []), [kpiResp]);
    const cards = useMemo(() => cardMap(cardsArr), [cardsArr]);

    const meta = kpiResp?.meta || {};
    const rangeLabel = useMemo(() => {
        const a = meta?.date_from && meta?.date_to ? `${meta.date_from} → ${meta.date_to}` : null;
        const b =
            meta?.compare_date_from && meta?.compare_date_to
                ? `${meta.compare_date_from} → ${meta.compare_date_to}`
                : null;

        if (!a && !b) return null;
        if (a && b) return `Now: ${a} • Prev: ${b}`;
        return a ? `Now: ${a}` : `Prev: ${b}`;
    }, [meta]);

    const renderCard = (key) => {
        const c = cards?.[key];
        if (!c) return null;

        const Icon = ICONS[key] || Receipt;

        const value = kpiLoading
            ? "..."
            : fmtValue(key, c.value, formatRoundedAmountWithCommas);

        const compareValue =
            c.compare_value === null || c.compare_value === undefined
                ? null
                : fmtValue(key, c.compare_value, formatRoundedAmountWithCommas);

        const deltaText = fmtDelta(key, c.delta, formatRoundedAmountWithCommas);

        // % change badge in StatCard (you already have TrendingUp/Down there)
        const changePct =
            c?.delta_percent === null || c?.delta_percent === undefined
                ? undefined
                : Number(c.delta_percent);

        const subtitle = kpiLoading ? (
            "..."
        ) : (
            <div className="space-y-1">
                <div className="opacity-80 text-xs">
                    {c.subtitle || (DateInfo ? <DateInfo /> : null)}
                </div>

                {/* compare + delta line */}
                {compareValue !== null ? (
                    <div className="text-[11px] opacity-70 flex items-center gap-2">
                        <span>Prev: {compareValue}</span>
                        {deltaText ? <span className="opacity-60">•</span> : null}
                        {deltaText ? <span>Δ {deltaText}</span> : null}
                    </div>
                ) : null}

                {/* global range line (optional) */}
                {rangeLabel ? (
                    <div className="text-[10px] opacity-60">{rangeLabel}</div>
                ) : null}
            </div>
        );

        return (
            <StatCard
                key={key}
                icon={Icon}
                title={c.title || key}
                value={value}
                subtitle={subtitle}
                change={kpiLoading ? undefined : changePct}
                isLoading={kpiLoading}
                loadingType="pulse"
            />
        );
    };

    // ✅ Groups (edit order however you want)
    const GROUPS = useMemo(
        () => [
            {
                title: "Sales & Orders",
                keys: ["orders", "revenue", "gross", "payment_gateway_total", "store_credit"],
            },
            {
                title: "Discounts",
                keys: ["coupons", "coupon_amount", "employee_discount", "employee_discount_orders"],
            },
            {
                title: "Returns",
                keys: ["returns", "return_percent", "return_amount"],
            },
            {
                title: "Cancellations",
                keys: ["cancel_order_cancel", "cancel_edited_reason"],
            },
            {
                title: "Risk & Data Quality",
                keys: ["cod_issues", "missing_email"],
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {GROUPS.map((g) => {
                const items = g.keys.map(renderCard).filter(Boolean);
                if (!items.length) return null;

                return (
                    <Section key={g.title} title={g.title}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items}
                        </div>
                    </Section>
                );
            })}
        </div>
    );
};

export default memo(EcomOverviewGroupedCards);
