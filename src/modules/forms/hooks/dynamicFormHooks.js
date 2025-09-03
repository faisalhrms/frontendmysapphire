import {useEffect, useState} from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {useQuery} from "@tanstack/react-query";

export const useDynamicFormEdit = (id) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/forms/${id}/`);
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

const fetchDynamicFormColumns = async (id) => {
    const response = await api.get(`/forms/${id}/columns/`);
    return response.data.data;
};

export const useDynamicFormColumns = (id) => {
    const { data, isLoading } = useQuery({
        queryKey: ['formColumns', id],
        queryFn: () => fetchDynamicFormColumns(id),
        enabled: !!id,
        onError: (error) => {
            Notify.error(error.response?.data?.message || 'Failed to fetch form columns');
        },
    });

    return { data, isLoading };
};