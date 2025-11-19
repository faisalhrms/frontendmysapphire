import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    createRequisition,
    updateRequisition,
    getRequisition,
} from "@modules/requisition/services/requisitionService.js";
import { REQUISITION_ROUTES } from "@modules/requisition/routes.js";

/** Normalize payload for API */
const normalize = (p) => {
    const out = { ...p };

    // IDs: option objects -> value
    ["job_description","designation","location","hiring_manager","replacement_for_employee"]
        .forEach((k) => {
            const v = out[k];
            if (v && typeof v === "object" && "value" in v) out[k] = v.value;
        });

    // Channels: [{value,label}] -> ["value"]
    if (Array.isArray(out.channels)) {
        out.channels = out.channels.map((c) => (typeof c === "string" ? c : c?.value)).filter(Boolean);
    }

    return out;
};

/**
 * Create/Update submit handler with redirect on success.
 * Redirects to REQUISITION_ROUTES.REQUISITION.READ.path by default.
 *
 * You can override behavior via the 4th arg:
 *   useRequisitionForm(data, isEdit, onSuccess, { redirect: false })
 *   useRequisitionForm(data, isEdit, onSuccess, { to: "/custom/path" })
 */
export const useRequisitionForm = (
    requisitionData = null,
    isEditMode = false,
    onSuccess,
    { redirect = true, to = REQUISITION_ROUTES.REQUISITION.READ.path } = {}
) => {
    const id = requisitionData?.id ?? null;
    const navigate = useNavigate();

    const handleRequisitionSubmit = useCallback(async (payload) => {
        const body = normalize(payload);

        // Services already toast & throw on error. If we reach here, it's a success.
        const res = isEditMode && id
            ? await updateRequisition(id, body)
            : await createRequisition(body);

        onSuccess?.(res);
        if (redirect) navigate(to);

        return res;
    }, [id, isEditMode, onSuccess, redirect, to, navigate]);

    return { handleRequisitionSubmit };
};

/** Fetch single requisition */
export const useRequisition = (id) => {
    const [requisition, setRequisition] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getRequisition(id);
                setRequisition(data);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [id]);

    return { requisition, loading };
};
