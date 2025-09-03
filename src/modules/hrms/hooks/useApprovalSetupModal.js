import {useCallback, useState} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const approverSchema = z.object({
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const allowedExtensions = ['.xls', '.xlsx'];

const uploadApprovalSetupSchema = z.object({
    file: z.instanceof(File)
        .refine((file) => allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext)), {
            message: `Invalid file type. Only ${allowedExtensions.join(", ")} files are allowed.`,
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        }),
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

export const uploadApprovalSetup = async (formData) => {
    try {
        const response = await api.post(`/hrms/setups/approval-hierarchy/upload/`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};


export const useApprovalSetupModel = (refetch) => {
    const [editId, setEditId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,                        // <-- added
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(approvalSetupSchema),
        defaultValues: {
            user_id: 0,
            type: "objective",
            approvers: [{ level: 1, approver_id: null, approverOption: null }], // include approverOption
        },
    });

    const openModal = useCallback(async (id = null, isEdit = false) => {
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
                const userOption = data.user && { value: data.user.id, label: data.user.full_name };

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
                    user_id: data.user_id,
                    userOption,
                    type: data.type,
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
                if (refetch) refetch();
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    }, [editId, closeModal, refetch]);

    return {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
        setValue,                    // <-- expose setValue so children can persist approverOption
    };
};

export const useUploadApprovalSetupModal = (refetch) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(uploadApprovalSetupSchema),
    });

    const openUploadModal = () => {
        setIsUploadModalOpen(true);
        setTimeout(() => {
            const modal = document.getElementById("uploadApprovalSetupModal");
            if (modal) {
                window.HSOverlay.open(modal);
                modal.classList.add('open');
            }
        });
    };

    const closeUploadModal = () => {
        const modal = document.getElementById("uploadApprovalSetupModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        setTimeout(() => setIsUploadModalOpen(false), 350);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('file', data.file);

        try {
            const response = await uploadApprovalSetup(formData);
            if (response && response.status) {
                closeUploadModal();
                refetch();
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return {
        openUploadModal,
        closeUploadModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isUploadModalOpen,
    };
};