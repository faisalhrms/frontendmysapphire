import React, {useCallback, useMemo, useState} from "react";
import {getPastDate} from "@helpers/dateTime.js";
import useFilters from "@hooks/useFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import PendingLiabilitiesFilter from "@modules/ecom/components/PendingLiabilitiesFilter.jsx";
import ExecutiveSummaryTab from "@modules/ecom/components/ExecutiveSummaryTab.jsx";

const PendingLiabilities = () => {
    const [activeTab, setActiveTab] = useState("executive_summary");
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date_from',defaultValue: '2025-01-21'},
                    { name: 'date_to',defaultValue: getPastDate(1)},
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

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader currentpage="Pending Liabilities Report" activepage="Ecom" mainpage="Pending Liabilities"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PendingLiabilitiesFilter
                    control={control}
                    errors={errors}
                />
            </form>
            <>

                <IconTabs
                    tabs={[
                        {
                            id: "executive_summary",
                            label: "Executive Summary",
                            icon: <i className="bi bi-graph-up"></i>,
                            content: (
                                <ExecutiveSummaryTab
                                    filters={filters}
                                    isActive={'executive_summary' === activeTab}/>
                            ),
                        },
                    ]}
                    onTabChange={handleTabChange}
                />
            </>
        </>
    );
};

export default PendingLiabilities;