import { useNavigate } from "react-router-dom";
import { createStoreComplaint, createOnlineComplaint } from "@modules/CustomerAssist/services/complaintService.js";

export const useStoreComplaintForm = () => {
    const navigate = useNavigate();

    const handleComplaintSubmit = async (data) => {
        try {
            const response = await createStoreComplaint(data);
            if (response?.status === 201) {
                console.error('Failed to submit store complaint:', response?.message);
            } else {
                console.error('Failed to submit store complaint:', response?.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleComplaintSubmit };
};

export const useOnlineComplaintForm = () => {
    const navigate = useNavigate();

    const handleComplaintSubmit = async (data) => {
        try {
            const response = await createOnlineComplaint(data);
            if (response?.status === 201) {
                console.error('Failed to submit store complaint:', response?.message);
            } else {
                console.error('Failed to submit online complaint:', response?.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleComplaintSubmit };
};