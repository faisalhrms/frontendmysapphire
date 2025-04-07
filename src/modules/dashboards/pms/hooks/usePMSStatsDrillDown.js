import { useState, useCallback } from "react";
import api from "@config/axiosConfig.js";

const usePMSStatsDrillDown = (endpoint, filters) => {
    const [tasks, setTasks] = useState(null);
    const [loadingTasks, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTaskModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async (queryParams) => {
        if (!endpoint) return;
        openTaskModal();
        setError(null);
        try {
            const response = await api.get(endpoint, {
                params: { ...filters, ...queryParams },
            });
            setTasks(response.data.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, filters]);

    const openTaskModal = () => {
        setIsModalOpen(true);
        setLoading(true);
        setTimeout(() => {
            const modal = document.getElementById("taskListingModal");
            if (modal) {
                window.HSOverlay.open(modal);
                modal.classList.add('open');
            }
        });
    };

    const closeTaskModal = () => {
        const modal = document.getElementById("taskListingModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        setTimeout(() => setIsModalOpen(false), 400);
    };

    return { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal };
};

export default usePMSStatsDrillDown;