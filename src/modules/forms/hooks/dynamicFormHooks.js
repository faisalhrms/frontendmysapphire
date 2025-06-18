import {useEffect, useState} from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const useDynamicFormEdit = (id) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/forms/${id}`);
                setData(response.data.data);
            } catch (error) {
                Notify.error(error.response?.data?.message);
            }finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, [id]);

    return { data, isLoading };
};