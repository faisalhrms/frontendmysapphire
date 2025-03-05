import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusStyles } from "@helpers/statusStyles.js";
import CountUp from "react-countup";
import InventorySvgIcon from "@components/InventorySvgIcon.jsx";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";

const EquipmentStatusCard = ({ item }) => {
    const { status, count } = item;
    const navigate = useNavigate();

    const statusObj = equipmentStatuses.find(e => e.value === status);
    const statusLabel = statusObj ? statusObj.label : "-";
    const styles = getStatusStyles(statusLabel);

    const handleCardClick = () => {
        // Navigate to the EquipmentList page with the selected status as a query parameter
        navigate(`/module/equipment?status=${status}`);
    };

    return (
        <div className="box transition-transform transform hover:scale-105 cursor-pointer" onClick={handleCardClick}>
            <div className="box-body">
                <div className="flex justify-between items-center ">
                    <div>
                        <p className="font-semibold">
                            {statusLabel}
                        </p>
                        <p className="font-bold text-2xl">
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
