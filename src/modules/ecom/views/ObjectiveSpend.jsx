import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import FormInput from "@components/form/FormInput.jsx";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";
import ObjectiveWiseSpentSummary from "../components/DigitalSpent/ObjectiveWiseSpentSummary.jsx";

const ObjectiveSpend = () => {
    const [activeTab, setActiveTab] = useState("ObjectiveWiseSpentSummary");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    const getYesterdayDate = () => new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10);

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

    const onSubmit = async (formData) => {
        setLoading(true);
        setTimeout(() => {
            setFilters(formData);
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <PageHeader currentpage="Digital Spent" />

            <div className="grid grid-cols-12 gap-6 ">
                <div className="xl:col-span-12 col-span-12 ">
                    <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <nav className="flex space-x-4">
                            <Link
                                to="#"
                                className={`m-1 block w-full border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md dark:text-gray-200 dark:bg-bodybg ${
                                    activeTab === "ObjectiveWiseSpentSummary" ? "bg-primary text-white" : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"
                                }`}
                                onClick={() => setActiveTab("ObjectiveWiseSpentSummary")}
                            >
                                Objective Wise Spent Summary
                            </Link>
                        </nav>

                        <button
                            type="button"
                            className="ti-btn bg-primary border  text-white btn-wave font-medium text-[0.85rem] rounded-[0.35rem] py-[0.51rem] px-[0.86rem] shadow-none"
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
                                        placeholder="Till Date "
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

                    <ObjectiveWiseSpentSummary filters={filters} loading={loading} />
                </div>
            </div>
        </>
    );
};

export default ObjectiveSpend;
