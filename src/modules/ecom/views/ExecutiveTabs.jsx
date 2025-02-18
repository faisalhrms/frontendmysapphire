import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PageHeader from "../../layouts/includes/PageHeader.jsx";
import ExecutiveForm from "../components/SalesforceDashboard/ExecutiveForm.jsx";
import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";

const ExecutiveTabs = () => {
    const [activeTab, setActiveTab] = useState("executiveSummary");
    const [showFilters, setShowFilters] = useState(false);

    const getCurrentDate = () => new Date();
    const getFixedToDate = () => new Date("2025-01-21");

    const [fromDate, setFromDate] = useState(getCurrentDate);
    const [toDate, setToDate] = useState(getFixedToDate);

    const resetDates = () => {
        setFromDate(getCurrentDate());
        setToDate(getFixedToDate());
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
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
                    className="px-4 py-2 bg-primary text-white rounded-md shadow-md flex items-center"
                    onClick={toggleFilters}
                >
                    ☰ Filters
                </button>
            </div>


            {showFilters && (
                <div className="flex justify-between items-center bg-white p-2 shadow-md rounded-lg mb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-md p-2">
                            <span className="text-gray-600 mr-2">To:</span>
                            <DatePicker
                                selected={toDate}
                                onChange={(date) => setToDate(date)}
                                className="border-none focus:outline-none"
                                dateFormat="dd-MMM-yyyy"
                                minDate={getFixedToDate()}
                                maxDate={getFixedToDate()}
                            />
                        </div>

                        <div className="flex items-center border rounded-md p-2">
                            <span className="text-gray-600 mr-2">From:</span>
                            <DatePicker
                                selected={fromDate}
                                onChange={(date) => setFromDate(date)}
                                className="border-none focus:outline-none"
                                dateFormat="dd-MMM-yyyy"
                                minDate={getCurrentDate()}
                                maxDate={getCurrentDate()}
                            />
                        </div>
                    </div>

                    <button
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark"
                        onClick={resetDates}
                    >
                        🔄 Refresh
                    </button>
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
