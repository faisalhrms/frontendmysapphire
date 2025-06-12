// hooks/useUploadTarget.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import uploadProjectSchema from "@modules/project-management/schemas/uploadProjectSchema.js";

/**
 * Custom hook to handle uploading via UploadTarget component,
 * with the API call and notifications inlined here.
 *
 * @param {object} options
 * @param {function} [options.onSuccess] - callback(data) after successful upload
 * @param {function} [options.onError] - callback(error) on error
 * @param {string} [options.redirectPath] - path to navigate on success if onSuccess not provided
 */
export const useUploadTarget = ({ onSuccess, onError, redirectPath = "/module/projects" } = {}) => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit: rhfHandleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(uploadProjectSchema),
    });

    const mutation = useMutation({
        // Inline API call:
        mutationFn: async (formData) => {
            // Note: formData is FormData instance passed from onSubmit
            const response = await api.post(`/upload-target/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // Show success notification
            Notify.success(response.data.message || "Uploaded successfully");
            // Return data for onSuccess callback
            return response.data;
        },
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            } else {
                // Default navigation
                navigate(redirectPath);
            }
        },
        onError: (error) => {
            // Show error notification or delegate
            if (onError) {
                onError(error);
            } else {
                const msg = error.response?.data?.message || "Upload failed";
                Notify.error(msg);

                // If server returned field-specific errors under error.response.data.errors, set them:
                if (error.response?.data?.errors && typeof error.response.data.errors === "object") {
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        // messages might be array or string
                        const messageText = Array.isArray(messages) ? messages.join(" ") : String(messages);
                        setError(field, { type: "server", message: messageText });
                    });
                }
            }
        },
    });

    /**
     * Handler for form submission. Expects react-hook-form values.
     * values.file is a FileList from FormInputFile.
     */
    const onSubmit = (values) => {
        const fileList = values.file;
        if (!fileList || fileList.length === 0) {
            setError("file", { type: "required", message: "File is required" });
            return;
        }
        const file = fileList[0];
        const formData = new FormData();
        formData.append("file", file);

        // Trigger mutation
        mutation.mutate(formData);
    };

    return {
        control,
        errors,
        isSubmitting: mutation.isLoading,
        handleSubmit: rhfHandleSubmit(onSubmit),
        mutation, // expose mutation in case you want mutation.data, mutation.error, mutation.isSuccess, etc.
    };
};
