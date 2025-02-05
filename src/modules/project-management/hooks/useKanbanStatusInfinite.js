import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    fetchKanbanTasksAll,
    fetchKanbanTasksByStatus
} from "@modules/project-management/services/taskService.js";

/**
 * A hook that loads all Kanban data once,
 * then provides a 'loadMore' method for each status column.
 */
export function useKanbanStatusInfinite() {
    const [kanbanData, setKanbanData] = useState({});

    const [loadingStatus, setLoadingStatus] = useState(null);

    // Single React Query to fetch *all* statuses/tasks initially
    const {
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["kanbanBoard"],      // Unique key for the entire board
        queryFn: async () => {
            // Fetch up to 5 tasks per status initially (adjust if desired)
            const response = await fetchKanbanTasksAll(5);
            console.log(response);
            setKanbanData(response.data || {});
            return response.data;

        },
       
        // Optionally configure staleTime, refetchOnWindowFocus, etc.
        // staleTime: Infinity,
    });

    /**
     * loadMore(statusKey): fetch next batch for that status only
     */
    const loadMore = async (statusKey) => {
        try {
            setLoadingStatus(statusKey);

            // Current tasks for that column
            const currentTasks = kanbanData[statusKey]?.tasks || [];
            const offset = currentTasks.length;

            // Fetch next 5 tasks
            const response = await fetchKanbanTasksByStatus({
                status: statusKey,
                limit: 5,
                offset,
            });

            const newTasks = response.data?.[statusKey]?.tasks || [];
            const updatedKanbanData = { ...kanbanData };

            updatedKanbanData[statusKey] = {
                ...updatedKanbanData[statusKey],
                tasks: [...currentTasks, ...newTasks],
                // Update the total count if the API returns an updated number
                task_count:
                    response.data?.[statusKey]?.task_count ??
                    updatedKanbanData[statusKey].task_count,
            };

            setKanbanData(updatedKanbanData);
            setLoadingStatus(null);
        } catch (err) {
            setLoadingStatus(null);
            // Optionally handle error here or let React Query handle it
        }
    };

    return {
        kanbanData,
        isLoading,
        isError,
        error,
        loadMore,
        loadingStatus,
    };
}
