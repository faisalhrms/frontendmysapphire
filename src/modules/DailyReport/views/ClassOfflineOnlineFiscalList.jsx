import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";

import useFilters from "@hooks/useFilters.js";
import OfflineStorePerformFilter from "@modules/DailyReport/components/offlineStorePerformanceFilter/OfflineStorePerformFilter.jsx";
import {getPastDate} from "@helpers/dateTime.js";

import SalesPerformanceTable
    from "@modules/DailyReport/components/comparativeSalesReport/OnlineTargetsAchievement/SalesPerformanceTable.jsx";

import AClassIslamic from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamic.jsx";
import AClassFiscal
    from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import OnlineOfflineSale from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlinesaleThree.jsx";
import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";

const OfflineStorePerformList=()=>{
    const [activeTab, setActiveTab] = useState("ClassonlineFiscal");
    const date = new Date();
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1); // Subtract one day

    const today = yesterday.toISOString().split('T')[0];

    const formattedStartOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    formattedStartOfMonth.setHours(0, 0, 0, 0);
    const startOfMonth = formattedStartOfMonth.toLocaleDateString('en-CA');


    // Previous year's yesterday
    const prevYearYesterday = new Date(date);
    prevYearYesterday.setFullYear(date.getFullYear() - 1); // Set the year to previous year
    prevYearYesterday.setDate(date.getDate() - 1); // Subtract one day
    const formattedPrevYearYesterday = prevYearYesterday.toISOString().split('T')[0];

// First date of the previous year
    const prevYearStartOfMonth = new Date(date.getFullYear() - 1, date.getMonth(), 1);
    prevYearStartOfMonth.setHours(0, 0, 0, 0);
    const startOfPrevYear = prevYearStartOfMonth.toLocaleDateString('en-CA');


    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date',defaultValue: getPastDate()},
                    { name: 'startOfMonth', defaultValue: startOfMonth },
                    { name: 'startOfPrevYear', defaultValue: startOfPrevYear },
                    { name: 'prevYearYesterday', defaultValue: formattedPrevYearYesterday },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative-sales/' :
            activeTab === "Local & Global" ? '//' :
                activeTab === "AClassIslamic" ? '//' :
                    activeTab === "Online Targets Achievement" ? '//' :
                        '//',
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
            <PageHeader currentpage="Comparative Sales Report" activepage="Report"
                        mainpage="Offline Store Performance"/>

            <form onSubmit={handleSubmit(onSubmit)}>
                <ComparativeDate filters={filters} control={control} errors={errors}/>
            </form>
            <IconTabs
                tabs={[
                    {
                        id: "ClassonlineFiscal",
                        label: "A Class (Offline) & Online - Fiscal",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: (
                            <>
                                <AClassFiscal data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
                            </>
                        ),
                    },
                    {
                        id: "Local & Global",
                        label: "Online Sales - Local & Global",
                        icon: <i className='bx bx-globe'></i>,
                        content: (
                            <>
                                <OnlineOfflineSale data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
                            </>
                        ),
                    },
                    {
                        id: "AClassIslamic",
                        label: "A Class (Offline) & Online - Islamic",
                        icon: <i className='bx bx-building'></i>,
                        content: (
                            <>
                                <AClassIslamic data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
                            </>
                        ),
                    },
                    {
                        id: "Online Targets Achievement",
                        label: "Online Targets Achievement",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: (
                            <>
                                <SalesPerformanceTable data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
                            </>
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />


        </>
    );
}
export default OfflineStorePerformList