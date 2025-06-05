import { useState, useEffect } from 'react';
import api from "@config/axiosConfig.js";

const useSalesForceSyncTime = (endpoint = '/salesforce/fetch_sync_time_cc/') => {
    const [syncTime, setSyncTime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchSyncTime = async () => {
        try {
            const response = await api.post(endpoint);
            setSyncTime(response.data.data.show_sync_time);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage("The data was last updated on Feb 25, 2025 - 04:15 PM");
                } else {
                    setErrorMessage(
                        `Error fetching sync time: ${error.response.status} - ${
                            error.response.data.message || error.response.statusText
                        }`
                    );
                }
            } else if (error.request) {
                setErrorMessage("No response from the server. Please check your connection.");
            } else {
                setErrorMessage(`Error: ${error.message}`);
            }
            console.error("Error fetching sync time:", error);
        }
    };

    useEffect(() => {
        fetchSyncTime();
    }, [endpoint]);

    return { syncTime, errorMessage };
};

export default useSalesForceSyncTime;
