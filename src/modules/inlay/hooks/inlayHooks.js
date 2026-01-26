// src/modules/inlay/hooks/inlayHooks.js
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createInlay, updateInlay, getInlay } from "@modules/inlay/services/inlayService.js";
import { INLAY_ROUTES } from "@modules/inlay/routes.js";


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
