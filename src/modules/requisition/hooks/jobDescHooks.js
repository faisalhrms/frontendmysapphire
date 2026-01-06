// src/modules/requisition/hooks/jobDescHooks.js
import { useEffect, useState } from "react";
import {
    createJobDesc,
    updateJobDesc,
    getJobDesc,
} from "@modules/requisition/services/jobDescService.js";

/**
 * Create/Update submit handler
 */
export const useJobDescForm = (jobDescData = null, isEditMode = false, onSuccess) => {
    const jdId = jobDescData?.id ?? null;

    const handleJobDescSubmit = async (payload) => {
        try {
            let response;
            if (isEditMode && jdId) {
                response = await updateJobDesc(jdId, payload);
            } else {
                response = await createJobDesc(payload);
            }
            onSuccess?.(response);
            return response;
        } catch (err) {
            // Notify is handled in service; still rethrow for form-level handling if needed
            throw err;
        }
    };

    return { handleJobDescSubmit };
};

/**
 * Fetch single JD
 */
export const useJobDesc = (jobDescId) => {
    const [jobDesc, setJobDesc] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!jobDescId) return;
            setLoading(true);
            try {
                const data = await getJobDesc(jobDescId);
                setJobDesc(data);
            } catch (e) {
                // service handles notify
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [jobDescId]);

    return { jobDesc, loading };
};
