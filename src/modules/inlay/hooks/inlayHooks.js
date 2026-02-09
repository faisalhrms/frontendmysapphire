// src/modules/inlay/hooks/inlayHooks.js
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {createInlay, updateInlay, getInlay, uploadInlay} from "@modules/inlay/services/inlayService.js";
import { INLAY_ROUTES } from "@modules/inlay/routes.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import uploadProjectSchema from "@modules/project-management/schemas/uploadProjectSchema.js";
import {uploadProjects} from "@modules/project-management/services/projectService.js";
import {uploadTasks} from "@modules/project-management/services/taskService.js";
import {uploadMilestones} from "@modules/project-management/services/milestoneService.js";


export const useInlayForm = (
    inlayData = null,
    isEditMode = false,
    onSuccess,
    { redirect = true, to = INLAY_ROUTES.READ.path } = {}
) => {
    const id = inlayData?.id ?? null;
    const navigate = useNavigate();

    const handleInlaySubmit = useCallback(
        async (payload) => {
            const body = payload;

            const res = isEditMode && id ? await updateInlay(id, body) : await createInlay(body);

            onSuccess?.(res);
            if (redirect) navigate(to);

            return res;
        },
        [id, isEditMode, onSuccess, redirect, to, navigate]
    );

    return { handleInlaySubmit };
};

export const useInlay = (id) => {
    const [inlay, setInlay] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getInlay(id);
                setInlay(data);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [id]);

    return { inlay, loading };
};

export const useUploadInlayModal = (refetch) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(uploadProjectSchema),
        defaultValues: { file: null },
    });

    const openUploadModal = () => {
        setIsUploadModalOpen(true);

        setTimeout(() => {
            const modal = document.getElementById("uploadInlayModal");
            if (modal && window?.HSOverlay) {
                window.HSOverlay.open(modal);
                modal.classList.add("open");
            }
        }, 0);
    };

    const closeUploadModal = () => {
        const modal = document.getElementById("uploadInlayModal");
        if (modal && window?.HSOverlay) {
            window.HSOverlay.close(modal);
        }

        // optional: clear the form
        reset({ file: null });

        setTimeout(() => setIsUploadModalOpen(false), 350);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file);

        const response = await uploadInlay(formData);

        // handle common API shapes
        const ok =
            response?.success === true ||
            response?.status === true ||
            response?.ok === true;

        if (ok) {
            closeUploadModal();
            if (typeof refetch === "function") refetch();
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