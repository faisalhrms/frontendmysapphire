import React, { useCallback, useMemo, useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

import CreditMemoReport from "@modules/dashboards/data-pulse/components/CreditMemoReport.jsx";
import TopDiscountCouponsReport from "@modules/dashboards/data-pulse/components/TopDiscountCouponsReport.jsx";
import TopEmployeeCardReport from "@modules/dashboards/data-pulse/components/TopEmployeeCardReport.jsx";

import ShiftOpenReport from "@modules/dashboards/data-pulse/components/ShiftOpenReport.jsx";
import ReturnQtyReport from "@modules/dashboards/data-pulse/components/ReturnQtyReport.jsx";
import SaleswiseTop10Report from "@modules/dashboards/data-pulse/components/SaleswiseTop10Report.jsx";
import TransactionsAfterClosingTimeReport from "@modules/dashboards/data-pulse/components/TransactionsAfterClosingTimeReport.jsx";
import VoidTransactionsReport from "@modules/dashboards/data-pulse/components/VoidTransactionsReport.jsx";
import SuspendedTransactionsReport from "@modules/dashboards/data-pulse/components/SuspendedTransactionsReport.jsx";

import {
    Activity,
    Receipt,
    BadgePercent,
    IdCard,
    Clock,
    Ban,
    PauseCircle,
    TrendingUp,
    RotateCcw,
    Timer,
} from "lucide-react";

const TAB_META = {
    credit_memo: {
        headerIcon: Receipt,
        headerColorClass: "text-sky-600",
        tabIcon: Receipt,
        tabColorClass: "text-sky-600",
    },
    top_discount_coupons: {
        headerIcon: BadgePercent,
        headerColorClass: "text-indigo-600",
        tabIcon: BadgePercent,
        tabColorClass: "text-indigo-600",
    },
    top_employee_card: {
        headerIcon: IdCard,
        headerColorClass: "text-emerald-600",
        tabIcon: IdCard,
        tabColorClass: "text-emerald-600",
    },

    // new
    shift_open: {
        headerIcon: Clock,
        headerColorClass: "text-amber-600",
        tabIcon: Clock,
        tabColorClass: "text-amber-600",
    },
    return_qty: {
        headerIcon: RotateCcw,
        headerColorClass: "text-rose-600",
        tabIcon: RotateCcw,
        tabColorClass: "text-rose-600",
    },
    saleswise_top_10: {
        headerIcon: TrendingUp,
        headerColorClass: "text-emerald-600",
        tabIcon: TrendingUp,
        tabColorClass: "text-emerald-600",
    },
    transactions_after_closing_time: {
        headerIcon: Timer,
        headerColorClass: "text-fuchsia-600",
        tabIcon: Timer,
        tabColorClass: "text-fuchsia-600",
    },
    void_transactions: {
        headerIcon: Ban,
        headerColorClass: "text-slate-700",
        tabIcon: Ban,
        tabColorClass: "text-slate-700",
    },
    suspended_transactions: {
        headerIcon: PauseCircle,
        headerColorClass: "text-cyan-600",
        tabIcon: PauseCircle,
        tabColorClass: "text-cyan-600",
    },
};

const RetailPulseDashboard = () => {
    const [activeTab, setActiveTab] = useState("credit_memo");

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "date_from", defaultValue: getPastDate(7) },
                    { name: "date_to", defaultValue: getPastDate(1) },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const activeHeader = TAB_META[activeTab] || {
        headerIcon: Activity,
        headerColorClass: "text-slate-600",
    };

    return (
        <>
            <IconPageHeader
                heading="Retail Data Pulse"
                description="Monitor retail KPIs: credit memo, discounts, shifts, returns, sales, late transactions, void & suspended"
                icon={activeHeader.headerIcon}
                iconClassName={activeHeader.headerColorClass}
                headerClasses="font-bold text-[2rem]"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="box custom-box">
                            <div className="box-body p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1">
                                            <FormInput
                                                control={control}
                                                errors={errors}
                                                type="date"
                                                name="date_from"
                                                placeholder="From Date"
                                                label={false}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <FormInput
                                                control={control}
                                                errors={errors}
                                                type="date"
                                                name="date_to"
                                                placeholder="To Date"
                                                label={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 flex-2">
                                        <FilterButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "credit_memo",
                        label: "Credit Memo",
                        icon: (
                            <Receipt
                                size={18}
                                className={activeTab === "credit_memo" ? "text-sky-600" : "text-slate-500"}
                            />
                        ),
                        content: (
                            <CreditMemoReport filters={filters} isActive={activeTab === "credit_memo"} />
                        ),
                    },
                    {
                        id: "top_discount_coupons",
                        label: "Top Discount Coupons",
                        icon: (
                            <BadgePercent
                                size={18}
                                className={
                                    activeTab === "top_discount_coupons" ? "text-indigo-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TopDiscountCouponsReport
                                filters={filters}
                                isActive={activeTab === "top_discount_coupons"}
                            />
                        ),
                    },
                    {
                        id: "top_employee_card",
                        label: "Employee Card",
                        icon: (
                            <IdCard
                                size={18}
                                className={
                                    activeTab === "top_employee_card" ? "text-emerald-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TopEmployeeCardReport filters={filters} isActive={activeTab === "top_employee_card"} />
                        ),
                    },

                    // NEW 6
                    {
                        id: "shift_open",
                        label: "Shift Open",
                        icon: (
                            <Clock
                                size={18}
                                className={activeTab === "shift_open" ? "text-amber-600" : "text-slate-500"}
                            />
                        ),
                        content: <ShiftOpenReport filters={filters} isActive={activeTab === "shift_open"} />,
                    },
                    {
                        id: "return_qty",
                        label: "Return Qty",
                        icon: (
                            <RotateCcw
                                size={18}
                                className={activeTab === "return_qty" ? "text-rose-600" : "text-slate-500"}
                            />
                        ),
                        content: <ReturnQtyReport filters={filters} isActive={activeTab === "return_qty"} />,
                    },
                    {
                        id: "saleswise_top_10",
                        label: "Saleswise Top",
                        icon: (
                            <TrendingUp
                                size={18}
                                className={activeTab === "saleswise_top_10" ? "text-emerald-600" : "text-slate-500"}
                            />
                        ),
                        content: (
                            <SaleswiseTop10Report filters={filters} isActive={activeTab === "saleswise_top_10"} />
                        ),
                    },
                    {
                        id: "transactions_after_closing_time",
                        label: "After Closing",
                        icon: (
                            <Timer
                                size={18}
                                className={
                                    activeTab === "transactions_after_closing_time"
                                        ? "text-fuchsia-600"
                                        : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TransactionsAfterClosingTimeReport
                                filters={filters}
                                isActive={activeTab === "transactions_after_closing_time"}
                            />
                        ),
                    },
                    {
                        id: "void_transactions",
                        label: "Void Txn",
                        icon: (
                            <Ban
                                size={18}
                                className={activeTab === "void_transactions" ? "text-slate-700" : "text-slate-500"}
                            />
                        ),
                        content: <VoidTransactionsReport filters={filters} isActive={activeTab === "void_transactions"} />,
                    },
                    {
                        id: "suspended_transactions",
                        label: "Suspended Txn",
                        icon: (
                            <PauseCircle
                                size={18}
                                className={
                                    activeTab === "suspended_transactions" ? "text-cyan-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <SuspendedTransactionsReport
                                filters={filters}
                                isActive={activeTab === "suspended_transactions"}
                            />
                        ),
                    },
                ]}
                onTabChange={setActiveTab}
            />
        </>
    );
};

export default RetailPulseDashboard;
