
import React, { useCallback, useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";

import SalesPerformanceTable from "@modules/DailyReport/components/comparativeSalesReport/OnlineTargetsAchievement/SalesPerformanceTable.jsx";
import AClassFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
import OnlineSaleList from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleList.jsx";
import AClassIslamicList from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
import OnlineStitiched
    from "@modules/DailyReport/components/comparativeSalesReport/StitichedOnline/StitichedOnline.jsx";
import OfflineStitiched
    from "@modules/DailyReport/components/comparativeSalesReport/StitichedOffline/OfflineStitiched.jsx";
import OnlineUnstitiched
    from "@modules/DailyReport/components/comparativeSalesReport/OnlineUnstitiched/UnstitichedOnline.jsx";
import Unstitiched from "@modules/DailyReport/components/comparativeSalesReport/OfflineUnstitiched/Unstitiched.jsx";

const ComparativeSaleReportList = () => {
    const [activeTab, setActiveTab] = useState("ClassonlineFiscal");


    const {
        today,
        startOfMonth,
        formattedPrevYearYesterday,
        startOfPrevYear,
    } = getComparativeReportDates();

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date', defaultValue: getPastDate() },
                    { name: 'startOfMonth', defaultValue: startOfMonth },
                    { name: 'startOfPrevYear', defaultValue: startOfPrevYear },
                    { name: 'prevYearYesterday', defaultValue: formattedPrevYearYesterday },
                ],
            }),
            [startOfMonth, startOfPrevYear, formattedPrevYearYesterday]
        )
    );

    const [filters, setFilters] = useState(getFilters());
    const hideOnlyComparativePeriod = activeTab === "AClassIslamic";
    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
            activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
                activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
                    activeTab === "online_target" ? '/reporting/comparative/online-target/' :
                        activeTab === "offline_unstitiched" ? '/reporting/comparative/category/Offline/Unstitched Women/Full Price/' :
                            activeTab === "online_unstitiched" ? '/reporting/comparative/category/Online/Unstitched Women/Full Price/' :
                                activeTab === "offline_stitiched" ? '//' :
                                    activeTab === "online_stitiched" ? '//' :
                        '',
        filters
    );

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader
                currentpage="Comparative Sales Report"
                activepage="Report"
                mainpage="Offline Store Performance"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <ComparativeDate filters={filters} control={control} errors={errors}
                                 hideOnlyComparativePeriod={hideOnlyComparativePeriod}/>
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "ClassonlineFiscal",
                        label: "A Class (Offline) & Online - Fiscal",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner /> : <AClassFiscal data={data} isLoading={isLoading} isActive={activeTab === 'ClassonlineFiscal'} filters={filters} />
                    },
                    {
                        id: "Local & Global",
                        label: "Online Sales - Local & Global",
                        icon: <i className='bx bx-globe'></i>,
                        content: isLoading ? <LoadingSpinner /> : <OnlineSaleList data={data} isLoading={isLoading} isActive={activeTab === 'Local & Global'} filters={filters} />
                    },
                    {
                        id: "AClassIslamic",
                        label: "A Class (Offline) & Online - Islamic",
                        icon: <i className='bi bi-book-half'></i>,
                        content: isLoading ? <LoadingSpinner /> : <AClassIslamicList data={data} isLoading={isLoading} isActive={activeTab === 'AClassIslamic'} filters={filters} />
                    },
                    {
                        id: "online_target",
                        label: "Online Targets Achievement",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'online_target' ? (isLoading ? <LoadingSpinner /> : <SalesPerformanceTable data={data} isLoading={isLoading} isActive={activeTab === 'online_target'} filters={filters} />) : ''
                    },
                    {
                        id: "offline_unstitiched",
                        label: " Offline (A-Class) - Unstitiched - Full Price Sales",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'offline_unstitiched' ? (isLoading ? <LoadingSpinner /> : <Unstitiched data={data} isLoading={isLoading} isActive={activeTab === 'offline_unstitiched'} filters={filters} />) : ''
                    },
                    {
                        id: "online_unstitiched",
                        label: "Online - Unstitiched - Full Price Sales",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'online_unstitiched' ? (isLoading ? <LoadingSpinner /> : <OnlineUnstitiched data={data} isLoading={isLoading} isActive={activeTab === 'online_unstitiched'} filters={filters} />) : ''
                    },
                    {
                        id: "offline_stitiched",
                        label: "Offline (A-Class) - Stitiched - Full Price Sales",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'offline_stitiched' ? (isLoading ? <LoadingSpinner /> : <OfflineStitiched data={data} isLoading={isLoading} isActive={activeTab === 'offline_stitiched'} filters={filters} />) : ''
                    },
                    {
                        id: "online_stitiched",
                        label: "Online - Stitiched - Full Price Sales",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'online_stitiched' ? (isLoading ? <LoadingSpinner /> : <OnlineStitiched data={data} isLoading={isLoading} isActive={activeTab === 'online_stitiched'} filters={filters} />) : ''
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ComparativeSaleReportList;