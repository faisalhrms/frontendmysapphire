import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";
import CentralReportList from "@modules/DailyReport/components/offlineStorePerformReport/CentralReportList.jsx";
import NorthReportList from "@modules/DailyReport/components/offlineStorePerformReport/NorthReportList.jsx";
import SouthReportList from "@modules/DailyReport/components/offlineStorePerformReport/SouthReportList.jsx";
import FolReportList from "@modules/DailyReport/components/offlineStorePerformReport/FolReportList.jsx";
import useFilters from "@hooks/useFilters.js";
import OfflineStorePerformFilter from "@modules/DailyReport/components/offlineStorePerformanceFilter/OfflineStorePerformFilter.jsx";

const OfflineStorePerformList=()=>{
    const [activeTab, setActiveTab] = useState("central");
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'to_date'},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

const data=[
    {
        "store_name": "Centaurus Mall, Islamabad",
        "current_year_fy2025": {
            "full_price": "48.95 m",
            "discounted": "25.06 m",
            "total": "74.01 m"
        },
        "fp_percent_of_total": "46%",
        "gp_percent": "29%",
        "gross_profit_rs": {
            "cy": "17.9 m",
            "ly": "100.22 m",
            "growth": "-82%"
        },
        "fp_growth_from_ly": {
            "qty": "-83%",
            "value": "-79%"
        },
        "total_growth_from_ly": {
            "qty": "-72%",
            "value": "-74%"
        },
        "traffic_growth": {
            "footfall_cy": "116,089",
            "conv": "9%",
            "ff_growth": "-54%",
            "conv_growth": "-36%"
        }
    },
    {
        "store_name": "Giga Mall WTC, Rawalpindi",
        "current_year_fy2025": {
            "full_price": "277.51 m",
            "discounted": "70.49 m",
            "total": "348.01 m"
        },
        "fp_percent_of_total": "67%",
        "gp_percent": "41%",
        "gross_profit_rs": {
            "cy": "120.8 m",
            "ly": "95.42 m",
            "growth": "27%"
        },
        "fp_growth_from_ly": {
            "qty": "17%",
            "value": "32%"
        },
        "total_growth_from_ly": {
            "qty": "17%",
            "value": "30%"
        },
        "traffic_growth": {
            "footfall_cy": "200,643",
            "conv": "16%",
            "ff_growth": "15%",
            "conv_growth": "-7%"
        }
    },
    {
        "store_name": "Jhangi Chowk, Abbottabad",
        "current_year_fy2025": {
            "full_price": "65.02 m",
            "discounted": "26.73 m",
            "total": "91.75 m"
        },
        "fp_percent_of_total": "55%",
        "gp_percent": "33%",
        "gross_profit_rs": {
            "cy": "25.8 m",
            "ly": "25.12 m",
            "growth": "3%"
        },
        "fp_growth_from_ly": {
            "qty": "-2%",
            "value": "14%"
        },
        "total_growth_from_ly": {
            "qty": "11%",
            "value": "15%"
        },
        "traffic_growth": {
            "footfall_cy": "69,430",
            "conv": "16%",
            "ff_growth": "14%",
            "conv_growth": "-13%"
        }
    }
]



    const isLoading=false;
    // const { data, isLoading } = useFetchWithFilters(
    //     activeTab === "central" ? '/dashboard/pms/task/statistics/' : activeTab === "north" ? '/dashboard/pms/project/tasks/statuses/' : activeTab === "south" ? '/dashboard/pms/project/tasks/priorities/' : '/dashboard/pms/statistics/', filters
    // );
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
            <PageHeader currentpage="Offline Store Performance" activepage="Report"
                        mainpage="Offline Store Performance"/>

            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <OfflineStorePerformFilter control={control} errors={errors}/>*/}
            {/*</form>*/}
            <IconTabs
                tabs={[
                    {
                        id: "central",
                        label: "Central Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <CentralReportList data={data} isLoading={isLoading} isActive={'central' === activeTab} filters={filters}/>
                        ),
                    },
                    {
                        id: "north",
                        label: "North Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <>
                                <NorthReportList data={data} isLoading={isLoading} isActive={'north' === activeTab} filters={filters}/>
                            </>
                        ),
                    },
                    {
                        id: "south",
                        label: "South Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <>
                                <SouthReportList data={data} isLoading={isLoading} isActive={'south' === activeTab} filters={filters}/>
                            </>
                        ),
                    },
                    {
                        id: "fol",
                        label: "FOL Store Performance",
                        icon: <i class='bx bx-location-plus'></i>,
                        content: (
                            <>
                                <FolReportList data={data} isLoading={isLoading} isActive={'fol' === activeTab} filters={filters}/>
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