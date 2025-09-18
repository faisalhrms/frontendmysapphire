// @modules/inventory/hooks/inventoryReplaceHooks.js
import { useEffect, useState } from "react";
import {
    createEquipmentReplace,
    getEquipmentReplace,
    updateEquipmentReplace
} from "@modules/inventory/services/inventoryReplaceService.js";

/**
 * Form submit hook for create/update of Equipment Replace
 */
export const useReplaceForm = (equipmentId, replaceData = null, onSuccessCallback) => {
    const isEditMode = Boolean(replaceData);
    const replaceId = replaceData?.id || null;

    const handleReplaceSubmit = async (data) => {
        const payload = {
            ...data,
            equipment_id: equipmentId
        };

        let response;
        if (isEditMode) {
            response = await updateEquipmentReplace(replaceId, payload);
        } else {
            response = await createEquipmentReplace(payload);
        }

        if (onSuccessCallback) onSuccessCallback(response);
        return response;
    };

    return { handleReplaceSubmit };
};

/**
 * Fetch a single Equipment Replace record by ID
 * Similar to useEquipmentRepair
 */export const useEquipmentReplacement = (replaceId) => {
    const [replacement, setReplacement] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReplacement = async () => {
            if (!replaceId) return;

            setLoading(true);
            try {
                const data = await getEquipmentReplace(replaceId);
                setReplacement(data);
            } catch (error) {
                console.error("Fetch replacement error:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReplacement();
    }, [replaceId]);

    return { replacement, loading };
};
