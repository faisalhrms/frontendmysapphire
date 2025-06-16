import React, { useState, useMemo, useCallback } from "react";
import IconTabs from "@components/IconTabs.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ScanBarcdeForm from "@modules/inventory-tracker/components/ScanBarcdeForm.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import useFilters from "@hooks/useFilters.js";

const ScanBarcodePage = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");


    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: 'barcode', defaultValue: '' },
                { name: 'status', defaultValue: null },
                { name: 'category', defaultValue: null }
            ]
        }), [])
    );


    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading } = useFetchWithFilters(
        (activeTab === "scan_bar_code" && filters?.barcode!=='') ? `/inventory-tracker/barcode/` :
         '',
        filters
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
            <PageHeader currentpage="Inventory Tracker" />

            <form onSubmit={handleSubmit(onSubmit)}>

            </form>

            <IconTabs
                tabs={[
                    {
                        id: "scan_bar_code",
                        label: "Scan Barcode",
                        icon: <i className="bx bx-barcode"></i>,
                        content: (
                            <ScanBarcdeForm data={data} isLoading={isLoading} setFilters={setFilters} filters={filters} />
                        )
                    },
                    {
                        id: "inventory_product",
                        label: "Product List",
                        icon: <i className="bx bx-list-ul"></i>,
                        content: (
                            <ProductDatatableTab  />
                        )
                    }
                ]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default ScanBarcodePage;
