import React, { useState, useMemo, useCallback } from "react";
import IconTabs from "@components/IconTabs.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ScanBarcdeForm from "@modules/inventory-tracker/components/ScanBarcdeForm.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";

const ScanBarcodePage = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader currentpage="Inventory Tracker" />
            <IconTabs
                tabs={[
                    {
                        id: "scan_bar_code",
                        label: "Scan Barcode",
                        icon: <i className="bx bx-barcode"></i>,
                        content: (
                            <ScanBarcdeForm  activeTab={activeTab} />
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
