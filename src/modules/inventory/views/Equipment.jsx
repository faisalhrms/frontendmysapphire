import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

// Component Tabs
import EquipmentList from "@modules/inventory/views/EquipmentList.jsx";
import EquipmentRepairList from "@modules/inventory/views/EquipmentRepairList.jsx";

// Lucide Icons
import { HardDrive, Wrench,Monitor } from "lucide-react";

const Equipment = () => {
    const [activeTab, setActiveTab] = useState("equipment_list");

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <IconPageHeader
                heading="Equipment"
                description="Manage all IT equipment, including current inventory and repairs"
                icon={HardDrive}
            />

            <IconTabs
                tabs={[
                    {
                        id: "equipment_list",
                        label: "Equipment List",
                        icon: <Monitor className="text-sky-400" />, // Blue for primary assets
                        content: (
                            <EquipmentList isActive={activeTab === "equipment_list"} />
                        ),
                    },
                    {
                        id: "repair_list",
                        label: "Repair List",
                        icon: <Wrench className="text-rose-500" />, // Rose for maintenance
                        content: (
                            <EquipmentRepairList isActive={activeTab === "repair_list"} />
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default Equipment;
