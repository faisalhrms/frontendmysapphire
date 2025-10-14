import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import exportData from "@modules/dashboards/beirholmBi/services/exportData.js"

export default function useExportData(filters) {
  const enabled = useMemo(() => {
    if (!filters || typeof filters !== "object") return false
    return Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== "")
  }, [filters])

  return useQuery({
    queryKey: ["exportData", filters],
    queryFn: () => exportData.get(filters),
    enabled,
    keepPreviousData: false,
    staleTime: 0,
    retry: false
  })
}
