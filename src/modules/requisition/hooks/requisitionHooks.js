import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    createRequisition,
    updateRequisition,
    getRequisition,
} from "@modules/requisition/services/requisitionService.js";
import { REQUISITION_ROUTES } from "@modules/requisition/routes.js";
import api from "../../../config/axiosConfig.js";

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

export const useRequisitionApplicant = (requisitionId, applicationId) => {
    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                if (!requisitionId || !applicationId) {
                    throw new Error("Missing requisitionId/applicationId");
                }

                const { data } = await api.get(
                    `/requisitions/${requisitionId}/applicants/${applicationId}/`
                );

                if (!mounted) return;
                setApplicant(data?.data || null);
            } catch (e) {
                if (!mounted) return;
                setError(e?.response?.data?.message || "Unable to load applicant.");
                setApplicant(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [requisitionId, applicationId]);

    return { applicant, loading, error };
};
// ✅ Bulk status update hook for requisition applicants
export const useRequisitionApplicantsBulkStatus = (requisitionId) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // ✅ track which button/action is running
    const [pendingStatus, setPendingStatus] = useState(null);

    const isSelected = useCallback((id) => selectedIds.includes(id), [selectedIds]);

    const toggleOne = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    const toggleAllOnPage = useCallback((pageIds, checked) => {
        setSelectedIds((prev) => {
            const pageSet = new Set(pageIds || []);
            if (checked) {
                const merged = new Set([...prev, ...pageSet]);
                return Array.from(merged);
            }
            return prev.filter((x) => !pageSet.has(x));
        });
    }, []);

    const bulkUpdateStatus = useCallback(
        async ({ status, is_shortlisted, applicationIds, actionKey }) => {
            const ids = applicationIds?.length ? applicationIds : selectedIds;

            if (!requisitionId) throw new Error("Missing requisitionId");
            if (!ids?.length) throw new Error("Please select at least one applicant.");

            const hasStatus =
                status !== undefined && status !== null && String(status).trim() !== "";
            const hasShortlist = is_shortlisted !== undefined && is_shortlisted !== null;

            if (!hasStatus && !hasShortlist) {
                throw new Error("Missing status or shortlist flag.");
            }

            // ✅ loader key
            const computedKey = hasStatus
                ? String(status)
                : is_shortlisted
                    ? "shortlisted"
                    : "unshortlisted";

            setSubmitting(true);
            setPendingStatus(actionKey || computedKey);

            try {
                const payload = {
                    application_ids: ids,
                    ...(hasStatus ? { status } : {}),
                    ...(hasShortlist ? { is_shortlisted } : {}),
                };

                const { data } = await api.patch(
                    `/requisitions/${requisitionId}/applicants/status/bulk/`,
                    payload
                );
                return data;
            } finally {
                setSubmitting(false);
                setPendingStatus(null);
            }
        },
        [requisitionId, selectedIds]
    );

    return {
        selectedIds,
        setSelectedIds,
        submitting,
        pendingStatus,
        isSelected,
        toggleOne,
        toggleAllOnPage,
        clearSelection,
        bulkUpdateStatus,
    };
};
