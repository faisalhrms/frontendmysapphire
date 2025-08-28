import {useCallback, useState} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {approverSchema} from "@modules/hrms/hooks/useApprovalSetupModal.js";

const approvalSetupSchema = z.object({
    form_id: z.coerce.number({
        required_error: "Form is required",
        invalid_type_error: "Form ID must be a number",
    }).min(1, "Form is required"),

    approvers: z.array(approverSchema)
        .min(1, "At least one approver is required"),
});

const create = async (data) => {
    try {
        const response = await api.post(`/forms/setups/approval-hierarchy/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const update = async (id, data) => {
    try {
        const response = await api.put(`/forms/setups/approval-hierarchy/${id}/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const fetchById = async (id) => {
    try {
        const response = await api.get(`/forms/setups/approval-hierarchy/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch year setup data.");
        return null;
    }
};


export const useFormApprovalSetupModel = (dataTableRef) => {
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
            form_id: null,
            approvers: [{ level: 1, approver_id: null, approverOption: null }],
        },
    });

    const openModal = useCallback(async (id = null, isEdit = false) => {
        setEditId(id);
        setIsEditMode(isEdit);

        let values = {
            form_id: 0,
            formOption: null,
            approvers: [{ level: 1, approver_id: null, approverOption: null }],
        };

        if (id && isEdit) {
            const data = await fetchById(id);
            if (data) {
                const formOption = data && { value: data.form_id, label: data.title };

                const sortedApprovers = [...data.approvers].sort((a, b) => a.level - b.level);

                const approvers = sortedApprovers.map((item, index) => {
                    const u = data.users.find(u => u.id === item.approver_id);
                    return {
                        level: index + 1,
                        approver_id: item.approver_id,
                        approverOption: u && { value: u.id, label: u.full_name },
                    };
                });

                values = {
                    form_id: data.form_id,
                    formOption,
                    approvers,
                };
            }
        }

        reset(values);

        setTimeout(() => {
            const modal = document.getElementById("approvalSetupModal");
            if (modal && window.HSOverlay) {
                window.HSOverlay.open(modal);
            }
        }, 0);
    }, [reset]);

    const closeModal = useCallback(() => {
        const modal = document.getElementById("approvalSetupModal");
        if (modal && window.HSOverlay) {
            window.HSOverlay.close(modal);
        }

        setTimeout(() => {
            reset();
            setEditId(null);
            setIsEditMode(false);
        }, 300);
    }, [reset]);

    const onSubmit = useCallback(async (data) => {
        const processedData = {
            ...data,
            approvers: data.approvers.map((approver, index) => ({
                level: index + 1,
                approver_id: approver.approver_id
            }))
        };

        try {
            let res;
            if (editId) {
                res = await update(editId, processedData);
            } else {
                res = await create(processedData);
            }

            if (res) {
                closeModal();
                if (dataTableRef) dataTableRef.current?.refetch();
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    }, [editId, closeModal, dataTableRef]);

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