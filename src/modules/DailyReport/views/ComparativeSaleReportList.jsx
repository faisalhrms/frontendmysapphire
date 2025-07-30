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
import Unstitiched from "@modules/DailyReport/components/comparativeSalesReport/OfflineUnstitiched/Unstitiched.jsx";
import StoreWiseFootFallIslamic
    from "@modules/DailyReport/components/comparativeSalesReport/StoreWiseFootFallConverion/StoreWiseFootFallIslamic.jsx";
import ConversionLocal
    from "@modules/DailyReport/components/comparativeSalesReport/Conversion(Local)basedSalesForce/ConversionLocal.jsx";
import ConversionGlobal
    from "@modules/DailyReport/components/comparativeSalesReport/Conversion(Global)BasedShopify/Conversion(Global)Shopify.jsx";
import StoreWiseFootFallFiscal
    from "@modules/DailyReport/components/comparativeSalesReport/StoreWiseFootFallConverion-(Fiscal)/StoreWiseFootFallFiscal.jsx";

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
        getFilters,
        setValue,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'cy_from', defaultValue: startOfMonth },
                    { name: 'cy_to', defaultValue:  getPastDate()},
                    { name: 'ly_from', defaultValue: startOfPrevYear },
                    { name: 'ly_to', defaultValue: formattedPrevYearYesterday },
                    { name: 'category', defaultValue: 'Fragrance'},
                    { name: 'group', defaultValue: 'Offline'},
                    { name: 'sale_type', defaultValue: 'Full Price'},
                ],
            }),
            [startOfMonth, startOfPrevYear, formattedPrevYearYesterday]
        )
    );


    const [filters, setFilters] = useState(getFilters());


    const hideOnlyComparativePeriod = [
        "AClassIslamic",
        "online_target",
        "store_islamic"
        // "store_fiscal"

    ].includes(activeTab);
    const { data, isLoading } = useFetchWithFilters(
        activeTab === "ClassonlineFiscal" ? '/reporting/comparative/fiscal-sales/' :
            activeTab === "Local & Global" ? '/reporting/comparative/online-sales/' :
                activeTab === "AClassIslamic" ? '/reporting/comparative/islamic-sales/' :
                    activeTab === "online_target" ? '/reporting/comparative/online-target/' :
                        activeTab === "offline_unstitiched" ? '/reporting/comparative/category/Offline/Unstitched Women/Full Price/' :
                            activeTab === "online_unstitiched" ? '/reporting/comparative/category/Online/Unstitched Women/Full Price/' :
                                activeTab === "offline_stitiched" ? '/reporting/comparative/category/Offline/Stitched Women/Full Price/' :
                                    activeTab === "online_stitiched" ? '/reporting/comparative/category/Online/Stitched Women/Full Price/' :
                                    activeTab === "other_category" ? `/reporting/comparative/category/${filters.group}/${filters.category}/${filters.sale_type}/` :
                                        activeTab === "store_islamic" ? '/reporting/comparative/foot-fall/islamic/' :
                                            activeTab === "store_fiscal" ? '/reporting/comparative/foot-fall/gregorian/' :
                                                activeTab === "conversion_local" ? '/reporting/comparative/conversion/local/' :
                                                activeTab === "conversion_global" ? '' :



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
                                 hideOnlyComparativePeriod={hideOnlyComparativePeriod}
                                 showCategoryFilters={activeTab === 'other_category'}
                                 setValue={setValue}
                />
            </form>


            <IconTabs

                tabs={[

                    {
                        id: "ClassonlineFiscal",
                        label: " Offline (A Class) & Online - Fiscal",
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
                        label: "Offline  (A Class) & Online - Islamic",
                        icon: <i className='bi bi-book-half'></i>,
                        content: isLoading ? <LoadingSpinner/> : <AClassIslamicList data={data} isLoading={isLoading}
                                                                                    isActive={activeTab === 'AClassIslamic'}
                                                                                    filters={filters}/>
                    },
                    {
                        id: "online_target",
                        label: "Online Targets Achievement",
                        icon: <i className='bx bx-target-lock'></i>,
                        content: activeTab === 'online_target' ? (isLoading ? <LoadingSpinner/> :
                            <SalesPerformanceTable data={data} isLoading={isLoading}
                                                   isActive={activeTab === 'online_target'} filters={filters}/>) : ''
                    },
                    // {
                    //     id: "offline_unstitiched",
                    //     label: " Offline (A-Class) - Unstitiched - Full Price Sales",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: activeTab === 'offline_unstitiched' ? (isLoading ? <LoadingSpinner/> :
                    //         <Unstitiched color='text-red' title='Unstitiched Women' data={data} isLoading={isLoading}
                    //                      isActive={activeTab === 'offline_unstitiched'} filters={filters}/>) : ''
                    // },
                    // {
                    //     id: "online_unstitiched",
                    //     label: "Online - Unstitiched - Full Price Sales",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: activeTab === 'online_unstitiched' ? (isLoading ? <LoadingSpinner/> :
                    //         <Unstitiched color='text-red' title='Unstitiched Women' data={data} isLoading={isLoading}
                    //                      isActive={activeTab === 'online_unstitiched'} filters={filters}/>) : ''
                    // },
                    // {
                    //     id: "offline_stitiched",
                    //     label: "Offline (A-Class) - Stitiched - Full Price Sales",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: activeTab === 'offline_stitiched' ? (isLoading ? <LoadingSpinner/> :
                    //         <Unstitiched color='text-emerald-600' title='Stitiched Women' data={data}
                    //                      isLoading={isLoading} isActive={activeTab === 'offline_stitiched'}
                    //                      filters={filters}/>) : ''
                    // },
                    // {
                    //     id: "online_stitiched",
                    //     label: "Online - Stitiched - Full Price Sales",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: activeTab === 'online_stitiched' ? (isLoading ? <LoadingSpinner/> :
                    //         <Unstitiched color='text-emerald-600' data={data} title='Stitiched Women'
                    //                      isLoading={isLoading} isActive={activeTab === 'online_stitiched'}
                    //                      filters={filters}/>) : ''
                    // },
                    // {
                    //     id: "other_category",
                    //     label: "Other Category - Sales",
                    //     icon: <i className='bx bx-target-lock'></i>,
                    //     content: activeTab === 'other_category' ? (isLoading ? <LoadingSpinner/> :
                    //         <Unstitiched color='text-emerald-600' data={data} title={filters.category}/>) : ''
                    // },
                    {
                        id: "conversion_local",
                        label: "Conversion based on Sales Force Report-Local",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner/> :
                            <ConversionLocal  data={data} isLoading={isLoading}
                                              filters={filters} />

                    },
                    {
                        id: "store_fiscal",
                        label: "Store Wise Foot Fall and Converion-Fiscal",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner/> :
                            <StoreWiseFootFallFiscal data={data} isLoading={isLoading}
                                                     isActive={activeTab === 'store_fiscal'}
                                                     filters={filters} />

                    },
                    {
                        id: "store_islamic",
                        label: "Store Wise Foot Fall and Converion-Islamic",
                        icon: <i className='bx bx-briefcase'></i>,
                        content: isLoading ? <LoadingSpinner/> :
                            <StoreWiseFootFallIslamic data={data} isLoading={isLoading}
                                                      isActive={activeTab === 'store_islamic'}
                                                      filters={filters} />

                    },


                    // {
                    //     id: "conversion_global",
                    //     label: "Conversion (Global) based on Sales Force Report",
                    //     icon: <i className='bx bx-briefcase'></i>,
                    //     content: isLoading ? <LoadingSpinner/> :
                    //         <ConversionGlobal/>
                    //
                    // },

                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ComparativeSaleReportList;