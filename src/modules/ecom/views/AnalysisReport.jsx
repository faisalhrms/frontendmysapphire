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
    // Order Source Filters hook
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
                        defaultValue:today,
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


    // 404 Error Filters hook
    const {
        control: errorControl,
        handleSubmit: handleErrorSubmit,
        getFilters: getErrorFilters,
        reset: resetErrorFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    {
                        name: "date_from",
                        defaultValue: startOfMonth,
                    },
                    {
                        name: "date_to",
                        defaultValue: today, // yesterday
                    },
                ],
            }),
            []
        )
    );

    const [errorFilters, setErrorFilters] = useState(getErrorFilters());

    const hideOnlyComparativePeriod = ["orderSource", "404error"].includes(activeTab);

    const { data: orderData, isLoading: orderLoading } = useFetchWithFilters(

            activeTab === "orderSource" ? "/ecom/analytics/fetch_order_source_cc/" :
                '',
        orderFilters
    );

    console.log(orderData)

    const { data: errorData, isLoading: errorLoading } = useFetchWithFilters(
        activeTab === "404error" ? '/ecom/analytics/fetch_404_error_summary/' :

                    '',
        errorFilters
    );



    const onOrderSubmit = useCallback(
        (formData) => {
            setOrderFilters(formData);
        },
        []
    );

    const onErrorSubmit = useCallback(
        (formData) => {
            setErrorFilters(formData);
        },
        []
    );

    const clearFilter = () => {
        if (activeTab === "orderSource") {
            resetOrderFilters();
            setOrderFilters(getOrderFilters());
        } else if (activeTab === "404error") {
            resetErrorFilters();
            setErrorFilters(getErrorFilters());
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <PageHeader currentpage="E-Commerce" />

            <AnalysisDate
                activeTab={activeTab}
                orderControl={orderControl}
                errorControl={errorControl}
                orderFilters={orderFilters}
                errorFilters={errorFilters}
                handleOrderSubmit={handleOrderSubmit}
                handleErrorSubmit={handleErrorSubmit}
                onOrderSubmit={onOrderSubmit}
                onErrorSubmit={onErrorSubmit}
                clearFilter={clearFilter}
                getErrorFilters={getErrorFilters}
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
                                <AnalysisConversionTable filters={orderFilters} />
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
                                    <AnalysisErrorForm errorData={errorData || []} />
                                </div>
                                <ErrorChart
                                    dateFrom={errorFilters.date_from}
                                    dateTo={errorFilters.date_to}
                                    data={errorData || []}
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
