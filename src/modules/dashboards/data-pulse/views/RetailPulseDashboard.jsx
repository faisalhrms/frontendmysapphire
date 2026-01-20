// src/modules/dashboards/data-pulse/pages/RetailPulseDashboard.jsx
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

import { Activity, Receipt, BadgePercent, IdCard } from "lucide-react";

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
};

const RetailPulseDashboard = () => {
    const [activeTab, setActiveTab] = useState("credit_memo");

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    // Retail service defaults to yesterday / last-5-days, but we keep UI consistent
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
                description="Monitor retail credit memos, discount usage, and employee card returns"
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
                                className={
                                    activeTab === "credit_memo" ? "text-sky-600" : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <CreditMemoReport
                                filters={filters}
                                isActive={activeTab === "credit_memo"}
                            />
                        ),
                    },
                    {
                        id: "top_discount_coupons",
                        label: "Top Discount Coupons",
                        icon: (
                            <BadgePercent
                                size={18}
                                className={
                                    activeTab === "top_discount_coupons"
                                        ? "text-indigo-600"
                                        : "text-slate-500"
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
                                    activeTab === "top_employee_card"
                                        ? "text-emerald-600"
                                        : "text-slate-500"
                                }
                            />
                        ),
                        content: (
                            <TopEmployeeCardReport
                                filters={filters}
                                isActive={activeTab === "top_employee_card"}
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
