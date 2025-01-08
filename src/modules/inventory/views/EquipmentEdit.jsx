import React from 'react';
import { useParams } from 'react-router-dom';

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

import {useEquipment} from "@modules/inventory/hooks/inventoryHooks.js";

import InventoryForm from "@modules/inventory/components/InventoryForm.jsx";

const EquipmentEdit = () => {
    const { id } = useParams();
    const {equipmentData}=useEquipment(id)
    return (
        <div>
            <PageHeader currentpage='Edit Equipment' activepage="Equipment" mainpage="Edit Equipment"/>
            {equipmentData&&(
                <InventoryForm equipmentData={equipmentData} isEditMode={true} />
            )
            }
        </div>
    );
};

export default EquipmentEdit;
