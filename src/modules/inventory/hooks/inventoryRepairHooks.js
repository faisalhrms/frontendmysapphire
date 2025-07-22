// inventoryHooks.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createEquipmentRepair,
    getEquipmentRepair,
    updateEquipmentRepair,
    getEquipmentRepairs,
    deleteEquipmentRepair
} from "@modules/inventory/services/inventoryRepairService.js";

export const useRepairForm = (equipmentId, repairData = null, onSuccessCallback) => {
    const isEditMode = Boolean(repairData);
    const repairId = repairData?.id || null;

    const handleRepairSubmit = async (data) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateEquipmentRepair(repairId, data);
            } else {
                response = await createEquipmentRepair({
                    ...data,
                    equipment_id: equipmentId
                });
            }

            if (onSuccessCallback) onSuccessCallback(response);
            return response;
        } catch (error) {
            console.error('Repair submit error:', error.message);
            throw error;
        }
    };

    return { handleRepairSubmit };
};

export const useEquipmentRepair = (repairId) => {
    const [repair, setRepair] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRepair = async () => {
            if (!repairId) return;

            setLoading(true);
            try {
                const data = await getEquipmentRepair(repairId);
                setRepair(data);
            } catch (error) {
                console.error('Fetch repair error:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRepair();
    }, [repairId]);

    return { repair, loading };
};

export const useEquipmentRepairs = (equipmentId) => {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRepairs = async () => {
            if (!equipmentId) return;

            setLoading(true);
            try {
                const data = await getEquipmentRepairs(equipmentId);
                setRepairs(data);
            } catch (error) {
                console.error('Fetch repairs error:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRepairs();
    }, [equipmentId]);

    const refetch = async () => {
        if (!equipmentId) return;

        setLoading(true);
        try {
            const data = await getEquipmentRepairs(equipmentId);
            setRepairs(data);
        } catch (error) {
            console.error('Refetch repairs error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return { repairs, loading, refetch };
};

export const useDeleteRepair = (onSuccessCallback) => {
    const handleDelete = async (repairId) => {
        try {
            const response = await deleteEquipmentRepair(repairId);
            if (onSuccessCallback) onSuccessCallback(response);
            return response;
        } catch (error) {
            console.error('Delete repair error:', error.message);
            throw error;
        }
    };

    return { handleDelete };
};