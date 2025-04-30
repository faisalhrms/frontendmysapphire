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
import OthersReportList from "@modules/DailyReport/components/offlineStorePerformReport/OthersReportList.jsx";
import {getPastDate} from "@helpers/dateTime.js";

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
                    { name: 'date',defaultValue: getPastDate()},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "central" ? '/reporting/offline-store-performance/central/' :
            activeTab === "north" ? '/reporting/offline-store-performance/north/' :
                activeTab === "south" ? '/reporting/offline-store-performance/south/' :
                    activeTab === "others" ? '/reporting/offline-store-performance/others/' :
                        '/reporting/offline-store-performance/fol/', filters
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
            <PageHeader currentpage="Offline Store Performance" activepage="Report"
                        mainpage="Offline Store Performance"/>

            <form onSubmit={handleSubmit(onSubmit)}>
                <OfflineStorePerformFilter control={control} errors={errors}/>
            </form>

            <IconTabs
                tabs={[
                    {
                        id: "central",
                        label: "Central Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <CentralReportList data={data} isLoading={isLoading} isActive={'central' === activeTab}
                                               filters={filters}/>
                        ),
                    },
                    {
                        id: "north",
                        label: "North Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <>
                                <NorthReportList data={data} isLoading={isLoading} isActive={'north' === activeTab}
                                                 filters={filters}/>
                            </>
                        ),
                    },
                    {
                        id: "south",
                        label: "South Store Performance",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <>
                                <SouthReportList data={data} isLoading={isLoading} isActive={'south' === activeTab}
                                                 filters={filters}/>
                            </>
                        ),
                    },
                    {
                        id: "fol",
                        label: "FOL Store Performance",
                        icon: <i className='bx bx-location-plus'></i>,
                        content: (
                            <>
                                <FolReportList data={data} isLoading={isLoading} isActive={'fol' === activeTab}
                                               filters={filters}/>
                            </>
                        ),
                    },
                    {
                        id: "others",
                        label: "Other Store Performance",
                        icon: <i className='bx bx-location-plus'></i>,
                        content: (
                            <>
                                <OthersReportList data={data} isLoading={isLoading} isActive={'others' === activeTab}
                                               filters={filters}/>
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