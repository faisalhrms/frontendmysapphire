import { useQuery } from "@tanstack/react-query";
import { getPersonViewDashboardStats } from "@modules/dashboards/sr/services/srDashboardService.js";

export const usePersonViewDashboardStatistics = (filters) => {
    const { data = {}, isLoading, refetch } = useQuery({
        queryKey: ["personViewDashboardStatistics", filters],
        queryFn: () => getPersonViewDashboardStats(filters),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading, refetch };
};
