import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import AnalysisTable from "../components/AnalysisTable.jsx";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import FormInput from "@components/form/FormInput.jsx";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";
import { fetchAnalysis } from "../services/ecom_services.js";
import OrdersBySourceChart from "../components/OrdersBySourceChart.jsx";
import AnalysisConversionTable from "../components/AnalysisConversionTable.jsx";
import { fetch404ErrorSummary } from "../services/Analysis_services.jsx";
import AnalysisErrorForm from "../components/AnalysisError/AnalysisErrorform.jsx";
import ErrorChart from "../components/AnalysisError/ErrorChart.jsx";

const AnalysisReport = () => {
    const [activeTab, setActiveTab] = useState("orderSource");
    const [load, setLoad] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [analysisData, setAnalysisData] = useState([]);
    const [errorData, setErrorData] = useState([]);


    const getYesterdayDate = () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };



    const { control: orderControl, handleSubmit: handleOrderSubmit, getFilters: getOrderFilters } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: "date_from", defaultValue: getYesterdayDate() },
                { name: "date_to", defaultValue: getYesterdayDate() },
            ],
        }), [])
    );
    const [orderFilters, setOrderFilters] = useState(getOrderFilters());

    const getFirstDateOfCurrentMonth = () => {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
    };

    const getPreviousDate = () => {
        let today = new Date();


        if (today.getDate() === 1) {
            return getFirstDateOfCurrentMonth();
        }

        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };

    const getFirstDateOfCurrentMonth1 = () => {
        let today = new Date();

        today.setDate(1);

        return today.toISOString().slice(0, 10);
    };


    const { control: errorControl, handleSubmit: handleErrorSubmit, getFilters: getErrorFilters } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: "date_from", defaultValue: getFirstDateOfCurrentMonth1() },
                { name: "date_to", defaultValue: getPreviousDate() },
            ],
        }), [])
    );
    const [errorFilters, setErrorFilters] = useState(getErrorFilters());

    useEffect(() => {
        if (activeTab === "orderSource") {
            fetchAnalysis({ from: orderFilters.date_from, to: orderFilters.date_to })
                .then((response) => {
                    setAnalysisData(response?.source_code || []);
                })
                .catch((error) => console.error("Error fetching analysis data:", error));
        }
    }, [orderFilters, activeTab]);

    useEffect(() => {
        if (activeTab === "404error") {
            fetch404ErrorSummary({ date_from: errorFilters.date_from, date_to: errorFilters.date_to })
                .then((data) => setErrorData(data))
                .catch((error) => console.error("Error fetching 404 summary:", error));
        }
    }, [errorFilters, activeTab]);

    return (
        <>
            <PageHeader currentpage="E-Commerce" />

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4 dark:text-gray-200 dark:bg-bodybg">
                        <nav className="flex space-x-4">
                            <Link to="#" className={`px-4 py-2 border rounded-md font-medium transition-all dark:text-gray-200 dark:bg-bodybg ${activeTab === "orderSource" ? "bg-primary text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("orderSource")}>Order Source</Link>
                            <Link to="#" className={`px-4 py-2  border  rounded-md font-medium transition-all dark:text-gray-200 dark:bg-bodybg ${activeTab === "404error" ? "bg-primary text-white" : "bg-gray-200"}`} onClick={() => setActiveTab("404error")}>404 Error</Link>
                        </nav>
                        <button type="button" className="ti-btn bg-primary border  text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none" onClick={() => setShowFilters(!showFilters)}>
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                    </div>

                    {activeTab === "orderSource" && (
                        <>
                            {showFilters && (
                                <form onSubmit={handleOrderSubmit(setOrderFilters)}>
                                    <div className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                        <FormInput type="date" name="date_from" control={orderControl} defaultValue={orderFilters.date_from} label={true} />
                                        <FormInput type="date" name="date_to" control={orderControl} defaultValue={orderFilters.date_to} label={true} />
                                        <FilterButton />
                                    </div>
                                </form>
                            )}
                            <OrdersBySourceChart data={analysisData} loading={false} />
                            <AnalysisTable title="" headers={[
                                {label: "Group", accessor: "source_group", align: "left"},
                                {label: "Orders", accessor: "orders", align: "right"},
                                {label: "Merchandise Total", accessor: "merchandise_total", align: "right"},
                                {
                                    label: "Avg Merchandise Total Per Order",
                                    accessor: "avg_merchandise_total",
                                    align: "right"
                                },
                                {label: "Items Per Order", accessor: "avg_items_per_order", align: "right"},
                            ]} data={analysisData} loading={load} filters={orderFilters} />
                            <AnalysisConversionTable filters={orderFilters} />
                        </>
                    )}

                    {activeTab === "404error" && (
                        <>
                            {showFilters && (
                                <form onSubmit={handleErrorSubmit(setErrorFilters)}>
                                    <div className="bg-white mb-4 p-3 rounded-lg shadow-md flex items-center space-x-4">
                                        <FormInput type="date" name="date_from" control={errorControl} defaultValue={errorFilters.date_from} label={true} />
                                        <FormInput type="date" name="date_to" control={errorControl} defaultValue={errorFilters.date_to} label={true} />
                                        <FilterButton />
                                    </div>
                                </form>
                            )}
                            <div className="w-96">
                            <AnalysisErrorForm errorData={errorData} />

                            </div>
                            <ErrorChart dateFrom={errorFilters.date_from} dateTo={errorFilters.date_to} filters={errorFilters} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AnalysisReport;