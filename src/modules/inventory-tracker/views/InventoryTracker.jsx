import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import ScanBarcode from "@modules/inventory-tracker/components/ScanBarcode.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import { Package } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const InventoryTracker = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <IconPageHeader
                heading="Inventory Tracker"
                description="Search for products by barcode"
                icon={Package}
            />
            <IconTabs
                    tabs={[
                        {
                            id: "scan_bar_code",
                            label: "Search Barcode",
                            icon: <i className="bx bx-barcode"></i>,
                            content: (
                                <ScanBarcode isActive={activeTab === 'scan_bar_code'}/>
                            )
                        },
                        {
                            id: "inventory_product",
                            label: "Product List",
                            icon: <i className="bx bx-list-ul"></i>,
                            content: (
                                <ProductDatatableTab isActive={activeTab === 'inventory_product'}/>
                            )
                        }
                    ]}
                    onTabChange={handleTabChange}
                />
            </>
            );
};

export default InventoryTracker;
