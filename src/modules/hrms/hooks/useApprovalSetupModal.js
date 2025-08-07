import { useState } from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const approverSchema = z.object({
    level: z.coerce.number({
        required_error: "Level is required",
        invalid_type_error: "Level must be a number",
    }).min(1, "Level must be at least 1"),

    approver_id: z.coerce.number({
        required_error: "Approver is required",
        invalid_type_error: "Approver must be a number",
    }).min(1, "Approver ID must be at least 1"),
});

const approvalSetupSchema = z.object({
    user_id: z.coerce.number({
        required_error: "User is required",
        invalid_type_error: "User ID must be a number",
    }).min(1, "User is required"),

    type: z.enum(["objective", "appraisal"], {
        required_error: "Type is required",
    }),

    // ← now required and enforces at least one entry
    approvers: z.array(approverSchema)
        .min(1, "At least one approver is required"),
});

const create = async (data) => {
    try {
        const response = await api.post(`/hrms/setups/approval-hierarchy/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const update = async (id, data) => {
    try {
        const response = await api.put(`/hrms/setups/approval-hierarchy/${id}/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


const fetchById = async (id) => {
    try {
        const response = await api.get(`/hrms/setups/approval-hierarchy/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch year setup data.");
        return null;
    }
};
export const useApprovalSetupModel = (refetch) => {
    const [editId, setEditId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(approvalSetupSchema),
        defaultValues: {
            user_id: 0,
            type: "objective",
            approvers: [{ level: 1, approver_id: null }],
        },
    });

    const openModal = async (id = null, isEdit = false) => {
        setEditId(id);
        setIsEditMode(isEdit);

        let values = {
            user_id: 0,
            userOption: null,
            type: 'objective',
            approvers: [{ level: 1, approver_id: null, approverOption: null }],
        };

        if (id && isEdit) {
            const data = await fetchById(id);
            if (data) {
                // build userOption
                const userOption = data.user && { value: data.user.id, label: data.user.full_name };
                // build approvers with options
                const approvers = data.approvers.map(item => {
                    const u = data.users.find(u => u.id === item.approver_id);
                    return {
                        level: item.level,
                        approver_id: item.approver_id,
                        approverOption: u && { value: u.id, label: u.full_name },
                    };
                });
                values = {
                    user_id: data.user_id,
                    userOption,
                    type: data.type,
                    approvers,
                };
            }
        }
        console.log("Opening modal with data:", values);


        reset(values);

        const modal = document.getElementById("approvalSetupModal");
        if (modal) {
            window.HSOverlay.open(modal);
        }
    };

    const closeModal = () => {
        const modal = document.getElementById("approvalSetupModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        reset();
        setEditId(null);
        setIsEditMode(false);
    };

    const onSubmit = async (data) => {
        console.log(`Data on submistion`,data)
        try {
            let res = null;
            if (editId) {
                res = await update(editId, data);
            } else {
                res = await create(data);
            }

            if (res) {
                closeModal();
                if (refetch) refetch();
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    return {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
        setValue,
    };
};
