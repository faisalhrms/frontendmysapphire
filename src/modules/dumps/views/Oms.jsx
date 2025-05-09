import React, {useCallback, useMemo, useState} from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import IconTabs from "@components/IconTabs.jsx";

import useFilters from "@hooks/useFilters.js";
import OfflineStorePerformFilter from "@modules/DailyReport/components/offlineStorePerformanceFilter/OfflineStorePerformFilter.jsx";
import {getPastDate} from "@helpers/dateTime.js";
import OrderSummary from "@modules/dumps/component/oms/OrderSummary.jsx";

const  Oms =()=>{
    const [activeTab, setActiveTab] = useState("Order");
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

    // const { data, isLoading } = useFetchWithFilters(
    //     activeTab === "central" ? '/reporting/offline-store-performance/central/' :
    //         activeTab === "north" ? '/reporting/offline-store-performance/north/' :
    //             activeTab === "south" ? '/reporting/offline-store-performance/south/' :
    //                 activeTab === "others" ? '/reporting/offline-store-performance/others/' :
    //                     '/reporting/offline-store-performance/fol/', filters
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
            <PageHeader currentpage="Oms Order Summary" activepage="Oms"
                        mainpage="Order Summary"/>

            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <OfflineStorePerformFilter filters={filters} control={control} errors={errors}/>*/}
            {/*</form>*/}

            <IconTabs
                tabs={[
                    {
                        id: "Order",
                        label: "Order Summary",
                        icon: <i className="bx bx-location-plus"></i>,
                        content: (
                            <OrderSummary disActive={'Order' === activeTab}
                                              />
                        ),
                    },

                ]}
                onTabChange={handleTabChange}
            />

        </>
    );
}
export default  Oms