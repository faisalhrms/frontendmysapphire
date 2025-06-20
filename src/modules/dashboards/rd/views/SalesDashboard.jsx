import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate, getPastDateTime} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import LandingPagePerformanceTab from "@modules/ecom/components/weekly-report/LandingPagePerformanceTab.jsx";
import HourTrafficRate from "@modules/ecom/components/weekly-report/HourTrafficRate.jsx";
import OrderDetailReport from "@modules/ecom/components/weekly-report/OrderDetailReport.jsx";
import SalesDashboardFilter from "@modules/dashboards/rd/components/SalesDashboardFilter.jsx";
import SalesForceOrderExceptionTable from "@modules/sf-order-exceptions/components/SalesForceOrderExceptionTable.jsx";
import SalesForceOrderStatusTable from "@modules/sf-order-exceptions/components/SalesForceOrderStatusTable.jsx";
import HourlyOrderReport from "@modules/sf-order-exceptions/components/HourlyOrderReport.jsx";
import SalesForceOrderReconTable from "@modules/sf-order-exceptions/components/SalesForceOrderReconTable.jsx";
import TopSellingProductsReport from "@modules/ecom/components/weekly-report/TopSellingProductsReport.jsx";

const SalesDashboard = () => {
    const [activeTab, setActiveTab] = useState("top_selling_products");
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
                    { name: 'date_from', defaultValue: getPastDate(0)},
                    { name: 'date_to', defaultValue: getPastDate(0)},
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

    const { data, isLoading, refetch } = useFetchWithFilters(
        activeTab === "landing_page_performance" ? '/ecom/weekly-report/landing-page-performance/' :
            activeTab === "hour_traffic_rate" ? '/ecom/weekly-report/traffic-performance/' :
                activeTab === "order_detail_from_cc" ? '/ecom/weekly-report/order-detail-15minutes/' :
                        activeTab === "sf_order_exceptions" ? '/reporting/sf/order-exception/' :
                            activeTab === "fo_status_summary" ? '/reporting/sf/order-status/' :
                                activeTab === "order_recon_summary" ? '/reporting/sf/order-status/recon/' :
                                activeTab === "hourly_order_report" ? '/reporting/sf/order-status/hourly/' :
                                '',
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
            <PageHeader currentpage="Sales Dashboard" activepage="Sales" mainpage="Dashboard"/>
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
                        id: "top_selling_products",
                        label: "Top Selling Products",
                        icon: <i className="bi bi-hand-thumbs-up"></i>,
                        content: (
                            <TopSellingProductsReport filters={filters} isActive={'top_selling_products' === activeTab}/>
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
                        label: "Order Detail From CC",
                        icon: <i className="bi bi-box"></i>,
                        content: (
                            <OrderDetailReport
                                data={data}
                                isLoading={isLoading}
                                isActive={'order_detail_from_cc' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "sf_order_exceptions",
                        label: "Order Exceptions",
                        icon: <i className="bi bi-exclamation-triangle"></i>,
                        content: (
                            <SalesForceOrderExceptionTable data={data} isLoading={isLoading} isActive={'sf_order_exceptions' === activeTab}  />
                        ),
                    },
                    {
                        id: "fo_status_summary",
                        label: "FulFillment Order Status Summary",
                        icon: <i className="bi bi-box-seam"></i>,
                        content: (
                            <SalesForceOrderStatusTable data={data}
                                                        isLoading={isLoading}
                                                        isActive={'fo_status_summary' === activeTab}/>

                        ),
                    },
                    {
                        id: "order_recon_summary",
                        label: "Order Summary Recon",
                        icon: <i className="bi bi-boxes"></i>,
                        content: (
                            <SalesForceOrderReconTable data={data}
                                                       isLoading={isLoading}
                                                       isActive={'order_recon_summary' === activeTab}/>
                        ),
                    },
                    {
                        id: "hourly_order_report",
                        label: "Hourly Order Summary",
                        icon: <i className="bi bi-hourglass-bottom"></i>,
                        content: (
                            <HourlyOrderReport data={data}
                                                         isLoading={isLoading}
                                                         isActive={'hourly_order_report' === activeTab} />

                        ),
                    },
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
                ]}
                onTabChange={handleTabChange}
            />
        </>
    )
}
export default SalesDashboard;