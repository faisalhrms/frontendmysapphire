// import React, {useCallback, useEffect, useMemo, useState} from "react";
// import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
// import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
// import IconTabs from "@components/IconTabs.jsx";
// import useFilters from "@hooks/useFilters.js";
// import { getPastDate } from "@helpers/dateTime.js";
// import AClassFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
// import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
// import OnlineSaleList from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleList.jsx";
// import AClassIslamicList from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicList.jsx";
// import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
// import { useForm } from "react-hook-form";
//
//
// const ComparativeSaleReportList = () => {
//     const [activeTab, setActiveTab] = useState("ClassonlineFiscal");
//     const formatDateToYYYYMMDD = (inputDate) => {
//         const date = new Date(inputDate);
//         if (isNaN(date)) {
//             throw new Error('Invalid date');
//         }
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };
//     const {
//         today,
//         startOfMonth,
//         formattedPrevYearYesterday,
//         startOfPrevYear,
//     } = getComparativeReportDates();
//
//
//
//
//     const {
//         control,
//         handleSubmit,
//         errors,
//         getValues,
//         setValue
//     } = useForm(
//         useMemo(() => ({
//             initialFilters: [
//                 { name: 'from_cy', defaultValue: getPastDate() },
//                 { name: 'to_cy', defaultValue: startOfMonth },
//                 { name: 'from_ly', defaultValue: startOfPrevYear },
//                 { name: 'to_ly', defaultValue: formattedPrevYearYesterday },
//             ],
//         }), [startOfMonth, startOfPrevYear, formattedPrevYearYesterday ])
//     );
//
//     const [filters, setFilters] = useState(getValues());
//
//     useEffect(()=>{
//         setValue ('from_ly', '2025-08-09');
//     },[])
//
//
//     const { data, isLoading } = useFetchWithFilters(
//         activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
//             activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
//                 activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
//                     activeTab === "Online Targets Achievement" ? '//' :
//                         '',
//         filters
//     );
//     const hideOnlyComparativePeriod =  activeTab === "AClassIslamic";
//
//     const applyFilters = (newFilters) => {
//         console.log(newFilters)
//         setFilters(newFilters);
//     };
//
//     const handleChange = (date1,date2)=>{
//
//     }
//
//
//
//     const onSubmit = useCallback((formData) => {
//         setFilters(formData);
//     }, []);
//
//     const handleTabChange = (tabId) => {
//         setActiveTab(tabId);
//     };
//     const handleClear = useCallback(() => {
//         setValue('from_cy', getPastDate());
//         setValue('to_cy', startOfMonth);
//         setValue('from_ly', startOfPrevYear);
//         setValue('to_ly', formattedPrevYearYesterday);
//     }, [startOfMonth, startOfPrevYear, formattedPrevYearYesterday, setValue]);
//
//     const showOnlyCurrentPeriod =  activeTab === "AClassIslamic";
//
//     return (
//         <>
//             <PageHeader
//                 currentpage="Comparative Sales Report"
//                 activepage="Report"
//                 mainpage="Offline Store Performance"
//             />
//
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <ComparativeDate
//                     filters={filters}
//                     handleChange={handleChange}
//                     control={control}
//                     errors={errors}
//                     onApplyFilters={applyFilters}
//                     hideOnlyComparativePeriod={hideOnlyComparativePeriod}
//                     onClear={handleClear}
//                     getFilters={getValues}
//                     setFilterValue={setValue}
//                 />
//             </form>
//
//             <IconTabs
//                 tabs={[
//                     {
//                         id: "ClassonlineFiscal",
//                         label: "A Class (Offline) & Online - Fiscal",
//                         icon: <i className='bx bx-briefcase'></i>,
//                         content: isLoading ? <LoadingSpinner/> :
//                             <AClassFiscal data={data} isLoading={isLoading} isActive={activeTab === 'ClassonlineFiscal'}
//                                           filters={filters}/>
//                     },
//                     {
//                         id: "Local & Global",
//                         label: "Online Sales - Local & Global",
//                         icon: <i className='bx bx-globe'></i>,
//                         content: isLoading ? <LoadingSpinner/> :
//                             <OnlineSaleList data={data} isLoading={isLoading} isActive={activeTab === 'Local & Global'}
//                                             filters={filters}/>
//                     },
//                     {
//                         id: "AClassIslamic",
//                         label: "A Class (Offline) & Online - Islamic",
//                         icon: <i className='bi bi-book-half'></i>,
//                         content: isLoading ? <LoadingSpinner/> : <AClassIslamicList data={data} isLoading={isLoading}
//                                                                                     isActive={activeTab === 'AClassIslamic'}
//                                                                                     filters={filters}/>
//                     },
//                     // {
//                     //     id: "Online Targets Achievement",
//                     //     label: "Online Targets Achievement",
//                     //     icon: <i className='bx bx-target-lock'></i>,
//                     //     content: isLoading ? <LoadingSpinner /> : <SalesPerformanceTable data={data} isLoading={isLoading} isActive={activeTab === 'Online Targets Achievement'} filters={filters} />
//                     // },
//                 ]}
//                 onTabChange={handleTabChange}
//             />
//         </>
//     );
// };
//
// export default ComparativeSaleReportList;
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import { getPastDate } from "@helpers/dateTime.js";
import AClassFiscal from "@modules/DailyReport/components/comparativeSalesReport/AclassFiscal/ClassOfflineOnlineFiscal.jsx";
import ComparativeDate from "@modules/DailyReport/components/comparativeSalesReport/ComparativeDate.jsx";
import OnlineSaleList from "@modules/DailyReport/components/comparativeSalesReport/OnlineSale/OnlineSaleList.jsx";
import AClassIslamicList from "@modules/DailyReport/components/comparativeSalesReport/AClassIslamic/AClassIslamicList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
import { useForm } from "react-hook-form";

const ComparativeSaleReportList = () => {
    const [activeTab, setActiveTab] = useState("ClassonlineFiscal");
    const {
        today,

        startOfMonth,
        formattedPrevYearYesterday,
        startOfPrevYear,
    } = getComparativeReportDates();

    const { control, handleSubmit, errors,   reset, getValues, setValue } = useForm(
        useMemo(() => ({
            initialFilters: [
                { name: 'from_cy', defaultValue: getPastDate() },
                { name: 'to_cy', defaultValue: startOfMonth },
                { name: 'from_ly', defaultValue: startOfPrevYear },
                { name: 'to_ly', defaultValue: formattedPrevYearYesterday },
            ],
        }), [startOfMonth, startOfPrevYear, formattedPrevYearYesterday])
    );

    const [filters, setFilters] = useState(getValues());

    useEffect(() => {
        setValue('from_ly', '2025-08-09');
    }, []);

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
            activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
                activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
                    '',
        filters
    );

    const applyFilters = (newFilters) => {
        console.log(newFilters);
        setFilters(newFilters);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };


    const handleClear = useCallback(() => {
        // Reset date range values
        reset({ startDate: "", endDate: "" });

        // Set default values for other fields using setValue
        setValue('from_cy', getPastDate());
        setValue('to_cy', startOfMonth);
        setValue('from_ly', startOfPrevYear);
        setValue('to_ly', formattedPrevYearYesterday);
    }, [startOfMonth, startOfPrevYear, formattedPrevYearYesterday, setValue, reset]);

    return (
        <>
            <PageHeader
                currentpage="Comparative Sales Report"
                activepage="Report"
                mainpage="Offline Store Performance"
            />

            <form onSubmit={handleSubmit((formData) => setFilters(formData))}>
                <ComparativeDate
                    filters={filters}
                    control={control}
                    errors={errors}
                    onApplyFilters={applyFilters}
                    onClear={handleClear} // Pass handleClear to ComparativeDate
                />
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "ClassonlineFiscal",
                        label: "A Class (Offline) & Online - Fiscal",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner /> : <AClassFiscal data={data} isLoading={isLoading} filters={filters} />
                    },
                    {
                        id: "Local & Global",
                        label: "Online Sales - Local & Global",
                        icon: <i className='bx bx-globe'></i>,
                        content: isLoading ? <LoadingSpinner /> : <OnlineSaleList data={data} isLoading={isLoading} filters={filters} />
                    },
                    {
                        id: "AClassIslamic",
                        label: "A Class (Offline) & Online - Islamic",
                        icon: <i className='bi bi-book-half'></i>,
                        content: isLoading ? <LoadingSpinner /> : <AClassIslamicList data={data} isLoading={isLoading} filters={filters} />
                    }
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ComparativeSaleReportList;
