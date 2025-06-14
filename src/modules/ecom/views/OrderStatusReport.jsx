import React, { useState, useMemo, useCallback } from "react";
import IconTabs from "@components/IconTabs.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ScanBarcdeForm from "@modules/inventory-tracker/components/ScanBarcdeForm.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import useFilters from "@hooks/useFilters.js";
import OrderStatusDate from "@modules/ecom/components/order-status/OrderStatusDate.jsx";
import WeeklyReportFilter from "@modules/ecom/components/weekly-report/WeeklyReportFilter.jsx";

const OrderStatusReport = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");


    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(() => ({
            initialFilters: [
                {}
            ]
        }), [])
    );


    const [filters, setFilters] = useState(getFilters());


    // const { data, isLoading } = useFetchWithFilters(
    //     activeTab === "scan_bar_code" ? `/inventory-tracker/barcode/?barcode=U3FEHE25V319` :
    //         '',
    //     filters
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
            <PageHeader currentpage="Order Status Report"/>

            <form onSubmit={handleSubmit(onSubmit)}>
                <OrderStatusDate filters={filters} control={control} errors={errors} activeTab={activeTab}/>
            </form>

            <IconTabs
                tabs={[
                    // {
                    //     id: "scan_bar_code",
                    //     label: "Scan Barcode",
                    //     icon: <i className="bx bx-barcode"></i>,
                    //     content: (
                    //         <ScanBarcdeForm data={data} isLoading={isLoading} />
                    //     )
                    // },
                    // {
                    //     id: "inventory_product",
                    //     label: "Product List",
                    //     icon: <i className="bx bx-list-ul"></i>,
                    //     content: (
                    //         <ProductDatatableTab  />
                    //     )
                    // }
                ]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default OrderStatusReport;
