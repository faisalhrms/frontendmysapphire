import { useState, useEffect, useCallback } from 'react';
import api from "@config/axiosConfig.js";

const useSalesForceSyncTime = (endpoint = '/salesforce/fetch_sync_time_cc/', syncType = 'main') => {
    const [syncTime, setSyncTime] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchSyncTime = async () => {
        try {

            const url = `${endpoint}?sync_type=${syncType}`;


            const response = await api.post(url);

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

    const fetchExecutiveSummary = async (filters) => {
        try {
            const { date_from, date_to } = filters;
            const response = await api.get("/salesforce/fetch_executive_summary/", {
                params: { date_from, date_to},
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching executive summary:", error);
            throw error;
        }
    };

    const fetchPendingOrders = async (filters) => {
        try {
            const { date_from, date_to } = filters;
            const response = await api.get("/salesforce/fetch_pending_orders/", {
                params: { date_from, date_to,  },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching pending orders:", error);
            throw error;
        }
    };


    const refetch = useCallback(async (filters = {}, activeTab = "executiveSummary") => {
        try {
            await fetchSyncTime();

            let executiveData = null;

            if (activeTab === "executiveSummary") {
                executiveData = await fetchExecutiveSummary(filters);
            } else if (activeTab === "agingLiabilities") {
                executiveData = await fetchPendingOrders(filters);
            }

            return executiveData;
        } catch (error) {
            console.error("Error in refetch:", error);
            return null;
        }
    }, [endpoint, syncType]);

    useEffect(() => {
        fetchSyncTime();
    }, [endpoint, syncType]);

    return { syncTime, errorMessage, refetch };
};

export default useSalesForceSyncTime;