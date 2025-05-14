// import React, { useCallback, useMemo, useState } from "react";
// import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
// import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
// import IconTabs from "@components/IconTabs.jsx";
// import useFilters from "@hooks/useFilters.js";
// import { getPastDate } from "@helpers/dateTime.js";
// import SalesPerformanceTable
//     from "@modules/DailyReport/components/comparativeSalesReport/OnlineTargetsAchievement/SalesPerformanceTable.jsx";
// import AClassFiscal
//     from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
// import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
// import OnlineSaleList from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleList.jsx";
// import AClassIslamicList
//     from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicList.jsx";
// import LoadingSpinner from "@components/LoadingSpinner.jsx"; // Import the spinner component
//
// const OfflineStorePerformList = () => {
//     const [activeTab, setActiveTab] = useState("ClassonlineFiscal");
//     const date = new Date();
//     const yesterday = new Date(date);
//     yesterday.setDate(date.getDate() - 1);
//     const today = yesterday.toISOString().split('T')[0];
//     const formattedStartOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//     formattedStartOfMonth.setHours(0, 0, 0, 0);
//     const startOfMonth = formattedStartOfMonth.toLocaleDateString('en-CA');
//     const prevYearYesterday = new Date(date);
//     prevYearYesterday.setFullYear(date.getFullYear() - 1);
//     prevYearYesterday.setDate(date.getDate() - 1);
//     const formattedPrevYearYesterday = prevYearYesterday.toISOString().split('T')[0];
//     const prevYearStartOfMonth = new Date(date.getFullYear() - 1, date.getMonth(), 1);
//     prevYearStartOfMonth.setHours(0, 0, 0, 0);
//     const startOfPrevYear = prevYearStartOfMonth.toLocaleDateString('en-CA');
//
//     const {
//         control,
//         handleSubmit,
//         errors,
//         getFilters
//     } = useFilters(
//         useMemo(
//             () => ({
//                 initialFilters: [
//                     { name: 'date', defaultValue: getPastDate() },
//                     { name: 'startOfMonth', defaultValue: startOfMonth },
//                     { name: 'startOfPrevYear', defaultValue: startOfPrevYear },
//                     { name: 'prevYearYesterday', defaultValue: formattedPrevYearYesterday },
//                 ],
//             }),
//             []
//         )
//     );
//
//     const [filters, setFilters] = useState(getFilters());
//
//     const { data, isLoading } = useFetchWithFilters(
//         activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
//             activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
//                 activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
//                     activeTab === "Online Targets Achievement" ? '//' :
//                         '//',
//         filters
//     );
//
//     const onSubmit = useCallback(
//         (formData) => {
//             setFilters(formData);
//         },
//         []
//     );
//
//     const handleTabChange = (tabId) => {
//         setActiveTab(tabId);
//     };
//
//     return (
//         <>
//             <PageHeader currentpage="Comparative Sales Report" activepage="Report"
//                         mainpage="Offline Store Performance" />
//
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <ComparativeDate filters={filters} control={control} errors={errors} />
//             </form>
//
//             <IconTabs
//                 tabs={[
//                     {
//                         id: "ClassonlineFiscal",
//                         label: "A Class (Offline) & Online - Fiscal",
//                         icon: <i className='bx bx-briefcase'></i>,
//                         content: (
//                             <>
//                                 {isLoading ? (
//                                     <LoadingSpinner />
//                                 ) : (
//                                     <AClassFiscal data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
//                                 )}
//                             </>
//                         ),
//                     },
//                     {
//                         id: "Local & Global",
//                         label: "Online Sales - Local & Global",
//                         icon: <i className='bx bx-globe'></i>,
//                         content: (
//                             <>
//                                 {isLoading ? (
//                                     <LoadingSpinner />
//                                 ) : (
//                                     <OnlineSaleList data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
//                                 )}
//                             </>
//                         ),
//                     },
//                     {
//                         id: "AClassIslamic",
//                         label: "A Class (Offline) & Online - Islamic",
//                         icon: <i className='bi bi-book-half'></i>,
//                         content: (
//                             <>
//                                 {isLoading ? (
//                                     <LoadingSpinner />
//                                 ) : (
//                                     <AClassIslamicList data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
//                                 )}
//                             </>
//                         ),
//                     },
//                     {
//                         id: "Online Targets Achievement",
//                         label: "Online Targets Achievement",
//                         icon: <i className='bx bx-target-lock'></i>,
//                         content: (
//                             <>
//                                 {isLoading ? (
//                                     <LoadingSpinner />
//                                 ) : (
//                                     <SalesPerformanceTable data={data} isLoading={isLoading} isActive={'others' === activeTab} filters={filters} />
//                                 )}
//                             </>
//                         ),
//                     },
//                 ]}
//                 onTabChange={handleTabChange}
//             />
//         </>
//     );
// };
//
// export default OfflineStorePerformList;
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


const ComparativeSaleReportList = () => {
    const [activeTab, setActiveTab] = useState("ClassonlineFiscal");


    const {
        today,
        startOfMonth,
        formattedPrevYearYesterday,
        startOfPrevYear,
    } = getComparativeReportDates ();

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

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
            activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
                activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
                    activeTab === "Online Targets Achievement" ? '/reporting/comparative/online-targets/' :
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
                <ComparativeDate filters={filters} control={control} errors={errors} />
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
                        id: "Online Targets Achievement",
                        label: "Online Targets Achievement",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: isLoading ? <LoadingSpinner /> : <SalesPerformanceTable data={data} isLoading={isLoading} isActive={activeTab === 'Online Targets Achievement'} filters={filters} />
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ComparativeSaleReportList;
