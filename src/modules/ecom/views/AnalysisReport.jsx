import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import AnalysisTable from "../components/AnalysisTable.jsx";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import FormInput from "@components/form/FormInput.jsx";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";
import { fetchAnalysis } from "../services/ecom_services.js";
import OrdersBySourceChart from "../components/OrdersBySourceChart.jsx";


const AnalysisReport = () => {

    const [activeTab, setActiveTab] = useState("orderSource");
    const [load, setLoad] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [analysisData, setAnalysisData] = useState([]);

    const getYesterdayDate = () => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };




    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "date_from", defaultValue: getYesterdayDate() },
                    { name: "date_to", defaultValue: getYesterdayDate() },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const fetchData = async () => {
        setLoad(true);
        try {
            const response = await fetchAnalysis({from:filters.date_from, to:filters.date_to});
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
        fetchData();
    }, [filters]);

    const onSubmit = (formData) => {
        setFilters(formData);
    };

    console.log(`this is data`,analysisData)
    return (
        <>
            <PageHeader currentpage="E-Commerce" />

            <div className="grid grid-cols-12 gap-6">
                <div className=" xl:col-span-12 col-span-12">
                    <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md">
                        <nav className="flex space-x-4">
                            <Link
                                to="#"
                                className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                                    activeTab === "orderSource" ? "bg-primary text-white" : "bg-gray-200"
                                }`}
                                onClick={() => setActiveTab("orderSource")}
                            >
                                Order Source
                            </Link>
                        </nav>

                        <button
                            type="button"
                            className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white p-3 mt-2 rounded-lg shadow-md flex items-center space-x-4">
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

                    <OrdersBySourceChart data={analysisData} loading={false} />

                    <div className="tab-content">
                        <div className="bg-white mt-4 rounded-lg">
                            {activeTab === "orderSource" && (
                                <AnalysisTable
                                    title="Order Source"
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
                                    loading={load}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnalysisReport;
