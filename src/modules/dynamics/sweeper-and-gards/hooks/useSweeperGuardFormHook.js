// @modules/dynamics/hooks/sweeperGuardHooks.js
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import sweeperGuardSchema from "@modules/dynamics/sweeper-and-gards/schemas/sweeperGuardSchema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {DYNAMICS_ROUTES} from "@modules/dynamics/routes.js";
import {Navigation} from "swiper/modules";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {useNavigate} from "react-router-dom";

// ---------------- API calls ---------------- //

const createSweeperGuard = async (data) => {
    try {
        const response = await api.post(`/dynamics/sweepers-and-guards/`, data);
        Notify.success(response.data.message || "Created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create");
        throw error;
    }
};

const updateSweeperGuard = async (id, data) => {
    try {
        const response = await api.put(`/dynamics/sweepers-and-guards/${id}/`, data);
        Notify.success(response.data.message || "Updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update");
        throw error;
    }
};

const fetchSweeperGuardById = async (id) => {
    try {
        const response = await api.get(`/dynamics/sweepers-and-guards/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch Sweeper & Guard data.");
        return null;
    }
};

// ---------------- Hooks ---------------- //

export const useFetchSweeperGuardById = (id) => {
    const [sgData, setSgData] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const data = await fetchSweeperGuardById(id);
                setSgData(data);
            } catch (err) {
                console.error("Fetch setSgData error:", err.message);
            }
        };
        fetch();
    }, [id]);

    return { sgData };
};

export const useSweeperGuardForm = (sgData = {}, isEditMode = false, refetch) => {
    const [editId, setEditId] = useState(isEditMode ? sgData?.id : null);
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(sweeperGuardSchema),
        defaultValues: {
            store_id: sgData.store?.id || null,
            num_of_guards: sgData.num_of_guards || 0,
            num_of_sweepers: sgData.num_of_sweepers || 0,
            num_of_stock_helpers: sgData.num_of_stock_helpers || 0,
            leased_area_total: sgData.leased_area_total || 0,
            store_capacity_total: sgData.store_capacity_total || 0,
            category_designs: sgData.category_designs || [],
        },
    });

    const handleSweeperGuardSubmit = useCallback(
        async (data) => {
            try {
                const payload = {
                    ...data,
                };
                let res;
                if (editId) {
                    res = await updateSweeperGuard(editId, payload);
                } else {
                    res = await createSweeperGuard(payload);
                }
                if (res){
                    navigate(DYNAMICS_ROUTES.READ.path);
                }
            } catch (err) {
                console.error("SweeperGuard submit error:", err);
            }
        },
        [editId, refetch]
    );

    return {
        control,
        errors,
        isSubmitting,
        handleSubmit,
        handleSweeperGuardSubmit,
        reset,
        setEditId,
    };
};
