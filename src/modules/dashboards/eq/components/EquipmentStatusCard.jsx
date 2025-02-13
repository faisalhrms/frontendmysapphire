// src/modules/dashboards/equipment/components/EquipmentStatusCard.jsx

import React from 'react';
import { getStatusStyles } from "@helpers/statusStyles.js"; // Ensure this function exists and is correctly implemented
import CountUp from "react-countup";
import SvgIcon from "@components/SvgIcon.jsx";
import { toTitleCase } from "@helpers/formatters.js"; // Optional: May not be needed if labels are already formatted
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";
import InventorySvgIcon from "@components/InventorySvgIcon.jsx";

const EquipmentStatusCard = ({ item }) => {
    const { status, count } = item;
     // Define styles based on status

    // Find the status object from equipmentStatuses array
    const statusObj = equipmentStatuses.find(e => e.value === status);
    const statusLabel = statusObj ? statusObj.label : "-";
    const styles = getStatusStyles(statusLabel);
    return (
        <div className="box transition-transform transform hover:scale-105 ">
            <div className="box-body">
                <div className="flex justify-between items-center ">
                    <div>
                        <p className="  font-semibold ">
                            {statusLabel}
                        </p>
                        <p className="font-bold text-2xl ">
                            <CountUp end={count} />
                        </p>
                    </div>
                    <div>
                        <InventorySvgIcon styles={styles} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentStatusCard;
