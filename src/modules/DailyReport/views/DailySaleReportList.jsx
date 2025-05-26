import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";

import useFilters from "@hooks/useFilters.js";

import {getPastDate} from "@helpers/dateTime.js";

import OnlineDate from "@modules/DailyReport/components/DailySalesReport/OnlineDate.jsx";
import StoreWise from "@modules/DailyReport/components/DailySalesReport/WiseSide.jsx";
import DailyTargetAchievementOnline
    from "@modules/DailyReport/components/DailySalesReport/DailyTargetAchievementOnline.jsx";
import CYVsLYGrowth from "@modules/DailyReport/components/DailySalesReport/CYVsLYGrowth.jsx";
import OnlineGrossSaleBeforeReturn
    from "@modules/DailyReport/components/DailySalesReport/ OnlineGrossSaleBeforeReturn.jsx";
import DailySalesReportStoreWise from "@modules/DailyReport/components/DailySalesReport/DailySalesReportStoreWise.jsx";
const OfflineStorePerformList=()=>{
    const [activeTab, setActiveTab] = useState("DailySaleReportList");
    const [expand, setExpand] = useState(true);
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'p_date', defaultValue: getPastDate(1) },
                    { name: 'date_from', defaultValue: getPastDate(1) },
                    { name: 'date_to', defaultValue: getPastDate(1) },
                ],

            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const pType = "last_day";

    const endpoint = activeTab === "DailySaleReportList" ? '/reporting/fetch_store_wise_sale_data/' :
        activeTab === "OnlineAndBM" ? '/reporting/fetch_target_sale_data/' :
            activeTab === "Return" ? '/reporting/fetch_sale_cv_vs_ly_data/' :
                activeTab === "GrossReturn" ? '/reporting/fetch_gross_sale_bf_return/' :
                    activeTab==="DailySales"?'/reporting/fetch_sale_mtd_ld_data/':'';



    let data, isLoading, error;

    if (activeTab === "DailySales") {
        const {
            data: lastDayData,
            isLoading: loadingLastDay,
            error: errorLastDay,
        } =  activeTab === "DailySales"&&useFetchWithFilters(endpoint, { ...filters, p_type: "last_day" });

        data = lastDayData;
        isLoading = loadingLastDay ;
        error = errorLastDay;
    } else {
        const {
            data: otherData,
            isLoading: loadingOther,
            error: errorOther,
        } = useFetchWithFilters(endpoint, filters, activeTab !== "DailySales");

        data = otherData;
        isLoading = loadingOther;
        error = errorOther;
    }
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
            <PageHeader currentpage="Daily Sales Report" activepage="Report"
                        mainpage="Daily Sales Report"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OnlineDate filters={filters} control={control} errors={errors} activeTab={activeTab} expand={expand} setExpand={setExpand} />
            </form>


            <IconTabs
                tabs={[
                    {
                        id: "DailySaleReportList",
                        label: "Store Wise",
                        icon: <i className="bx bx-store"></i>,

                        content: (
                            <StoreWise {...{filters, newData: data || {}, loading: isLoading , expand}} />
                        ),
                    },
                    {
                        id: "OnlineAndBM",
                        label: "Daily Target Achievement",
                        icon: <i className="bx bx-target-lock"></i>,
                        content: (


                            <DailyTargetAchievementOnline
                                data={data || []}
                                loading={isLoading}
                            />
                        ),
                    },
                    {
                        id: "Return",
                        label: "CY Vs LY Growth",
                        icon: <i className="bx bx-line-chart"></i>,
                        content: (
                            <CYVsLYGrowth
                                data={data || []}
                                loading={isLoading}
                            />
                        ),
                    },
                    {
                        id: "GrossReturn",
                        label: "Online(Gross Sale before return)",
                        icon: <i className="bx bx-cloud-download"></i>,
                        content: (
                            <OnlineGrossSaleBeforeReturn
                                data={data || []}
                                loading={isLoading}
                            />
                        ),
                    },
                    {
                        id: "DailySales",
                        label: "Daily Sales Report - store wise",
                        icon: <i className="bx bx-spreadsheet"></i>,
                        content: (
                            <DailySalesReportStoreWise
                                lastDayData={data || []}
                                mtdData={data || []}
                                loading={isLoading}
                                expand={expand}

                            />

                        ),
                    },
                ]}
                onTabChange={handleTabChange}

            />
        </>
    );
}
export default OfflineStorePerformList