import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";

import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import ClassonlineFiscal from "@modules/DailyReport/components/comparativeSalesReport/ClassonlineFiscal.jsx";
import ClassOfflineOnlineFiscal
    from "@modules/DailyReport/components/comparativeSalesReport/ClassOfflineOnlineFiscal.jsx";

const DailySaleReportList = () => {
    const [activeTab, setActiveTab] = useState("DailySaleReportList");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    const getTodayDate = () => new Date().toISOString().slice(0, 10);

    const getCurrentPeriodStartDate = () => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().slice(0, 10);
    };

    const getComparativePeriodStartDate = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(1);
        return date.toISOString().slice(0, 10);
    };

    const getCurrentPeriodEndDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.toISOString().slice(0, 10);
    };

    const getComparativePeriodEndDate = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "current_date_from", defaultValue: getCurrentPeriodStartDate() },
                    { name: "current_date_to", defaultValue: getCurrentPeriodEndDate() },
                    { name: "comparative_date_from", defaultValue: getComparativePeriodStartDate() },
                    { name: "comparative_date_to", defaultValue: getComparativePeriodEndDate() },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = async (formData) => {
        setLoading(true);
        setTimeout(() => {
            setFilters(formData);
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <PageHeader currentpage="Daily Sales Report" />

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <nav className="flex space-x-4">
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "DailySaleReportList" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("DailySaleReportList")}
                            >
                                A Class (Offline) & Online - Fiscal
                            </Link>
                        </nav>

                        <button
                            type="button"
                            className="ti-btn bg-primary border mb-2 text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                <div className="mt-0">
                                    <FormInput
                                        type="date"
                                        name="current_date_from"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.current_date_from}
                                        label={"Current Period From"}
                                    />
                                </div>
                                <div className="mt-0">
                                    <FormInput
                                        type="date"
                                        name="current_date_to"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.current_date_to}
                                        label={"Current Period To"}
                                    />
                                </div>
                                <div className="mt-0">
                                    <FormInput
                                        type="date"
                                        name="comparative_date_from"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.comparative_date_from}
                                        label={"Comparative Period From"}
                                    />
                                </div>
                                <div className="mt-0">
                                    <FormInput
                                        type="date"
                                        name="comparative_date_to"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.comparative_date_to}
                                        label={"Comparative Period To"}
                                    />
                                </div>
                                <div className="mt-6">
                                    <FilterButton />
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === "DailySaleReportList" && (
                        <ClassonlineFiscal/>
                    )}
                    {activeTab === "DailySaleReportList" && (
                      <ClassOfflineOnlineFiscal/>
                    )}



                </div>
            </div>
        </>
    );
};

export default DailySaleReportList;
