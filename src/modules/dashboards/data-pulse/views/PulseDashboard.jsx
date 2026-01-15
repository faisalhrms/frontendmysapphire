import React, { useCallback, useMemo, useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import TopOrderAmountsReport from "@modules/dashboards/data-pulse/components/TopOrderAmountsReport.jsx";
import TopCouponsReport from "@modules/dashboards/data-pulse/components/TopCouponsReport.jsx";
import StoreCreditReport from "@modules/dashboards/data-pulse/components/StoreCreditReport.jsx";
import CodAmountIssuesReport from "@modules/dashboards/data-pulse/components/CodAmountIssuesReport.jsx";
import AccountsMissingEmailReport from "@modules/dashboards/data-pulse/components/AccountsMissingEmailReport.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

import {
    Activity,
    BadgePercent,
    Wallet,
    AlertTriangle,
    UserX,
    TrendingUp,
} from "lucide-react";

const TAB_META = {
    top_order_amounts: {
        headerIcon: TrendingUp,
        headerColorClass: "text-emerald-600",
        tabIcon: TrendingUp,
        tabColorClass: "text-emerald-600",
    },
    top_coupons: {
        headerIcon: BadgePercent,
        headerColorClass: "text-indigo-600",
        tabIcon: BadgePercent,
        tabColorClass: "text-indigo-600",
    },
    store_credit: {
        headerIcon: Wallet,
        headerColorClass: "text-sky-600",
        tabIcon: Wallet,
        tabColorClass: "text-sky-600",
    },
    cod_amount_issues: {
        headerIcon: AlertTriangle,
        headerColorClass: "text-amber-600",
        tabIcon: AlertTriangle,
        tabColorClass: "text-amber-600",
    },
    accounts_missing_email: {
        headerIcon: UserX,
        headerColorClass: "text-rose-600",
        tabIcon: UserX,
        tabColorClass: "text-rose-600",
    },
};

const PulseDashboard = () => {
    const [activeTab, setActiveTab] = useState("top_order_amounts");

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

    // Header icon/color changes by active tab
    const activeHeader = TAB_META[activeTab] || {
        headerIcon: Activity,
        headerColorClass: "text-slate-600",
    };

    return (
        <>
            <IconPageHeader
                heading="Ecom Data Pulse"
                description="Monitor your website performance and user behavior"
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
                        id: "top_order_amounts",
                        label: "Top Order Amounts",
                        icon: (
                            <TrendingUp
                                size={18}
                                className={
                                    activeTab === "top_order_amounts"
                                        ? "text-emerald-600"
                                        : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TopOrderAmountsReport
                                filters={filters}
                                isActive={activeTab === "top_order_amounts"}
                            />
                        ),
                    },
                    {
                        id: "top_coupons",
                        label: "Top Coupons",
                        icon: (
                            <BadgePercent
                                size={18}
                                className={
                                    activeTab === "top_coupons" ? "text-indigo-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TopCouponsReport
                                filters={filters}
                                isActive={activeTab === "top_coupons"}
                            />
                        ),
                    },
                    {
                        id: "store_credit",
                        label: "Store Credit",
                        icon: (
                            <Wallet
                                size={18}
                                className={
                                    activeTab === "store_credit" ? "text-sky-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <StoreCreditReport
                                filters={filters}
                                isActive={activeTab === "store_credit"}
                            />
                        ),
                    },
                    {
                        id: "cod_amount_issues",
                        label: "COD Amount Issues",
                        icon: (
                            <AlertTriangle
                                size={18}
                                className={
                                    activeTab === "cod_amount_issues"
                                        ? "text-amber-600"
                                        : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <CodAmountIssuesReport
                                filters={filters}
                                isActive={activeTab === "cod_amount_issues"}
                            />
                        ),
                    },
                    {
                        id: "accounts_missing_email",
                        label: "Accounts Missing Email",
                        icon: (
                            <UserX
                                size={18}
                                className={
                                    activeTab === "accounts_missing_email"
                                        ? "text-rose-600"
                                        : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <AccountsMissingEmailReport
                                filters={filters}
                                isActive={activeTab === "accounts_missing_email"}
                            />
                        ),
                    },
                ]}
                onTabChange={setActiveTab}
            />
        </>
    );
};

export default PulseDashboard;
