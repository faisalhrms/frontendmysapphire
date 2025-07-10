// src/modules/policies/hooks/policyHooks.js
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPolicy, getPolicyById, updatePolicy ,fetchSelfPolicies,secureStreamMedia } from '../services/policyService.js';
import {POLICIES_ROUTES} from "../routes.js";

export const usePolicyForm = (policyData = {}, isEditMode = false) => {
    const navigate = useNavigate();

    const handlePolicySubmit = async (data) => {
        try {
            if (isEditMode) {
                await updatePolicy(policyData.id, data);
            } else {
                await createPolicy(data);
            }
            navigate(POLICIES_ROUTES.READ.path)
        } catch (error) {
            console.error('Policy submit error:', error.message);
        }
    };

    return { handlePolicySubmit };
};

export const usePolicy = (id) => {
    const [policyData, setPolicyData] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getPolicyById(id);
                setPolicyData(data);
            } catch (err) {
                console.error('Fetch policy error:', err.message);
            }
        };
        fetch();
    }, [id]);
    return { policyData };
};

export const useSelfPolicies = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const policies = await fetchSelfPolicies();
                setData(policies);
            } catch (err) {
                console.error("Failed to fetch self policies:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return { data, loading };
};

export const useSecureMedia = (fileId, isOpen) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [mimeType, setMimeType] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !fileId) return;

        let isMounted = true;
        setLoading(true);

        secureStreamMedia(fileId)
            .then(({ blob, mimeType }) => {
                if (!isMounted) return;
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
                setMimeType(mimeType);
            })
            .catch((err) => {
                console.error("Failed to stream media:", err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                setBlobUrl(null);
                setMimeType("");
            }
        };
    }, [fileId, isOpen]);

    return { blobUrl, mimeType, loading };
};