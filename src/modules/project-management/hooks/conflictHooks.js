import { useState } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const useConflictHook = () => {
    const [haveConflict, setHaveConflict] = useState(false);
    const [conflicts, setConflicts] = useState([]);

    const handleConflict = (errorData) => {
        setHaveConflict(true);
        setConflicts(errorData.errors);
        setTimeout(() => {
            const modal = document.getElementById("conflictModal");
            if (modal) {
                window.HSOverlay.open(modal);
            }
        });
    };

    const closeConflictModal = () => {
        const modal = document.getElementById("conflictModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        setConflicts([]);
        setTimeout(() => setHaveConflict(false), 300);
    };

    return { haveConflict, conflicts, handleConflict, closeConflictModal };
};

export const useConflictForm = (endPoint, closeConflictModal) => {
    const handleConflictSubmit = async (payload) => {
        try {
            const response = await api.post(endPoint, payload);
            Notify.success(response.data.message);
            if (closeConflictModal) {
                closeConflictModal();
            }
            return response.data.data;
        } catch (error) {
            Notify.error(error.response?.data?.message);
            throw new Error(error.response?.data?.message || "An error occurred");
        }
    };

    return { handleConflictSubmit };
};
