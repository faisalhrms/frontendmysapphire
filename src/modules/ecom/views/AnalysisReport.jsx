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
import api from "../../../config/axiosConfig.js";
import AnalysisErrorForm from "../components/AnalysisError/AnalysisErrorform.jsx";
import ErrorChart from "../components/AnalysisError/ErrorChart.jsx";
import  {fetch404ErrorSummary} from "../services/Analysis_services.jsx";
const AnalysisReport = () => {
    const [activeTab, setActiveTab] = useState("orderSource");
    const [load, setLoad] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [analysisData, setAnalysisData] = useState([]);
    const [showsynctime, setshowsynctime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorData, setErrorData] = useState([]);


    const today = new Date().toISOString().split("T")[0];
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 2);
    const dateFrom = threeDaysAgo.toISOString().split("T")[0];


    const getYesterdayDate = () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 2);
        return yesterday.toISOString().slice(0, 10);
    };

    const getTodayDate = () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate());
        return yesterday.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: "date_from", defaultValue: getYesterdayDate() },
                { name: "date_to", defaultValue: getTodayDate() },
            ],
        }), [])
    );

    const [filters, setFilters] = useState(getFilters());

    useEffect(() => {
        fetch404ErrorSummary({ date_from: filters.date_from, date_to: filters.date_to })
            .then((data) => setErrorData(data))
            .catch((error) => console.error("Error fetching 404 summary:", error));
    }, [dateFrom, today , filters]);



    const fetchData = async () => {
        setLoad(true);
        try {
            const response = await fetchAnalysis({ from: filters.date_from, to: filters.date_to });
            setAnalysisData(
                response?.source_code?.map(item => ({
                    source_group: item.source_group,
                    orders: item.orders.toLocaleString(),
                    merchandise_total: item.merchandise_total.toLocaleString(),
                    avg_merchandise_total: item.avg_merchandise_total.toLocaleString(),
                    avg_items_per_order: item.avg_items_per_order.toLocaleString(),
                })) || []
            );
        } catch (error) {
            console.error("Error fetching analysis data:", error);
        }
        setLoad(false);
    };

    useEffect(() => {
        if (activeTab === "orderSource") {
            fetchData();
        }
    }, [filters, activeTab]);

    const onSubmit = (formData) => {
        setFilters(formData);
    };

    return (
        <>
            <PageHeader currentpage="E-Commerce" />

            <div className="grid grid-cols-12 gap-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="xl:col-span-12 col-span-12 dark:text-gray-200 dark:bg-bodybg">
                    <div
                        className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4 dark:text-gray-200 dark:bg-bodybg">
                        <nav className="flex space-x-4">
                            <Link to="#"
                                  className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "orderSource" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200"}`}
                                  onClick={() => setActiveTab("orderSource")}>Order Source</Link>
                            <Link to="#"
                                  className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "404error" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200"}`}
                                  onClick={() => setActiveTab("404error")}>404 Error</Link>
                        </nav>
                        <button
                            type="button"
                            className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none dark:text-gray-200 dark:bg-bodybg"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                    </div>

                    {activeTab === "orderSource" && (
                        <>
                            {showsynctime && <div
                                className="text-primary p-2 rounded-lg text-right text-black dark:text-gray-200 dark:bg-bodybg mb-2">
                                <p>{showsynctime}</p></div>}
                            {errorMessage && <div
                                className="error-message alert alert-primary p-2 rounded-lg shadow-md text-center text-black mb-4 mt-4 dark:text-gray-200 dark:bg-bodybg">
                                <p>{errorMessage}</p></div>}
                            {showFilters && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div
                                        className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                        <FormInput
                                            type="date"
                                            placeholder="From"
                                            name="date_from"
                                            control={control}
                                            errors={errors}
                                            defaultValue={filters.date_from}
                                            label={true}
                                        />
                                        <FormInput
                                            type="date"
                                            name="date_to"
                                            placeholder="To"
                                            control={control}
                                            errors={errors}
                                            defaultValue={filters.date_to}
                                            label={true}
                                        />
                                        <FilterButton/>
                                    </div>
                                </form>
                            )}
                            <OrdersBySourceChart data={analysisData} loading={false}/>
                            <AnalysisTable
                                title="Commerce Cloud Order"
                                headers={[
                                    {label: "Group", accessor: "source_group", align: "left"},
                                    {label: "Orders", accessor: "orders", align: "right"},
                                    {label: "Merchandise Total", accessor: "merchandise_total", align: "right"},
                                    {
                                        label: "Avg Merchandise Total Per Order",
                                        accessor: "avg_merchandise_total",
                                        align: "right"
                                    },
                                    {label: "Items Per Order", accessor: "avg_items_per_order", align: "right"},
                                ]}
                                data={analysisData}
                                loading={load}/>
                            <AnalysisConversionTable filters={filters}/>
                        </>
                    )}

                    {showFilters && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                <FormInput
                                    type="date"
                                    placeholder="From"
                                    name="date_from"
                                    control={control}
                                    errors={errors}
                                    defaultValue={filters.date_from}
                                    label={true}
                                />
                                <FormInput
                                    type="date"
                                    name="date_to"
                                    placeholder="To"
                                    control={control}
                                    errors={errors}
                                    defaultValue={filters.date_to}
                                    label={true}
                                />
                                <FilterButton />
                            </div>
                        </form>
                    )}

                    {activeTab === "404error" && (
                        <>
                            <div className="dashboard-container bg-white w-96 mt-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                                {errorData ? (
                                    <AnalysisErrorForm errorData={errorData} />
                                ) : (
                                    <p>Loading 404 Error Summary...</p>
                                )}
                            </div>
                            <ErrorChart dateFrom={filters.date_from} dateTo={filters.date_to}  filters={filters} />
                        </>
                    )}



                </div>
            </div>
        </>
    );
};

export default AnalysisReport;
