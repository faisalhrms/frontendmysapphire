import React, { useCallback, useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import { getPastDate } from "@helpers/dateTime.js";
import AClassFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
import OnlineSaleList from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleList.jsx";
import AClassIslamicList from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";

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
        useMemo(() => ({
            initialFilters: [
                { name: 'from_cy', defaultValue: getPastDate() },
                { name: 'to_cy', defaultValue: startOfMonth },
                { name: 'from_ly', defaultValue: startOfPrevYear },
                { name: 'to_ly', defaultValue: formattedPrevYearYesterday },
            ],
        }), [startOfMonth, startOfPrevYear, formattedPrevYearYesterday])
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
            activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
                activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
                    activeTab === "Online Targets Achievement" ? '//' :
                        '',
        filters
    );
    const hideOnlyComparativePeriod =  activeTab === "AClassIslamic";

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const showOnlyCurrentPeriod =  activeTab === "AClassIslamic";

    return (
        <>
            <PageHeader
                currentpage="Comparative Sales Report"
                activepage="Report"
                mainpage="Offline Store Performance"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <ComparativeDate
                    filters={filters}
                    control={control}
                    errors={errors}
                    hideOnlyComparativePeriod={hideOnlyComparativePeriod}
                    clearFilter={() => setFilters(getFilters())}
                />
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "ClassonlineFiscal",
                        label: "A Class (Offline) & Online - Fiscal",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner/> :
                            <AClassFiscal data={data} isLoading={isLoading} isActive={activeTab === 'ClassonlineFiscal'}
                                          filters={filters}/>
                    },
                    {
                        id: "Local & Global",
                        label: "Online Sales - Local & Global",
                        icon: <i className='bx bx-globe'></i>,
                        content: isLoading ? <LoadingSpinner/> :
                            <OnlineSaleList data={data} isLoading={isLoading} isActive={activeTab === 'Local & Global'}
                                            filters={filters}/>
                    },
                    {
                        id: "AClassIslamic",
                        label: "A Class (Offline) & Online - Islamic",
                        icon: <i className='bi bi-book-half'></i>,
                        content: isLoading ? <LoadingSpinner/> : <AClassIslamicList data={data} isLoading={isLoading}
                                                                                    isActive={activeTab === 'AClassIslamic'}
                                                                                    filters={filters}/>
                    },
                    // {
                    //     id: "Online Targets Achievement",
                    //     label: "Online Targets Achievement",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: isLoading ? <LoadingSpinner /> : <SalesPerformanceTable data={data} isLoading={isLoading} isActive={activeTab === 'Online Targets Achievement'} filters={filters} />
                    // },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ComparativeSaleReportList;
