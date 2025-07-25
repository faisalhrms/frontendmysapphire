import React, { useState } from "react";
import IconTabs from "@components/IconTabs.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import EquipmentList from "@modules/inventory/views/EquipmentList.jsx";
import EquipmentRepairList from "@modules/inventory/views/EquipmentRepairList.jsx";
import { HardDrive, Wrench,Monitor } from "lucide-react";
import {useSearchParams} from "react-router-dom";
const DEFAULT_TAB = "equipment_list";

const externalFilters = [
    'company_id',
    'department_id',
    'location_id',
    'equipment_site_id',
    'equipment_type_id',
    'custodian_id',
    'status'
]
const Equipment = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || DEFAULT_TAB;

    const handleTabChange = (tabId) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams();
            externalFilters.forEach((key) => {
                const value = prev.get(key);
                if (value !== null) {
                    newParams.set(key, value);
                }
            });
            newParams.set("tab", tabId);
            return newParams;
        });
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
                        icon: <Monitor className="text-sky-400" />,
                        content: (
                            <EquipmentList isActive={activeTab === "equipment_list"} externalFilters={externalFilters} />
                        ),
                    },
                    {
                        id: "repair_list",
                        label: "Repair List",
                        icon: <Wrench className="text-rose-500" />,
                        content: (
                            <EquipmentRepairList isActive={activeTab === "repair_list"} externalFilters={externalFilters} />
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
};

export default Equipment;
