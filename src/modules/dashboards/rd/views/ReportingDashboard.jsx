// ReportingDashboard.jsx (updated)
import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate, getPastDateTime} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import LandingPagePerformanceTab from "@modules/ecom/components/weekly-report/LandingPagePerformanceTab.jsx";
import HourTrafficRate from "@modules/ecom/components/weekly-report/HourTrafficRate.jsx";
import OrderDetailReport from "@modules/ecom/components/weekly-report/OrderDetailReport.jsx";
import TopSellingReport from "@modules/ecom/components/weekly-report/TopSellingReport.jsx";
import SalesDashboardFilter from "@modules/dashboards/rd/components/SalesDashboardFilter.jsx";
import SalesForceOrderExceptionTable from "@modules/sf-order-exceptions/components/SalesForceOrderExceptionTable.jsx";
import SalesForceOrderStatusTable from "@modules/sf-order-exceptions/components/SalesForceOrderStatusTable.jsx"; // Import the new component

const ReportingDashboard = () => {
    const [activeTab, setActiveTab] = useState("landing_page_performance");
    const { startOfToday, now } = getPastDateTime();

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
                    { name: 'top', defaultValue: 10 },
                    { name: 'hour', defaultValue: null },
                    { name: 'from_dt', defaultValue: startOfToday },
                    { name: 'to_dt', defaultValue: now },
                ],
            }),
            [startOfToday, now]
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const transformedFilters = useMemo(() => {
        // Create tab-specific filters
        if (activeTab === "sf_order_status") {
            return {
                from_dt: filters.from_dt,
                to_dt: filters.to_dt
            };
        }
        if (activeTab === "sf_order_exceptions") {
            return { date: filters.date };
        }
        return {
            date: filters.date,
            top: filters.top,
            hour: filters.hour
        };
    }, [filters, activeTab]);

    const { data, isLoading, refetch } = useFetchWithFilters(
        activeTab === "landing_page_performance" ? '/ecom/weekly-report/landing-page-performance/' :
            activeTab === "hour_traffic_rate" ? '/ecom/weekly-report/traffic-performance/' :
                activeTab === "order_detail_from_cc" ? '/ecom/weekly-report/order-detail-15minutes/' :
                    activeTab === "top_selling_article" ? '/ecom/weekly-report/top-selling-articles-15minutes/' :
                        activeTab === "sf_order_exceptions" ? '/reporting/sf/order-exception/' :
                            activeTab === "sf_order_status" ? '/reporting/sf/order-status/' : '',
        transformedFilters
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
            <PageHeader currentpage="Reporting Dashboard" activepage="Reports" mainpage="Dashboard"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SalesDashboardFilter
                    activeTab={activeTab}
                    control={control}
                    errors={errors}
                    filters={filters}
                />
            </form>
            <IconTabs
                tabs={[
                    {
                        id: "landing_page_performance",
                        label: "Landing Page Performance",
                        icon: <i className="bi bi-graph-up"></i>,
                        content: (
                            <LandingPagePerformanceTab
                                data={data}
                                isLoading={isLoading}
                                isActive={'landing_page_performance' === activeTab}
                                control={control}
                                errors={errors}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                            />
                        ),
                    },
                    {
                        id: "hour_traffic_rate",
                        label: "Hourly Traffic Rate",
                        icon: <i className="bi bi-clock-history"></i>,
                        content: (
                            <HourTrafficRate
                                data={data}
                                isLoading={isLoading}
                                isActive={'hour_traffic_rate' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "order_detail_from_cc",
                        label: "Order detail from CC",
                        icon: <i className="bi bi-clock-history"></i>,
                        content: (
                            <OrderDetailReport
                                data={data}
                                isLoading={isLoading}
                                isActive={'order_detail_from_cc' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "top_selling_article",
                        label: "Top Selling Article",
                        icon: <i className="bi bi-clock-history"></i>,
                        content: (
                            <TopSellingReport
                                data={data}
                                isLoading={isLoading}
                                isActive={'top_selling_article' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "sf_order_exceptions",
                        label: "Order Exceptions",
                        icon: <i className="bi bi-exclamation-triangle"></i>,
                        content: (
                            <SalesForceOrderExceptionTable data={data} isLoading={isLoading}  isActive={'sf_order_exceptions' === activeTab}  />
                        ),
                    },
                    {
                        id: "sf_order_status",
                        label: "Order Status",
                        icon: <i className="bi bi-list-check"></i>,
                        content: (
                            <SalesForceOrderStatusTable  data={data}
                                                         isLoading={isLoading}
                                                         isActive={'sf_order_status' === activeTab} />

                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    )
}
export default ReportingDashboard;