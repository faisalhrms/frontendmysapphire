import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import ScanBarcode from "@modules/inventory-tracker/components/ScanBarcode.jsx";
import ProductDatatableTab from "@modules/inventory-tracker/components/ProductList.jsx";
import { Package ,Monitor, Smartphone } from "lucide-react";

import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {useObjectiveDetail} from "@modules/employee-self-services/objectives/hooks/useObjectiveDetail.js";

const InventoryTracker = () => {
    const [activeTab, setActiveTab] = useState("scan_bar_code");
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };
    const { data, isLoading, refetch, isRefetching, isError, error } = useObjectiveDetail;

    return (
        <>
            <IconPageHeader
                heading="Inventory Tracker"
                description="Search for products by barcode"
                icon={Package}
                children={
                    <div className="flex items-center space-x-2">
                        <div className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={() => refetch()}
                                className="p-2 rounded-xl group"
                                disabled={isRefetching}
                            >
                                <a
                                    href="https://be.mysapphire.co/media/uploads/2025/08/28/Inventory_Tracker_Web_Portal_Training_Video_-_Made_with_Clipchamp.mp4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90"
                                >
                                    <Monitor className="w-4 h-4"/>
                                    Web  Tracker
                                </a>
                                <a
                                    href="https://be.mysapphire.co/media/uploads/2025/08/28/Inventory_Tracker_Mobile_App_Training_Video.mp4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 ml-2"
                                >
                                    <Smartphone className="w-4 h-4"/>
                                    Mobile Tracker
                                </a>
                            </button>
                        </div>
                    </div>
                }
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
