import {useCallback, useState} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {approverSchema} from "@modules/hrms/hooks/useApprovalSetupModal.js";

const approvalSetupSchema = z.object({
    hierarchy_id: z.coerce.number({
        required_error: "Hierarchy is required",
        invalid_type_error: "Hierarchy ID must be a number",
    }).min(1, "Hierarchy is required"),

    approvers: z.array(approverSchema)
        .min(1, "At least one approver is required"),
});

const bulkUpsert = async (data) => {
    try {
        const response = await api.post(`/approvals/hierarchy/approver/bulk-upsert/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const fetchById = async (id) => {
    try {
        const response = await api.get(`/approvals/hierarchy/approver/${id}/edit/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch year setup data.");
        return null;
    }
};


export const useApprovalHierarchyApproverSetupModal = (dataTableRef) => {
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
            hierarchy_id: null,
            approvers: [{ level: 1, approver_id: null, approverOption: null }],
        },
    });

    const openModal = useCallback(async (id = null, isEdit = false) => {
        setEditId(id);
        setIsEditMode(isEdit);

        let values = {
            hierarchy_id: 0,
            hierarchyOption: null,
            approvers: [{ level: 1, approver_id: null, approverOption: null }],
        };

        if (id && isEdit) {
            const data = await fetchById(id);
            if (data) {
                const hierarchyOption = data && { value: data.hierarchy_id, label: data.hierarchy };

                const sortedApprovers = [...data.approvers].sort((a, b) => a.level - b.level);

                const approvers = sortedApprovers.map((item, index) => {
                    const u = data.users.find(u => u.id === item.approver_id);
                    return {
                        level: index + 1,
                        approver_id: item.approver_id,
                        approverOption: u && { value: u.id, label: `${u.full_name} (${u.email})`},
                    };
                });

                values = {
                    hierarchy_id: data.hierarchy_id,
                    hierarchyOption,
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
            res = await bulkUpsert(processedData);

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