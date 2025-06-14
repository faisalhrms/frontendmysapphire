import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ScanBarcdeForm from "@modules/inventory-tracker/components/ScanBarcdeForm.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";

const ScanBarcodePage = () => {
    const [activeTab, setActiveTab] = useState("ScanBarcode");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    // const { data, isLoading } = useFetchWithFilters(
    //     activeTab === "scan_bar_code" ? '/inventory-tracker/barcode/?barcode=U3FEHE25V319'
    //     , filters
    // );
    return (
        <>
            <PageHeader currentpage="Inventory Tracker"/>

            <IconTabs
                tabs={[
                    {
                        id: "scan_bar_code",
                        label: "Scan Barcode",
                        icon: <i className="bx bx-barcode"></i>,
                        content: (
                            <ScanBarcdeForm />
                        )
                    },
                    {
                        id: "inventory_product",
                        label: "Product List",
                        icon: <i className="bx bx-list-ul"></i>,
                        content: (
                            <ProductDatatableTab />
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
