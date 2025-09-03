// @modules/inventory/hooks/useLocationSubnetHooks.js
import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import locationSubnetSchema from "@modules/inventory/schemas/locationSubnetSchema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";

// ---------------- API calls ---------------- //

const createLocationSubnet = async (data) => {
    try {
        const response = await api.post(`/location-subnets/`, data);
        Notify.success(response.data.message || "Location Subnet created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create Location Subnet");
        throw error;
    }
};

const updateLocationSubnet = async (id, data) => {
    try {
        const response = await api.put(`/location-subnets/${id}/`, data);
        Notify.success(response.data.message || "Location Subnet updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update Location Subnet");
        throw error;
    }
};

const fetchLocationSubnetById = async (id) => {
    try {
        const response = await api.get(`/location-subnets/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch Location Subnet data.");
        return null;
    }
};

// ---------------- Hooks ---------------- //

export const useFetchLocationSubnetById = (id) => {
    const [subnetData, setSubnetData] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const data = await fetchLocationSubnetById(id);
                setSubnetData(data);
            } catch (err) {
                console.error("Fetch subnetData error:", err.message);
            }
        };
        fetch();
    }, [id]);

    return { subnetData };
};

export const useLocationSubnetForm = (subnetData = {}, isEditMode = false, refetch) => {
    const [editId, setEditId] = useState(isEditMode ? subnetData?.id : null);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(locationSubnetSchema),
        defaultValues: {
            location_id: subnetData.location_id || null,
            ips: subnetData.ips?.length ? subnetData.ips : [""],
        },
    });

    // ✅ Reset form when subnetData changes in edit mode
    useEffect(() => {
        if (isEditMode && subnetData) {
            reset({
                location_id: subnetData.location_id || null,
                ips: subnetData.ips?.length ? subnetData.ips : [""],
            });
            setEditId(subnetData.id);
        }
    }, [subnetData, isEditMode, reset]);

    // ✅ Manage dynamic IPs with useFieldArray
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ips",
    });

    const handleLocationSubnetSubmit = useCallback(
        async (data) => {
            try {
                // Normalize payload to match backend
                const payload = {
                    ...data,
                    location_id:
                        typeof data.location_id === "object" ? data.location_id?.id : data.location_id,
                };

                let res;
                if (editId) {
                    res = await updateLocationSubnet(editId, payload);
                } else {
                    res = await createLocationSubnet(payload);
                }

                if (res) {
                    navigate(INVENTORY_ROUTES.SETUPS.READ.path); // ✅ redirect
                }
            } catch (err) {
                console.error("LocationSubnet submit error:", err);
            }
        },
        [editId, refetch, navigate]
    );

    return {
        control,
        errors,
        isSubmitting,
        handleSubmit,
        handleLocationSubnetSubmit,
        reset,
        setEditId,
        fields,
        append,
        remove,
    };
};
