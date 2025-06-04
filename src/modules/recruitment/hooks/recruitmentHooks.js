import {useNavigate} from "react-router-dom";
import {
    createApplicant,
    getApplicantById,
    updateApplicant,
    updateStatus
} from "@modules/recruitment/services/applicantService.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {useCallback, useEffect, useState} from "react";


export const useApplicantForm = (applicantData, isEditMode) => {
    const navigate = useNavigate();

    const handleApplicantSubmit = async (data) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateApplicant(applicantData.id, data);
            } else {
                response = await createApplicant(data);
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

    return { handleApplicantSubmit };
};

export const useApplicant = (id) => {
    const [applicantData, setApplicantData] = useState(null);

    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const data = await getApplicantById(id);
                setApplicantData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchApplicant();
    }, [id]);

    return { applicantData };
};

export const useUpdateStatus = () => {
    const [isLoading, setLoading] = useState(false);

    const handleStatus = useCallback(async (applicantId,status) => {
        setLoading(true);
        try {
            return await updateStatus(applicantId, status);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleStatus, isLoading };
};
