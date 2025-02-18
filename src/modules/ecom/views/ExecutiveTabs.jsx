import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PageHeader from "../../layouts/includes/PageHeader.jsx";
import ExecutiveForm from "../components/SalesforceDashboard/ExecutiveForm.jsx";
import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";

const ExecutiveTabs = () => {
    const [activeTab, setActiveTab] = useState("executiveSummary");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const getCurrentDate = () => new Date();
    const getDynamicFromDate = () => new Date("2025-01-21");

    const [fromDate, setFromDate] = useState(getDynamicFromDate);
    const [toDate, setToDate] = useState(getCurrentDate);
    const [data, setData] = useState(null);

    const fetchData = () => {
        console.log("Fetching data for:", fromDate, toDate);
        setData(`Data updated for range: ${fromDate.toDateString()} - ${toDate.toDateString()}`);
    };

    useEffect(() => {
        fetchData();
    }, [fromDate, toDate]);

    const handleDateChange = (setter) => (date) => {
        if (date) {
            setter(date);
        }
    };

    const resetDates = () => {
        setFromDate(getDynamicFromDate());
        setToDate(getCurrentDate());
        setSelectedDate(new Date().toISOString().split("T")[0]);
    };

    return (
        <>
            <PageHeader currentpage="Salesforce Dashboard" />

            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4">
                <div className="flex space-x-4">
                    <Link
                        to="#"
                        className={`px-4 py-2 rounded-md font-medium transition-all ${
                            activeTab === "executiveSummary"
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveTab("executiveSummary")}
                    >
                        Executive Summary
                    </Link>

                    <Link
                        to="#"
                        className={`px-4 py-2 rounded-md font-medium transition-all ${
                            activeTab === "agingLiabilities"
                                ? "bg-primary text-white shadow-md"
                                : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveTab("agingLiabilities")}
                    >
                        Aging’s for Pending Liabilities
                    </Link>
                </div>

                <button
                    type="button"
                    className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
                    onClick={() => {
                        setShowFilters(!showFilters);
                        setSelectedDate(new Date().toISOString().split("T")[0]);
                    }}
                >
                    <i className="ri-filter-3-fill inline-block"></i> Filters
                </button>
            </div>

            {showFilters && (
                <div className="bg-white p-2 mt-2 rounded-lg shadow-md">
                    <div className="mt-4 flex justify-between">
                        <div>
                            <label className="block text-gray-600">From:</label>
                            <DatePicker
                                selected={fromDate}
                                onChange={handleDateChange(setFromDate)}
                                className="border p-2 rounded"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600">To:</label>
                            <DatePicker
                                selected={toDate}
                                onChange={handleDateChange(setToDate)}
                                className="border p-2 rounded"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <button
                            className="border xs px-2 py-2 rounded ti-btn ti-btn-primary !mb-0"
                            onClick={resetDates}
                        >
                            <i className="ri-refresh-line"></i> Refresh
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="tab-content bg-white rounded-lg shadow-md mt-4">
                        {activeTab === "executiveSummary" && (
                            <div className="tab-pane show active p-6" id="generate-report"
                                 aria-labelledby="generate-report" role="tabpanel">
                                <ExecutiveForm />
                            </div>
                        )}

                        {activeTab === "agingLiabilities" && (
                            <div className="tab-pane show active p-6 mt-6" id="replenishment-history"
                                 aria-labelledby="replenishment-history" role="tabpanel">
                                <AgingForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </>
    );
};

export default ExecutiveTabs;
