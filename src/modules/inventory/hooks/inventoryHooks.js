import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    createEquipment,
    getEquipmentById,
    getEquipments,
    updateEquipment,
    equipmentStatuses,
    toggleFavouriteEquipment,
    reAssignEquipment, verifyEquipmentItem
} from "@modules/inventory/services/inventoryService.js"; // Assuming services exist here
import { useNavigate } from "react-router-dom";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {useSelector} from "react-redux";

// Hook to fetch equipment list with pagination and search
export const useEquipments = (page = 1, size = 8, search) => {
    const query = useQuery({
        queryKey: ['equipments', page, size, search],
        queryFn: () => getEquipments(page, size, search),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return {
        ...query,
        refetch: query.refetch,
    };
};

// Custom hook to handle equipment form submission
// export const useEquipmentForm = (equipmentData, isEditMode) => {
//     const navigate = useNavigate();
//
//     const handleEquipmentSubmit = async (data) => {
//         try {
//             if (isEditMode) {
//                 await updateEquipment(equipmentData.id, data);
//             } else {
//                 await createEquipment(data);
//             }
//              navigate(INVENTORY_ROUTES.READ.path);
//         } catch (error) {
//             console.error('Error:', error.message);
//         }
//     };
//
//     return { handleEquipmentSubmit };
// };
export const useEquipmentForm = (equipmentData, isEditMode) => {
    const navigate = useNavigate();

    const handleEquipmentSubmit = async (data) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateEquipment(equipmentData.id, data);
            } else {
                response = await createEquipment(data);
            }

            // Check for successful response before redirecting
            if (response?.status === 200 || response?.status === 201) {
                // Only navigate if the request was successful
                navigate(INVENTORY_ROUTES.READ.path);
            } else {
                // Optionally handle error case here (like showing a message)
                console.error('Failed to save or update equipment:', response?.message);
            }
        } catch (error) {
            // Catch any errors thrown during the request
            console.error('Error:', error.message);
        }
    };

    return { handleEquipmentSubmit };
};

// Hook to fetch a single equipment by ID
export const useEquipment = (id) => {
    const [equipmentData, setEquipmentData] = useState(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const data = await getEquipmentById(id);
                setEquipmentData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchEquipment();
    }, [id]);

    return { equipmentData };
};

// Hook to fetch equipment statuses
export const useEquipmentStatuses = () => {
    const { data: statuses = [], isLoading, refetch } = useQuery({
        queryKey: ['equipmentStatuses'],
        queryFn: () => getEquipmentStatuses(),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { statuses, isLoading, refetch };
};

// Hook to toggle favorite status for equipment
export const useToggleFavouriteEquipment = () => {
    const [isLoading, setLoading] = useState(false);

    const handleToggleFavourite = useCallback(async (id, is_favourite) => {
        setLoading(true);
        try {
            return await toggleFavouriteEquipment(id, is_favourite);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleToggleFavourite, isLoading };
};

export const useReAssignEquipment = (id) => {
    const navigate = useNavigate();

    const handleReAssign = async (formData) => {
        try {
            const data = await reAssignEquipment(formData);
            // On success, you might want to navigate somewhere or refetch data
            // For example:
            navigate(`/module/asset/detail/${id}`);
        } catch (err) {
            console.error("Reassign error:", err);
        }
    };

    return { handleReAssign };
};

// Add to inventoryHooks.js
// inventoryHooks.js
export const useVerifyEquipment = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const employee = useSelector((state) => state.auth.user.employee);

    const verifyEquipment = useCallback(
        async (id) => {
            setIsVerifying(true);
            try {
                const payload = {
                    verified: true,
                    verified_on: new Date().toISOString().split("T")[0],
                    verified_by: employee.id,
                };
                return await verifyEquipmentItem(id, payload);
            } catch (error) {
                throw error;
            } finally {
                setIsVerifying(false);
            }
        },
        [employee]
    );

    return { verifyEquipment, isVerifying };
};