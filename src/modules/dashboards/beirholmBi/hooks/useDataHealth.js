import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import dataHealth from "@modules/dashboards/beirholmBi/services/dataHealth.js"

const pick = f => Object.fromEntries(
  Object.entries(f || {}).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== ""
  )
)

const normalize = raw => {
  const f = { ...(raw || {}) }
  if (Array.isArray(f.period)) f.period = f.period.map(d => d?.value ?? d)
  if (Array.isArray(f.date)) f.date = f.date.map(d => d?.value ?? d)
  if (Array.isArray(f.header)) f.header = f.header.map(d => d?.value ?? d)
  if (Array.isArray(f.data_category)) f.data_category = f.data_category.map(d => d?.value ?? d)
  return pick(f)
}

export default function useDataHealth(rawFilters) {
  const filters = useMemo(() => normalize(rawFilters), [rawFilters])
  const enabled = Object.keys(filters).length > 0
  return useQuery({
    queryKey: ["dataHealth", filters],
    queryFn: () => dataHealth.get(filters),
    enabled,
    keepPreviousData: false,
    staleTime: 0,
    retry: false
  })
}
