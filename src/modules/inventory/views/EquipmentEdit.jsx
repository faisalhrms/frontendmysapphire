import React from 'react';
import { useParams } from 'react-router-dom';

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

import {useEquipment} from "@modules/inventory/hooks/inventoryHooks.js";

import InventoryForm from "@modules/inventory/components/EquipmentForm.jsx";

const EquipmentEdit = () => {
    const { id } = useParams();
    const {equipmentData}=useEquipment(id)
    return (
        <div>
            <PageHeader currentpage='Edit Asset' activepage="Asset" mainpage="Edit Asset"/>
            {equipmentData&&(
                <InventoryForm equipmentData={equipmentData} isEditMode={true} />
            )
            }
        </div>
    );
};

export default EquipmentEdit;
