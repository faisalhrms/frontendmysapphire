import { useQuery } from "@tanstack/react-query";
import { getPersonViewDashboardStats } from "@modules/dashboards/sr/services/srDashboardService.js";

export const usePersonViewDashboardStatistics = () => {
    const { data = { categories: [], series: [] }, isLoading, refetch } = useQuery({
        queryKey: ["personViewDashboardStatistics"],
        queryFn: () => getPersonViewDashboardStats(),
        enabled: true,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
    console.log(data);
    return { data, isLoading, refetch };

};
