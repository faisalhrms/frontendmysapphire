import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate, getPastDateTime} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

import IconTabs from "@components/IconTabs.jsx";
import SalesForceOrderStatusTable from "@modules/sf-order-exceptions/components/SalesForceOrderStatusTable.jsx";
import HourlyOrderReport from "@modules/sf-order-exceptions/components/HourlyOrderReport.jsx";
import SalesForceOrderReconTable from "@modules/sf-order-exceptions/components/SalesForceOrderReconTable.jsx";
import SalesForceOrderStatusFilter from "@modules/sf-order-exceptions/components/SalesForceOrderStatusFilter.jsx";

const SalesForceOrderStatusReport = () => {
    const [activeTab, setActiveTab] = useState("fo_status_summary");

    const {startOfToday, now} = getPastDateTime()
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date', defaultValue: getPastDate(0)},
                    { name: 'from_dt',defaultValue: startOfToday},
                    { name: 'to_dt',defaultValue: now},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading, refetch } = useFetchWithFilters(
        activeTab === "fo_status_summary" ? '/reporting/sf/order-status/' :
            activeTab === "hourly_order_report" ? '/reporting/sf/order-status/hourly/' :
            activeTab === "order_recon_summary" ? '/reporting/sf/order-status/recon/' :
                '', filters
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
            <PageHeader currentpage="Salesforce Order Status" activepage="Salesforce" mainpage="Order Order Status"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SalesForceOrderStatusFilter
                    control={control}
                    errors={errors}
                    activeTab={activeTab}
                />
            </form>
            <>

                <IconTabs
                    tabs={[
                        {
                            id: "fo_status_summary",
                            label: "FO Status Summary",
                            icon: <i className="bi bi-graph-up"></i>,
                            content: (
                                <SalesForceOrderStatusTable data={data}
                                                            isLoading={isLoading}
                                                            isActive={'fo_status_summary' === activeTab}/>
                            ),
                        },
                        {
                            id: "order_recon_summary",
                            label: "Order Summary Recon",
                            icon: <i className="bi bi-box"></i>,
                            content: (
                                <SalesForceOrderReconTable data={data}
                                                   isLoading={isLoading}
                                                   isActive={'order_recon_summary' === activeTab}/>
                            ),
                        },
                        {
                            id: "hourly_order_report",
                            label: "Hourly Order Summary",
                            icon: <i className="bi bi-clock-history"></i>,
                            content: (
                                <HourlyOrderReport data={data}
                                                   isLoading={isLoading}
                                                   isActive={'hourly_order_report' === activeTab}/>
                            ),
                        },
                    ]}
                    onTabChange={handleTabChange}
                />
            </>
        </>
    );
};

export default SalesForceOrderStatusReport;
