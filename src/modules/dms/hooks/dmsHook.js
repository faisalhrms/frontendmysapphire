// @modules/dms/hooks/dmsHook.js
import { useState, useCallback } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {useNavigate} from "react-router-dom";
import {DMS_ROUTES} from "@modules/dms/routes.js";

// --- fetcher ---
const fetchDmsJournal = async (doc_sequence_value) => {
    const res = await api.get(`/dms/journal/`, { params: { doc_sequence_value } });
    if (!res?.data?.status) {
        throw new Error(res?.data?.message || "Failed to load journal");
    }
    return res.data.data;
};

// --- mutation ---
const postDmsAttachments = async (payload) => {
    const res = await api.post(`/dms-journals/upsert-attachments/`, payload);
    if (!res?.data?.status) {
        throw new Error(res?.data?.message || "Failed to save attachments");
    }
    return res.data;
};

// --- replace useQuery ---
export const useDmsJournal = (doc_sequence_value) => {
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        if (!doc_sequence_value) return;
        setLoading(true);
        try {
            const data = await fetchDmsJournal(doc_sequence_value);
            setJournal(data);
        } catch (error) {
            Notify.error(error?.response?.data?.message || error.message || "Failed to load journal");
        } finally {
            setLoading(false);
        }
    }, [doc_sequence_value]);

    return { journal, load, loading };
};

// --- replace useMutation ---
export const useSaveDmsAttachments = (doc_sequence_value, refreshCallback) => {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const save = useCallback(async (payload) => {
        setSaving(true);
        try {
            const data = await postDmsAttachments(payload);
            Notify.success(data?.message || "Attachments saved");
            navigate(DMS_ROUTES.READ.path)
            if (refreshCallback) refreshCallback();
        } catch (error) {
            Notify.error(error?.response?.data?.message || error.message || "Failed to save attachments");
        } finally {
            setSaving(false);
        }
    }, [doc_sequence_value, refreshCallback]);

    return { save, saving };
};

// --- unchanged ---
export const downloadDmsJournalReport = async (docSequenceValue) => {
    try {
        const res = await api.get(`/dms-journals/download/journal-report`, {
            params: { doc_sequence_value: docSequenceValue },
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to download the journal PDF.";
        Notify.error(msg);
        throw error;
    }
};
