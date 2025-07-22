import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import OnlineDate from "@modules/DailyReport/components/DailySalesReport/OnlineDate.jsx";
import StoreWise from "@modules/DailyReport/components/DailySalesReport/WiseSide.jsx";
import DailyTargetAchievementOnline from "@modules/DailyReport/components/DailySalesReport/DailyTargetAchievementOnline.jsx";
import CYVsLYGrowth from "@modules/DailyReport/components/DailySalesReport/CYVsLYGrowth.jsx";
import OnlineGrossSaleBeforeReturn from "@modules/DailyReport/components/DailySalesReport/ OnlineGrossSaleBeforeReturn.jsx";
import DailySalesReportStoreWise from "@modules/DailyReport/components/DailySalesReport/DailySalesReportStoreWise.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";


const DailySaleReportList = () => {
    const getTodayDate = () => new Date().toISOString().slice(0, 10);
    const getYesterdayDate = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };
    const {
        control, handleSubmit, errors, getFilters, setValue,
    } = useFilters(useMemo(() => ({
        initialFilters: [{name: 'p_date', defaultValue: getPastDate()}, {
            name: 'date_from',
            defaultValue: getYesterdayDate()
        }, {name: 'date_to', defaultValue: getTodayDate()}, {name: 'p_type', defaultValue: 'last_day'},],

    }), []));

    // const { control, handleSubmit, errors, getFilters } = useFilters(
    //     useMemo(
    //         () => ({
    //             initialFilters: [
    //                 { name: "date_from", defaultValue: getYesterdayDate() },
    //                 { name: "date_to", defaultValue: getTodayDate() },
    //             ],
    //         }),
    //         []
    //     )
    // );


    const [activeTab, setActiveTab] = useState("DailySaleReportList");
    const [expand, setExpand] = useState(true);

    const [filters, setFilters] = useState(getFilters());

    const {
        data,
        isLoading
    } = useFetchWithFilters(activeTab === "DailySaleReportList" ? '/reporting/fetch_store_wise_sale_data/' : activeTab === "OnlineAndBM" ? '/reporting/fetch_target_sale_data/' : activeTab === "Return" ? '/reporting/fetch_sale_cv_vs_ly_data/' : activeTab === "GrossReturn" ? '/reporting/fetch_gross_sale_bf_return/' : activeTab === "DailySales" ? '/reporting/fetch_sale_mtd_ld_data/' : '', filters)

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };


    return (
        <>
            <PageHeader currentpage="Daily Sales Report" activepage="Report" mainpage="Daily Sales Report"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OnlineDate filters={filters} control={control} errors={errors} activeTab={activeTab} expand={expand} setExpand={setExpand}/>
            </form>


            <IconTabs
                tabs={[{
                    id: "DailySaleReportList", label: "Store Wise", icon: <i className="bx bx-store"></i>,

                    content: (<StoreWise {...{filters, newData: data || {}, loading: isLoading, expand}} />),
                }, {
                    id: "OnlineAndBM",
                    label: "Daily Target Achievement",
                    icon: <i className="bx bx-target-lock"></i>,
                    content : isLoading ? <LoadingSpinner/> :
                        <DailyTargetAchievementOnline
                            data={data || []}
                            isLoading={isLoading}
                            isActive={'OnlineAndBM' === activeTab}
                        />
                }, {
                    id: "Return",
                    label: "CY Vs LY Growth",
                    icon: <i className="bx bx-line-chart"></i>,
                    content: isLoading ? <LoadingSpinner/> :
                        <CYVsLYGrowth
                            data={data || []}
                            isLoading={isLoading}
                            isActive={'Return' === activeTab}
                        />
                }, {
                    id: "GrossReturn",
                    label: "Online(Gross Sale before return)",
                    icon: <i className="bx bx-cloud-download"></i>,
                    content:  <OnlineGrossSaleBeforeReturn
                        data={data || []}
                        isLoading={isLoading}
                        isActive={'GrossReturn' === activeTab}
                    />
                },  {
                    id: "DailySales",
                    label: "Daily Sales Report - store wise",
                    icon: <i className="bx bx-spreadsheet"></i>,
                    content: isLoading ? <LoadingSpinner/> :
                        <DailySalesReportStoreWise
                            lastDayData={data}
                            isLoading={isLoading}
                            expand={expand}
                            filters={{...filters, p_type: 'MTD'}}
                            activeTab={activeTab}
                        />


                },]}
                onTabChange={handleTabChange}
            />
        </>);
};

export default  DailySaleReportList