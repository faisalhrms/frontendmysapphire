import { useEffect, useState } from 'react';
import Notify from "@helpers/toastNotifications.js";
import api from "@config/axiosConfig.js";

export const fetchIsActiveYear = async (mode) => {
    try {
        const response = await api.get(`/hrms/objectives/is-active-year/?type=objective&mode=${mode}`);
        if (response.data?.status) {
            return response.data.data?.is_active;
        } else {
            Notify.error(response.data?.message || "Failed to fetch active year status");
            return false;
        }
    } catch (error) {
        Notify.error(error.response?.data?.message || "Something went wrong");
        return false;
    }
};

export const useActiveYear = (mode = 'create', ) => {
    const [isActiveYear, setIsActiveYear] = useState(false);
    const [isFetchingYear, setIsFetchingYear] = useState(true);
    useEffect(() => {
        (async () => {
            setIsFetchingYear(true);
            const isActive = await fetchIsActiveYear(mode);
            setIsActiveYear(!!isActive);
            setIsFetchingYear(false);
        })();
    }, []);

    return {
        isActiveYear,
        isFetchingYear
    };
};
