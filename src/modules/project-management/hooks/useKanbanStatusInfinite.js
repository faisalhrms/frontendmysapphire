// hooks/useKanbanStatusInfinite.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchKanbanTasks } from "../services/taskService.js";

export function useKanbanStatusInfinite(statusKey, enabled = true) {
    return useInfiniteQuery({
        // The query key is an array
        queryKey: ["kanbanTasks", statusKey],

        // The function that fetches data
        queryFn: async ({ pageParam = 0 }) => {
            // pageParam = offset
            const result = await fetchKanbanTasks({
                status: statusKey,
                limit: 5,
                offset: pageParam,
            });
            return result;
        },

        // Determine the next page offset
        getNextPageParam: (lastPage, allPages) => {
            const columnData = lastPage?.data?.[statusKey];
            if (!columnData) return undefined;

            const totalCount = columnData.task_count || 0;
            const loadedTasksCount = allPages.reduce((sum, page) => {
                const tasks = page?.data?.[statusKey]?.tasks || [];
                return sum + tasks.length;
            }, 0);

            return loadedTasksCount < totalCount ? loadedTasksCount : undefined;
        },

        // Enable/disable the query
        enabled,
    });
}
