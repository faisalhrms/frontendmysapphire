import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { Activity, Users, PieChart, ArrowUpRight, Info } from "lucide-react";

import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import EcomHabitualRatioGradientCards from "@modules/dashboards/data-pulse/components/ecom/EcomHabitualRatioGradientCards.jsx";
import TopHabitualReturns from "@modules/dashboards/data-pulse/components/ecom/TopHabitualReturns.jsx";
import { createPortal } from "react-dom";

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[220px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Activity size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

const toLabel = (x) => (x ?? "").toString().replace(/_/g, " ").trim();

const PKR_KEYS = new Set([
    "avg_order_price",
    "coupon_amount",
    "store_credit",
    "employee_discount",
    "payment_gateway_total",
    "return_amount",
    "total_order_amount",
]);

const PCT_KEYS = new Set(["return_percent", "percent", "share"]);

const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function toNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function fmtValue({ key, value, formatAmount }) {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;

    const n = toNum(value);
    const fmt = typeof formatAmount === "function" ? formatAmount : (x) => NF0.format(x);

    if (PCT_KEYS.has(key)) return `${n.toFixed(2)}%`;
    if (PKR_KEYS.has(key)) return `PKR ${fmt(n)}`;
    return fmt(n);
}

function itemsToMap(itemsArr) {
    const m = {};
    (Array.isArray(itemsArr) ? itemsArr : []).forEach((c) => {
        if (c?.key) m[c.key] = c;
    });
    return m;
}

function unwrap(resp) {
    if (!resp) return {};
    if (resp?.rows || resp?.summary || resp?.data?.rows || resp?.data?.summary) return resp?.data ?? resp;
    if (resp?.data?.data) return resp.data.data;
    return resp;
}

const GRADIENTS = {
    customers: "bg-gradient-to-br from-sky-950 to-sky-600",
    segmentation: "bg-gradient-to-br from-amber-950 to-amber-600",
};

function gridColsClass(n) {
    if (n <= 1) return "md:grid-cols-1";
    if (n === 2) return "md:grid-cols-2";
    if (n === 3) return "md:grid-cols-3";
    return "md:grid-cols-4";
}

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

/** ✅ Only these 3 info texts for now */
const INFO_TEXT = {
    loyal: "Criteria: 3 or more orders in past 6 months.",
    churned: "Criteria: No order in past 6 months.",
    habitual_returns: "Criteria: More than 5 orders placed and return ratio above 50%.",
    high_returners: "Criteria: More than 5 orders placed and return ratio above 50%.",
};

function normalizeKeyLike(x) {
    return String(x || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
}

function getInfoText({ key, title }) {
    const k1 = normalizeKeyLike(key);
    const k2 = normalizeKeyLike(title);

    if (INFO_TEXT[k1]) return INFO_TEXT[k1];
    if (INFO_TEXT[k2]) return INFO_TEXT[k2];

    if (k1.includes("habitual") || k2.includes("habitual")) return INFO_TEXT.habitual_returns;
    if (k1.includes("high_return") || k2.includes("high_return")) return INFO_TEXT.high_returners;

    return null;
}

function PromoMiniCard({
                           title,
                           Icon,
                           valueKey,
                           value,
                           subLabel,
                           subValue,
                           loading,
                           formatAmount,
                           infoText,
                       }) {
    return (
        <div className="relative z-0 hover:z-50 bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {Icon ? <Icon size={18} className="text-white" /> : null}
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
                            {fmtValue({ key: valueKey, value, formatAmount })}
                        </p>

                        <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">
                            {subLabel && subValue !== null && subValue !== undefined
                                ? `${subLabel}: ${String(subValue)}`
                                : "\u00A0"}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

const EcomCustomersTab = ({ enabled, filters, cache, formatAmount }) => {
    // ✅ country only (no dates)
    const country = useMemo(() => String(filters?.country || "PK").toUpperCase(), [filters?.country]);
    const customerFilters = useMemo(() => ({ country }), [country]);

    // ✅ KPI call (NO date filters)
    const {
        data: kpiRespRaw,
        isLoading: kpiLoading,
        refetch: refetchKpi,
    } = useFetchWithFilters("/dashboard/data-pulse/ecom/kpis/", customerFilters, {
        enabled: !!enabled,
        ...(cache || {}),
    });

    // Segmentation summary (no date)
    const {
        data: segmentationResRaw,
        isLoading: segmentationLoading,
        refetch: refetchSeg,
    } = useFetchWithFilters("/dashboard/data-pulse/ecom/customers/segmentation/summary/", customerFilters, {
        enabled: !!enabled,
        ...(cache || {}),
    });

    // Habitual endpoints (no date)
    const {
        data: habitualSummaryResRaw,
        isLoading: habitualSummaryLoading,
        refetch: refetchHabitualSummary,
    } = useFetchWithFilters("/dashboard/data-pulse/ecom/customers/habitual/summary/", customerFilters, {
        enabled: !!enabled,
        ...(cache || {}),
    });

    const {
        data: habitualTopResRaw,
        isLoading: habitualTopLoading,
        refetch: refetchHabitualTop,
    } = useFetchWithFilters("/dashboard/data-pulse/ecom/customers/habitual/top/", customerFilters, {
        enabled: !!enabled,
        ...(cache || {}),
    });

    // ✅ Make sure data always updates when country changes (even with long staleTime)
    useEffect(() => {
        if (!enabled) return;
        refetchKpi?.();
        refetchSeg?.();
        refetchHabitualSummary?.();
        refetchHabitualTop?.();
    }, [enabled, country, refetchKpi, refetchSeg, refetchHabitualSummary, refetchHabitualTop]);

    const kpiResp = useMemo(() => unwrap(kpiRespRaw), [kpiRespRaw]);
    const segmentationRes = useMemo(() => unwrap(segmentationResRaw), [segmentationResRaw]);
    const habitualSummaryRes = useMemo(() => unwrap(habitualSummaryResRaw), [habitualSummaryResRaw]);
    const habitualTopRes = useMemo(() => unwrap(habitualTopResRaw), [habitualTopResRaw]);

    // ---- Customers Snapshot (from KPI sections) ----
    const customerSnapshot = useMemo(() => {
        const sections = kpiResp?.data?.sections ?? kpiResp?.sections ?? [];
        const sec =
            (Array.isArray(sections) && sections.find((s) => s?.key === "customers_section")) ||
            (Array.isArray(sections) &&
                sections.find((s) => {
                    const hay = `${s?.key || ""} ${s?.title || ""}`.toLowerCase();
                    return hay.includes("customer");
                })) ||
            null;

        const items = Array.isArray(sec?.items) ? sec.items : [];
        let title = (sec?.title || "Customers").trim();
        if (!title) title = "Customers";

        return { title, items };
    }, [kpiResp]);

    const customerItems = customerSnapshot.items || [];
    const customerMap = useMemo(() => itemsToMap(customerItems), [customerItems]);
    const topCustomerItem = customerMap.total_customers || customerMap.customers || customerItems[0] || null;

    const miniCustomerItems = useMemo(() => {
        const topKey = topCustomerItem?.key;
        return (Array.isArray(customerItems) ? customerItems : [])
            .filter((x) => x?.key && x.key !== topKey)
            .slice(0, 3);
    }, [customerItems, topCustomerItem]);

    // ---- Segmentation ----
    const segmentationRows = useMemo(() => {
        const rows = segmentationRes?.rows ?? segmentationRes?.data?.rows;
        return Array.isArray(rows) ? rows : [];
    }, [segmentationRes]);

    const segmentationTotal = useMemo(
        () => segmentationRows.reduce((a, r) => a + (Number(r?.customer_count) || 0), 0),
        [segmentationRows]
    );

    const segmentationMini = useMemo(() => {
        const safe = Array.isArray(segmentationRows) ? segmentationRows : [];
        return safe
            .slice()
            .sort((a, b) => toNum(b?.customer_count) - toNum(a?.customer_count))
            .slice(0, 4)
            .map((r) => {
                const name = r?.customer_type || "Unknown";
                const cnt = toNum(r?.customer_count);
                const share = segmentationTotal > 0 ? (cnt / segmentationTotal) * 100 : 0;
                return {
                    key: name,
                    title: name,
                    value: cnt,
                    subLabel: "Share",
                    subValue: `${share.toFixed(2)}%`,
                };
            });
    }, [segmentationRows, segmentationTotal]);

    const ratioBuckets = habitualSummaryRes?.ratio_buckets || habitualSummaryRes?.data?.ratio_buckets || [];
    const topHabitualRows = habitualTopRes?.rows || habitualTopRes?.data?.rows || [];

    const mergedCount =
        (kpiLoading ? 3 : miniCustomerItems.length) + (segmentationLoading ? 4 : segmentationMini.length);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
            <div className="p-6 space-y-6">
                {/* ✅ Row 1: ONE card (Customers Snapshot + Segmentation mini cards merged) */}
                <div className="grid grid-cols-1 gap-6">
                    <div className={`${GRADIENTS.customers} rounded-xl shadow-lg p-6 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Users size={20} className="text-white" />
                                    {customerSnapshot.title || "Customers Snapshot"}
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <ArrowUpRight size={22} className="text-white" />
                                </div>
                            </div>

                            {/* Top metric */}
                            <div className="mb-4">
                                {kpiLoading ? (
                                    <div className="mt-2">
                                        <PulseScan />
                                    </div>
                                ) : !topCustomerItem ? (
                                    <div className="text-white/70 text-sm italic">No snapshot data</div>
                                ) : (
                                    <>
                                        <p className="text-xs text-white/70 mt-1 tabular-nums">
                                            {topCustomerItem?.title || topCustomerItem?.label || toLabel(topCustomerItem?.key)}
                                        </p>
                                        <p className="text-4xl font-bold text-white tabular-nums">
                                            {fmtValue({
                                                key: topCustomerItem?.key || "value",
                                                value: topCustomerItem?.value,
                                                formatAmount,
                                            })}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* ✅ Merged mini cards */}
                            <div className={`grid grid-cols-1 ${gridColsClass(mergedCount)} gap-4 items-stretch`}>
                                {/* Snapshot minis */}
                                {(kpiLoading ? [1, 2, 3] : miniCustomerItems).map((it, idx) => {
                                    if (kpiLoading) {
                                        return (
                                            <div
                                                key={`cust-skel-${idx}`}
                                                className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full"
                                            >
                                                <div className="mt-2">
                                                    <PulseScan />
                                                </div>
                                            </div>
                                        );
                                    }

                                    const title = it?.title || it?.label || toLabel(it?.key) || `Item ${idx + 1}`;
                                    const infoText = getInfoText({ key: it?.key, title });

                                    return (
                                        <PromoMiniCard
                                            key={it?.key || idx}
                                            title={title}
                                            Icon={Users}
                                            valueKey={it?.key || "value"}
                                            value={it?.value}
                                            subLabel={null}
                                            subValue={null}
                                            loading={kpiLoading}
                                            formatAmount={formatAmount}
                                            infoText={infoText} // ✅ Habitual Returns / High Returners will show when matched
                                        />
                                    );
                                })}

                                {/* Segmentation minis */}
                                {(segmentationLoading ? [1, 2, 3, 4] : segmentationMini).map((r, idx) => {
                                    if (segmentationLoading) {
                                        return (
                                            <div
                                                key={`seg-skel-${idx}`}
                                                className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full"
                                            >
                                                <div className="mt-2">
                                                    <PulseScan />
                                                </div>
                                            </div>
                                        );
                                    }

                                    const infoText = getInfoText({ key: r?.key, title: r?.title }); // ✅ Loyal + Churned

                                    return (
                                        <PromoMiniCard
                                            key={r.key}
                                            title={r.title}
                                            Icon={PieChart}
                                            valueKey="customer_count"
                                            value={r.value}
                                            subLabel={r.subLabel}
                                            subValue={r.subValue}
                                            loading={segmentationLoading}
                                            formatAmount={formatAmount}
                                            infoText={infoText}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---- Ratio component (as-is) ---- */}
                <EcomHabitualRatioGradientCards buckets={ratioBuckets} loading={habitualSummaryLoading} formatAmount={formatAmount} />

                {/* ---- Top habitual returns (as-is) ---- */}
                {!topHabitualRows?.length && !habitualTopLoading ? (
                    <EmptyState />
                ) : (
                    <TopHabitualReturns rows={topHabitualRows} meta={habitualTopRes?.meta} loading={habitualTopLoading} />
                )}
            </div>
        </div>
    );
};

export default EcomCustomersTab;
