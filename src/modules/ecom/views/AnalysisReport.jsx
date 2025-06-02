import React, { useState, useMemo, useCallback } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import IconTabs from "@components/IconTabs.jsx";
import OrdersBySourceChart from "../components/OrdersBySourceChart.jsx";
import AnalysisTable from "../components/AnalysisTable.jsx";
import AnalysisConversionTable from "../components/AnalysisConversionTable.jsx";
import AnalysisErrorForm from "../components/AnalysisError/AnalysisErrorform.jsx";
import ErrorChart from "../components/AnalysisError/ErrorChart.jsx";
import AnalysisDate from "@modules/ecom/components/AnalysisError/AnalysisDate.jsx";
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";

const AnalysisReport = () => {
    const [activeTab, setActiveTab] = useState("orderSource");
    const {
        today,
        startOfMonth,
    } = getComparativeReportDates();

    const {
        control: orderControl,
        handleSubmit: handleOrderSubmit,
        getFilters: getOrderFilters,
        reset: resetOrderFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    {
                        name: "date_from",
                        defaultValue:activeTab==="404error"?startOfMonth:today,
                    },
                    {
                        name: "date_to",
                        defaultValue: today,
                    },
                ],
            }),
            []
        )
    );

    const [orderFilters, setOrderFilters] = useState(getOrderFilters());




    const hideOnlyComparativePeriod = ["orderSource", "404error"].includes(activeTab);

    const { data: orderData, isLoading: orderLoading } = useFetchWithFilters(

            activeTab === "orderSource" ? "/ecom/analytics/fetch_order_source_cc/" :
                activeTab === "404error" ? '/ecom/analytics/fetch_404_error_summary/' :
                '',
        orderFilters
    );




    const onOrderSubmit = useCallback(
        (formData) => {
            setOrderFilters(formData);
        },
        []
    );

    const onErrorSubmit = useCallback(
        (formData) => {
            setOrderFilters(formData);
        },
        []
    );

    const clearFilter = () => {

            resetOrderFilters();
            setOrderFilters(getOrderFilters());

    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <PageHeader currentpage="E-Commerce" activepage="Analysis" mainpage="E-Commerce"/>

            <AnalysisDate
                activeTab={activeTab}
                orderControl={orderControl}
                errorControl={orderControl}
                orderFilters={orderFilters}
                errorFilters={orderFilters}
                handleOrderSubmit={handleOrderSubmit}
                handleErrorSubmit={handleOrderSubmit}
                onOrderSubmit={onOrderSubmit}
                onErrorSubmit={onOrderSubmit}
                clearFilter={clearFilter}
                getErrorFilters={getOrderFilters}
                hideOnlyComparativePeriod={hideOnlyComparativePeriod}
            />

            <IconTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={[
                    {
                        id: "orderSource",
                        label: "Order Source",
                        icon: <i className="bx bx-pie-chart-alt"></i>,
                        content: (
                            <>
                                <OrdersBySourceChart data={orderData?.source_code} loading={orderLoading} />
                                <AnalysisTable
                                    title="Order Source Analysis"
                                    data={orderData?.source_code}
                                    loading={orderLoading}
                                    filters={orderFilters}
                                />
                                <AnalysisConversionTable filters={orderFilters}   loading={orderLoading} />
                            </>
                        ),
                    },
                    {
                        id: "404error",
                        label: "404 Errors",
                        icon: <i className="bx bx-error-circle"></i>,
                        content: (
                            <>
                                <div className="w-96">
                                    <AnalysisErrorForm errorData={orderData || []} />
                                </div>
                                <ErrorChart
                                    dateFrom={orderFilters.date_from}
                                    dateTo={orderFilters.date_to}
                                    chartData={orderData || []}
                                    loading={orderLoading}
                                />
                            </>
                        ),
                    },
                ]}
            />
        </>
    );
};

export default AnalysisReport;
