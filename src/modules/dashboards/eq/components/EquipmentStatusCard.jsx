import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { getStatusStyles } from "@helpers/statusStyles.js";
import CountUp from "react-countup";
import InventorySvgIcon from "@components/InventorySvgIcon.jsx";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";

const EquipmentStatusCard = ({ item, currentFilters }) => {
    const navigate = useNavigate();
    const location = useLocation();
const{count}=item;
    const statusObj = equipmentStatuses.find(e => e.value === item.status);
    const statusLabel = statusObj ? statusObj.label : "-";
    const styles = getStatusStyles(statusLabel);

    const handleCardClick = () => {
        const params = new URLSearchParams(location.search);
        params.set('status', item.status);

        // Preserve all existing filters
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value && key !== 'status') params.set(key, value);
        });

        navigate(`/module/asset?${params.toString()}`);
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
