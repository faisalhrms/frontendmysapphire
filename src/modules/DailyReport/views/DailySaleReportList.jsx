import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../layouts/includes/PageHeader.jsx";

import useFilters from "@hooks/useFilters.js";

import StoreWise from "../components/DailySalesReport/WiseSide.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import DailyTargetAchievementOnline from "@modules/DailyReport/components/DailySalesReport/DailyTargetAchievementOnline.jsx";
import OnlineGrossSaleBeforeReturn from "@modules/DailyReport/components/DailySalesReport/ OnlineGrossSaleBeforeReturn.jsx";
import CYVsLYGrowth from "@modules/DailyReport/components/DailySalesReport/CYVsLYGrowth.jsx";
import DailySalesReportStoreWise from "@modules/DailyReport/components/DailySalesReport/DailySalesReportStoreWise.jsx";

const DailySaleReportList = () => {
    const [activeTab, setActiveTab] = useState("DailySaleReportList");  // Initial active tab
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get today's date and subtract one day to set default filters
    const getTodayDate = () => new Date().toISOString().slice(0, 10);
    const getYesterdayDate = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "date_from", defaultValue: getYesterdayDate() }, // Set to yesterday's date
                    { name: "date_to", defaultValue: getTodayDate() }, // Set to today's date
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
                                Store Wise
                            </Link>
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "OnlineAndBM" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("OnlineAndBM")}
                            >
                                Daily Target Achievement
                            </Link>
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "Return" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("Return")}
                            >
                                CY Vs LY Growth
                            </Link>
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "GrossReturn" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("GrossReturn")}
                            >
                                Online (Gross Sale before Return)
                            </Link>

                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "DailySales" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("DailySales")}
                            >
                                Daily Sales Report - Store Wis
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
                                        name="date_from"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.date_from}
                                        label={true}
                                    />
                                </div>
                                <div className="mt-6">
                                    <FilterButton />
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === "DailySaleReportList" && (
                        <StoreWise filters={filters} loading={loading} />
                    )}

                    {activeTab === "OnlineAndBM" && (
                        <DailyTargetAchievementOnline filters={filters} loading={loading} />
                    )}
                    {activeTab === "Return" && (
                        <CYVsLYGrowth filters={filters} loading={loading} />
                    )}
                    {activeTab === "GrossReturn" && (
                        <OnlineGrossSaleBeforeReturn filters={filters} loading={loading} />
                    )}

                    {activeTab === "DailySales" && (
                        <DailySalesReportStoreWise filters={filters} loading={loading} />
                    )}
                </div>
            </div>
        </>
    );
};

export default DailySaleReportList;
