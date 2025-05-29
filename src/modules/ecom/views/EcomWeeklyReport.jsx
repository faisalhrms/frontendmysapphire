import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import UserJourneyTab from "@modules/ecom/components/weekly-report/UserJourneyTab.jsx";
import SourceBasedPerformanceTab from "@modules/ecom/components/weekly-report/SourceBasedPerformanceTab.jsx";
import LandingPagePerformanceTab from "@modules/ecom/components/weekly-report/LandingPagePerformanceTab.jsx";
import WebsiteSearchTab from "@modules/ecom/components/weekly-report/WebsiteSearchTab.jsx";
import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";

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
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "user_journey" ? '/ecom/weekly-report/user-journey/weekly/' :
            activeTab === "source_based_performance" ? '/ecom/weekly-report/source-based-performance/' :
                activeTab === "landing_page_performance" ? '/ecom/weekly-report/landing-page-performance/' : '', filters
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
            {
                activeTab !== 'landing_page_performance' &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <WeeklyReportFilter filters={filters} control={control} errors={errors}/>
                </form>
            }
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
                            />
                        ),
                    },
                    // {
                    //     id: "website_search",
                    //     label: "Website Search",
                    //     icon: <i className="bi bi-search"></i>,
                    //     content: (
                    //         <WebsiteSearchTab data={data}
                    //                           isLoading={isLoading}
                    //                           isActive={'website_search' === activeTab}
                    //         />
                    //     ),
                    // },
                ]}
                onTabChange={handleTabChange}
            />

        </>
    );
}
export default EcomWeeklyReport