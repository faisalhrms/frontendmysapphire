import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

import ScanBarcdeForm from "@modules/inventory-tracker/components/ScanBarcdeForm.jsx";


const ScanBarcodePage = () => {
    const [activeTab, setActiveTab] = useState("ScanBarcode");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader currentpage="ScanBarCode" activepage="barcode" mainpage="ScanBarCode"/>

        <IconTabs
            tabs={[
                {
                    id: "ScanBarcode",
                    label: "Scan Barcode",
                    icon: <i className="bx bx-barcode"></i>,
                    content :
                        <ScanBarcdeForm

                        />
                }
            ]}
            onTabChange={handleTabChange}
        />
        </>
    );
};

export default ScanBarcodePage;
