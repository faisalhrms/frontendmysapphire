import React, { useState, useMemo, useCallback,  useEffect  } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import PageHeader from "../../layouts/includes/PageHeader.jsx";
import ExecutiveForm from "../components/SalesforceDashboard/ExecutiveForm.jsx";
import AgingForm from "../components/SalesforceDashboard/AgingForm.jsx";
import FormInput from "@components/form/FormInput.jsx";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";

const ExecutiveTabs = () => {
    const [activeTab, setActiveTab] = useState("executiveSummary");
    const [showFilters, setShowFilters] = useState(false);

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date_from', defaultValue: new Date("2025-01-21").toISOString().slice(0, 10)},
                    { name: 'date_to', defaultValue: new Date().toISOString().slice(0, 10)},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    // const currentDate = new Date().toLocaleDateString(); // Get current date
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }); // Get the month abbreviation (e.g., "Feb")
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        setCurrentDate(formattedDate);
    }, []);


    return (
        <>
            <PageHeader currentpage="Salesforce Dashboard" />

            <div
                className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex space-x-4">
                    <Link
                        to="#"
                        className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "executiveSummary" ? "bg-primary text-white shadow-md" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("executiveSummary")}
                    >
                        Executive Summary
                    </Link>

                    <Link
                        to="#"
                        className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "agingLiabilities" ? "bg-primary text-white shadow-md" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("agingLiabilities")}
                    >
                        Aging’s for Pending Liabilities
                    </Link>
                </div>
                {activeTab === "agingLiabilities" && (
                    <div className="flex justify-between items-center">
                        <span></span>
                        <div className="text-right">
                            <span className="text-gray-800 font-semibold">As On: </span>
                            <span className="text-primary font-bold">{currentDate}</span>
                        </div>
                    </div>
                )}
                {activeTab === "executiveSummary" && (
                    <button
                        type="button"
                        className="ti-btn bg-primary text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
                        onClick={() => {
                            setShowFilters(!showFilters);
                        }}
                    >
                        <i className="ri-filter-3-fill inline-block"></i> Filters
                    </button>
                )}
            </div>

            {showFilters && activeTab === "executiveSummary" && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white p-2 mt-2 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <div className="mt-2 mr-2 flex items-center dark:text-gray-200 dark:bg-bodybg">
                            <div className="mr-2">
                                <FormInput
                                    type="date"
                                    name="date_from"
                                    control={control}
                                    errors={errors}
                                    placeholder="From"
                                    label={true}
                                />
                            </div>
                            <div className="mr-2">
                                <FormInput
                                    type="date"
                                    name="date_to"
                                    control={control}
                                    errors={errors}
                                    placeholder="To"
                                    label={true}
                                />
                            </div>
                            <div className="mr-2 flex items-right dark:text-gray-200 dark:bg-bodybg">
                                <FilterButton />
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-12 gap-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="xl:col-span-12 col-span-12 dark:text-gray-200 dark:bg-bodybg">
                    <div className="tab-content bg-white rounded-lg shadow-md mt-4 dark:text-gray-200 dark:bg-bodybg">
                        {activeTab === "executiveSummary" && (
                            <div className="tab-pane show active p-6 dark:text-gray-200 dark:bg-bodybg" id="generate-report"
                                 aria-labelledby="generate-report" role="tabpanel">
                                <ExecutiveForm filters={filters} />
                            </div>
                        )}

                        {activeTab === "agingLiabilities" && (
                            <div className="tab-pane show active p-6 mt-6 dark:text-gray-200 dark:bg-bodybg" id="replenishment-history"
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
