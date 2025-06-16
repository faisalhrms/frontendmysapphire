import { useState, useEffect } from 'react';
import api from "@config/axiosConfig.js";

const useSalesForceSyncTime = (endpoint = '/salesforce/fetch_sync_time_cc/', syncType = 'main', type = 'post') => {
    const [syncTime, setSyncTime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchSyncTime = async () => {
        try {
            const url = `${endpoint}?sync_type=${syncType}`;
            let response;

            if (type === 'post') {
                response = await api.post(url);
            } else {
                response = await api.get(url);
            }
            setSyncTime(response.data.data.show_sync_time);
            setErrorMessage("");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage("The data was last updated on Feb 25, 2025 - 04:15 PM");
                } else {
                    setErrorMessage(
                        `Error fetching sync time: ${error.response.status} - ${error.response.data.message || error.response.statusText}`
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
    }, [endpoint, syncType]);

    return { syncTime, errorMessage };
};

export default useSalesForceSyncTime;