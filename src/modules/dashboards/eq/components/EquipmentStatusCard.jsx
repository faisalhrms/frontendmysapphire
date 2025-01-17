// src/modules/dashboards/equipment/components/EquipmentStatusCard.jsx

import React from 'react';
import { getStatusStyles } from "@helpers/statusStyles.js"; // Ensure this function exists and is correctly implemented
import CountUp from "react-countup";
import SvgIcon from "@components/SvgIcon.jsx";
import { toTitleCase } from "@helpers/formatters.js"; // Optional: May not be needed if labels are already formatted
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";

const EquipmentStatusCard = ({ item }) => {
    const { status, count } = item;
     // Define styles based on status

    // Find the status object from equipmentStatuses array
    const statusObj = equipmentStatuses.find(e => e.value === status);
    const statusLabel = statusObj ? statusObj.label : "-";
    const styles = getStatusStyles(statusLabel);
    return (
        <div className="box">
            <div className="box-body">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-bold">
                            {statusLabel}
                        </p>
                        <p className="text-2xl font-semibold">
                            <CountUp end={count} />
                        </p>
                    </div>
                    <div>
                        <SvgIcon styles={styles} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentStatusCard;
