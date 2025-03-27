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

    const handleRowClick = async (rowData, colIndex, headers) => {
        const header = headers[colIndex];
        if (header?.accessor && header.accessor !== "tagTeam") {
            await fetchData({
                priority: header.label.toLowerCase() === 'total' ? null : header.label.toLowerCase(),
                tag: rowData?.tag,
                team: rowData?.tagTeam?.props?.children ? null : rowData?.tagTeam,
            });
        }
    };

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

    return { isTaskModalOpen, tasks, loadingTasks, handleRowClick, openTaskModal, closeTaskModal };
};

export default usePMSStatsDrillDown;