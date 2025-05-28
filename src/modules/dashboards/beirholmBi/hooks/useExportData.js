import { useQuery } from "@tanstack/react-query";
import exportData from "@modules/dashboards/beirholmBi/services/exportData.js";

export default function useExportData(filters) {
  return useQuery({
    queryKey: ["exportData", filters],
    queryFn: () => exportData.get(filters),
    enabled: !!filters,
    keepPreviousData: true
  });
}
