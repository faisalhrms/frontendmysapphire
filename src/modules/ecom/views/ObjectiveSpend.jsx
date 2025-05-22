import React, { useState, useMemo, useCallback } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import IconTabs from "@components/IconTabs.jsx";
import ObjectiveWiseSpentSummary from "../components/DigitalSpent/ObjectiveWiseSpentSummary.jsx";
import DigitalDate from "@modules/ecom/components/DigitalSpent/Digitaldate.jsx";
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";


const ObjectiveSpend = () => {
    const [activeTab, setActiveTab] = useState("ObjectiveWiseSpentSummary");

    const getTodayDate = () => new Date().toISOString().slice(0, 10);
    const {
        today,
        startOfMonth,
    } = getComparativeReportDates();
    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [{ name: "till_date", defaultValue:  today, }],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ObjectiveWiseSpentSummary"
            ? "/digital_spent/fetch_objective_wise_summary/"
            : "",
        filters
    );

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader currentpage="Digital Spent" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <DigitalDate control={control} errors={errors} filters={filters} />
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "ObjectiveWiseSpentSummary",
                        label: "Objective Wise Spent Summary",
                        icon: <i className="bx bx-chart"></i>,
                        content: (
                            <ObjectiveWiseSpentSummary
                                filters={filters}
                                loading={isLoading}
                                data={data}
                                isActive={activeTab === "ObjectiveWiseSpentSummary"}
                            />
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ObjectiveSpend;
