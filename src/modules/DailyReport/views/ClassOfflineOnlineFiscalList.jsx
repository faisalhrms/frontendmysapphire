import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";

import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import ClassonlineFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassonlineFiscal.jsx";
import ClassOfflineOnlineFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import OnlineSalesGlobal from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSalesGlobal.jsx";
import AClassIslamic from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamic.jsx";

const DailySaleReportList = () => {
    const [activeTab, setActiveTab] = useState("DailySaleReportList");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    const getCurrentDayMinusOne = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "current_day_minus_one", defaultValue: getCurrentDayMinusOne() },
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
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "Online" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("Online")}
                            >
                                Online Sales - Local & Global
                            </Link>
                            <Link
                                to="#"
                                className={`m-1 block border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${activeTab === "Islamic" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"}`}
                                onClick={() => setActiveTab("Islamic")}
                            >
                                A Class (Offline) & Online - Islamic
                            </Link>
                        </nav>

                        <button
                            type="button"
                            className="ti-btn bg-primary border mb-2 text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="ri-search-eye-fill"></i> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                <div className="mt-0">
                                    <FormInput
                                        type="date"
                                        name="current_day_minus_one"
                                        control={control}
                                        errors={errors}
                                        defaultValue={filters.current_day_minus_one}
                                        label={"Current Day - 1"}
                                    />
                                </div>
                                <div className="mt-6">
                                    <FilterButton />
                                </div>
                            </div>
                        </form>
                    )}

                    {activeTab === "DailySaleReportList" && (
                        <ClassonlineFiscal />
                    )}
                    {activeTab === "DailySaleReportList" && (
                        <ClassOfflineOnlineFiscal />
                    )}
                    {activeTab === "Online" && (
                        <OnlineSalesGlobal filters={filters} loading={loading} />
                    )}
                    {activeTab === "Islamic" && (
                        <AClassIslamic filters={filters} loading={loading} />
                    )}
                </div>
            </div>
        </>
    );
};

export default DailySaleReportList;
