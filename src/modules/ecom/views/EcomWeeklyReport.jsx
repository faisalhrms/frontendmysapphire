import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import UserJourneyTab from "@modules/ecom/components/weekly-report/UserJourneyTab.jsx";
import SourceBasedPerformanceTab from "@modules/ecom/components/weekly-report/SourceBasedPerformanceTab.jsx";
import LandingPagePerformanceTab from "@modules/ecom/components/weekly-report/LandingPagePerformanceTab.jsx";
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";
import HourTrafficRate from "@modules/ecom/components/weekly-report/HourTrafficRate.jsx";
import OrderDetailReport from "@modules/ecom/components/weekly-report/OrderDetailReport.jsx";
import TopSellingReport from "@modules/ecom/components/weekly-report/TopSellingReport.jsx";
import TopSellingProductsReport from "@modules/ecom/components/weekly-report/TopSellingProductsReport.jsx";

const EcomWeeklyReport = () =>{
    const [activeTab, setActiveTab] = useState("user_journey");
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date',defaultValue: getPastDate(0)},
                    { name: 'top', defaultValue: 10 },
                    { name: 'hour', defaultValue: null },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());
    const { data, isLoading, refetch } = useFetchWithFilters(
        activeTab === "user_journey" ? '/ecom/weekly-report/user-journey/weekly/' :
            activeTab === "source_based_performance" ? '/ecom/weekly-report/source-based-performance/' :
                activeTab === "landing_page_performance" ? '/ecom/weekly-report/landing-page-performance/' :
                    activeTab === "hour_traffic_rate" ? '/ecom/weekly-report/traffic-performance/' :
                        activeTab === "order_detail_from_cc" ? '/ecom/weekly-report/order-detail-15minutes/' :
                            activeTab === "top_selling_article" ? '/ecom/weekly-report/top-selling-articles-15minutes/' :
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
            <PageHeader currentpage="Ecom Weekly Report" activepage="Reports" mainpage="Ecom Weekly Report"/>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <WeeklyReportFilter filters={filters} control={control} errors={errors} activeTab={activeTab}/>
                    </form>
            <IconTabs
                tabs={[
                    {
                        id: "user_journey",
                        label: "User Journey vs LY",
                        icon: <i className="bi bi-people"></i>,
                        content: (
                            <UserJourneyTab data={data}
                                            isLoading={isLoading}
                                            isActive={'user_journey' === activeTab}
                                            filters={filters}
                            />
                        ),
                    },
                    {
                        id: "source_based_performance",
                        label: "Source Based Performance",
                        icon: <i className="bi bi-graph-up-arrow"></i>,
                        content: (
                            <SourceBasedPerformanceTab data={data}
                                                       isLoading={isLoading}
                                                       isActive={'source_based_performance' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "landing_page_performance",
                        label: "Landing Page Performance",
                        icon: <i className="bi bi-graph-up"></i>,
                        content: (
                            <LandingPagePerformanceTab data={data}
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
                            <HourTrafficRate data={data}
                                              isLoading={isLoading}
                                              isActive={'hour_traffic_rate' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "order_detail_from_cc",
                        label: "Order Detail From CC ",
                        icon: <i className="bi bi-box"></i>,
                        content: (
                            <OrderDetailReport data={data}
                                             isLoading={isLoading}
                                             isActive={'order_detail_from_cc' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "top_selling_products",
                        label: "Top Selling Products",
                        icon: <i className="bi bi-bar-chart-line"></i>,
                        content: (
                            <TopSellingProductsReport isActive={'top_selling_products' === activeTab}
                            />
                        ),
                    },
                    {
                        id: "top_selling_article",
                        label: "Hourly Top Selling Articles",
                        icon: <i className="bi bi-bar-chart-line"></i>,
                        content: (
                            <TopSellingReport data={data}
                                              isLoading={isLoading}
                                              isActive={'top_selling_article' === activeTab}
                            />
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />

        </>
    );
}
export default EcomWeeklyReport