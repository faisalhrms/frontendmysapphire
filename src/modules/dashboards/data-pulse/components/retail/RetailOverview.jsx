import React, { useMemo } from "react";
import {
    TrendingUp,
    RotateCcw,
    Receipt,
    BadgePercent,
    IdCard,
    ShieldAlert,
    Ban,
} from "lucide-react";

import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import RetailSalesSnapshot from "@modules/dashboards/data-pulse/components/retail/RetailSalesSnapshot.jsx";
import RetailExchangesSnapshot from "@modules/dashboards/data-pulse/components/retail/RetailExchangesSnapshot.jsx";
import RetailReturnsSnapshot from "@modules/dashboards/data-pulse/components/retail/RetailReturnsSnapshot.jsx";
import RetailSalesReturnRatioSnapshot from "@modules/dashboards/data-pulse/components/retail/RetailSalesReturnRatioSnapshot.jsx";

import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";

const pickData = (res) => {
    if (!res) return undefined;
    if (Object.prototype.hasOwnProperty.call(res, "data")) return res.data;
    return res?.items?.[0]?.data;
};

const useRetailKey = (key, filters, enabled) => {
    const params = useMemo(() => ({ ...(filters || {}), key }), [filters, key]);
    return useFetchWithFilters("/dashboard/data-pulse/retail/kpis/", params, {
        enabled,
    });
};



const RetailOverview = ({ activeTab, filters }) => {
    const enabled = activeTab === "overview";

    // -----------------------
    // KPI calls (ONE BY ONE)
    // -----------------------
    const { data: saleRes, isLoading: saleLoading } = useRetailKey(
        "sales_net_amount_total",
        filters,
        enabled
    );

    const { data: retRes, isLoading: retLoading } = useRetailKey(
        "return_net_amount_total",
        filters,
        enabled
    );

    const { data: creditRes, isLoading: creditLoading } = useRetailKey(
        "credit_memo_total",
        filters,
        enabled
    );

    // ✅ NEW: Credit Memo Redemption (Applied)
    const { data: creditRedeemRes, isLoading: creditRedeemLoading } = useRetailKey(
        "credit_memo_redemption_total",
        filters,
        enabled
    );

    const { data: discRes, isLoading: discLoading } = useRetailKey(
        "discount_coupon_total",
        filters,
        enabled
    );

    const { data: empRes, isLoading: empLoading } = useRetailKey(
        "employee_card_total",
        filters,
        enabled
    );

    const { data: empDRes, isLoading: empDLoading } = useRetailKey(
        "employee_discounted_total",
        filters,
        enabled
    );

    const { data: suspRes, isLoading: suspLoading } = useRetailKey(
        "suspended_txn_count",
        filters,
        enabled
    );

    const { data: lateRes, isLoading: lateLoading } = useRetailKey(
        "after_close_txn_count",
        filters,
        enabled
    );

    const { data: voidRes, isLoading: voidLoading } = useRetailKey(
        "void_txn_count",
        filters,
        enabled
    );

    const { data: openRes, isLoading: openLoading } = useRetailKey(
        "open_shifts",
        filters,
        enabled
    );

    // -----------------------
    // Snapshot calls (ONE BY ONE)
    // -----------------------
    const { data: tenderRes, isLoading: tenderLoading } = useRetailKey(
        "tender_sales",
        filters,
        enabled
    );

    const { data: exchRes, isLoading: exchLoading } = useRetailKey(
        "exchanges_overall",
        filters,
        enabled
    );

    const { data: ratioRes, isLoading: ratioLoading } = useRetailKey(
        "sale_return_ratio",
        filters,
        enabled
    );

    const { data: returnsTotalsRes, isLoading: returnsTotalsLoading } = useRetailKey(
        "returns_totals",
        filters,
        enabled
    );

    const { data: returnsWithWithoutRes, isLoading: returnsWithWithoutLoading } =
        useRetailKey("returns_with_without", filters, enabled);

    const { data: returnsMismatchRes, isLoading: returnsMismatchLoading } =
        useRetailKey("returns_payment_method_mismatch", filters, enabled);

    const { data: lateReturnsRes, isLoading: lateReturnsLoading } = useRetailKey(
        "late_returns",
        filters,
        enabled
    );

    // -----------------------
    // Values
    // -----------------------
    const salesNet = Number(pickData(saleRes) || 0);
    const returnsNet = Number(pickData(retRes) || 0);
    const creditMemo = Number(pickData(creditRes) || 0);

    // ✅ NEW
    const creditRedeemed = Number(pickData(creditRedeemRes) || 0);

    const discounts = Number(pickData(discRes) || 0);
    const employee = Number(pickData(empRes) || 0);
    const employeeD = Number(pickData(empDRes) || 0);
    const suspended = Number(pickData(suspRes) || 0);
    const lateTxn = Number(pickData(lateRes) || 0);
    const voidCount = Number(pickData(voidRes) || 0);
    const openCount = Number(pickData(openRes) || 0);

    const salesSummary = pickData(tenderRes) || { tender_sales_by_name: [], total_sale: 0 };
    const exchangesSummary =
        pickData(exchRes) || { txn_count: 0, sale_qty: 0, return_qty: 0, with_ref: 0, without_ref: 0 };
    const ratioSummary =
        pickData(ratioRes) || { sales_amount: 0, return_amount: 0, sales_ratio: 0, return_ratio: 0 };

    const returnsSummary = useMemo(() => {
        const totals = pickData(returnsTotalsRes) || { return_qty_total: 0, return_amount_incl_tax_total: 0 };
        const withWithout = pickData(returnsWithWithoutRes) || { return_qty_with_receipt: 0, return_qty_without_receipt: 0 };
        const mismatch = pickData(returnsMismatchRes) || [];
        const late = pickData(lateReturnsRes) || { txn_count: 0, qty_total: 0, amount_incl_tax_total: 0 };

        return {
            ...totals,
            ...withWithout,
            payment_method_mismatch: mismatch,
            late_returns: late,
        };
    }, [returnsTotalsRes, returnsWithWithoutRes, returnsMismatchRes, lateReturnsRes]);

    const kpiLoadingAny =
        saleLoading ||
        retLoading ||
        creditLoading ||
        creditRedeemLoading || // ✅ NEW
        discLoading ||
        empLoading ||
        suspLoading ||
        lateLoading ||
        voidLoading;

    const snapshotsLoadingAny =
        tenderLoading ||
        exchLoading ||
        ratioLoading ||
        returnsTotalsLoading ||
        returnsWithWithoutLoading ||
        returnsMismatchLoading ||
        lateReturnsLoading;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                <StatCard
                    icon={TrendingUp}
                    title="Net Sale"
                    value={saleLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(salesNet)}`}
                    subtitle="Total net sales inclusive tax"
                    isLoading={saleLoading}
                    variant="blackIndigo"
                />
                <StatCard
                    icon={RotateCcw}
                    title="Return + Exchange Value"
                    value={retLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(returnsNet)}`}
                    subtitle="Total returns + exchange inclusive tax"
                    isLoading={retLoading}
                    variant="redOrange"
                />
                <StatCard
                    icon={BadgePercent}
                    title="Discounts"
                    value={discLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(discounts)}`}
                    subtitle="Coupons applied amount"
                    isLoading={discLoading}
                    variant="blackRed"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={ShieldAlert}
                    title="Suspended Transactions"
                    value={suspLoading ? "..." : formatRoundedAmountWithCommas(suspended)}
                    isLoading={suspLoading}
                />
                <StatCard
                    icon={ShieldAlert}
                    title="Late Transactions"
                    value={lateLoading ? "..." : formatRoundedAmountWithCommas(lateTxn)}
                    subtitle="After closing"
                    isLoading={lateLoading}
                />
                <StatCard
                    icon={Ban}
                    title="Void Transactions"
                    value={voidLoading ? "..." : formatRoundedAmountWithCommas(voidCount)}
                    subtitle="Voids"
                    isLoading={voidLoading}
                />
                <StatCard
                    icon={Ban}
                    title="Open POS"
                    value={voidLoading ? "..." : formatRoundedAmountWithCommas(openCount)}
                    subtitle="Open POS machines after closing"
                    isLoading={openLoading}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Receipt}
                    title="Credit Issued"
                    value={creditLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(creditMemo)}`}
                    subtitle="Credit memo issued amount"
                    isLoading={creditLoading}
                />
                <StatCard
                    icon={Receipt}
                    title="Credit Redeemed"
                    value={creditRedeemLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(creditRedeemed)}`}
                    subtitle="Credit memo applied amount"
                    isLoading={creditRedeemLoading}
                />
                <StatCard
                    icon={IdCard}
                    title="Employee Card"
                    value={empLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(employee)}`}
                    subtitle="Employee spend amount"
                    isLoading={empLoading}
                />
                <StatCard
                    icon={IdCard}
                    title="Employee Card Discout Amount"
                    value={empLoading ? "..." : `PKR ${formatRoundedAmountWithCommas(employeeD)}`}
                    subtitle="Employee effective amount"
                    isLoading={empDLoading}
                />
            </div>


            {/* Snapshots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <RetailSalesSnapshot
                    sales={salesSummary}
                    loading={tenderLoading}
                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                />

                <RetailExchangesSnapshot
                    exchanges={exchangesSummary}
                    loading={exchLoading}
                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                />

                <RetailSalesReturnRatioSnapshot
                    ratio={ratioSummary}
                    loading={ratioLoading}
                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                />

                <RetailReturnsSnapshot
                    returns={returnsSummary}
                    loading={{
                        totals: returnsTotalsLoading,
                        split: returnsWithWithoutLoading,
                        mismatch: returnsMismatchLoading,
                        late: lateReturnsLoading,
                    }}
                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                />
            </div>
        </div>
    );
};

export default RetailOverview;
