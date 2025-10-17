// @modules/dashboard/hooks/useEquipmentDashboard.js
import { useQuery } from "@tanstack/react-query";
import {
    getSummary,
    getStatusStats,
    getTypeStats,
    getDepartmentStats,
    getSiteStats,
    getValueStats,
    getMonthlyAcquisition,
    getAgeBuckets,
    getWarrantyExpiring,
    getVerificationProgress,
    getRepairsSummary,
    getTopAssets,
    getReplacementsSummary,
} from "@modules/dashboards/eq/services/equipmentDashboardService.js";

/**
 * Adapter: map BE shapes -> FE shapes your current UI expects.
 * - site_stats: repo returns 'equipment_site__name' -> UI expects 'site__name'
 * - value_stats: repo returns 'total_value' -> UI expects 'value'
 * - monthly-acquisition: repo returns {month, count} -> UI expects {date, count}
 */
const adapt = ({
                   summary,
                   statusStats,
                   typeStats,
                   deptStats,
                   siteStats,
                   valueStats,
                   monthly,
                   age,
                   warranty,
                   verification,
                   repairs,
                   assets,
                   replacements,
               }) => {
    const site_stats = (siteStats || []).map((r) => ({
        ...r,
        site__name: r.equipment_site__name ?? r.site__name, // keep both just in case
    }));

    const value_stats = (valueStats || []).map((r) => ({
        ...r,
        value: r.total_value ?? r.value ?? 0,
    }));

    const series = (monthly || []).map((r) => ({
        date: r.month ?? r.date, // normalize to "date"
        count: r.count ?? 0,
    }));

    return {
        // Keep your component's expected structure
        stats: {
            summary: summary || {},
            status_stats: statusStats || [],
            type_stats: typeStats || [],
            department_stats: deptStats || [],
            site_stats,
            value_stats,
        },
        series,
        age: age || [],
        warranty: warranty || { total: 0, items: [] },
        verification: verification || { total: 0, verified: 0, percent: 0 },
        repairs: repairs || { total_repairs: 0, total_cost: 0, avg_turnaround_days: 0, open_repairs: 0, series: [] },
        assets: assets || [],
        replacements: replacements || { total_replacements: 0, series: [] },
    };
};

/**
 * Later (when you wire filters), pass them in; we keep it optional now.
 * Example shape BE accepts: { company_id, department_id, location_id, equipment_site_id, equipment_type_id, ... }
 */
export function useEquipmentDashboard(params) {
    return useQuery({
        queryKey: ["equipmentDashboard", params],
        queryFn: async () => {
            // fetch all in parallel
            const [
                summary,
                statusStats,
                typeStats,
                deptStats,
                siteStats,
                valueStats,
                monthly,
                age,
                warranty,
                verification,
                repairs,
                assets,
                replacements,
            ] = await Promise.all([
                getSummary(params),
                getStatusStats(params),
                getTypeStats(params),
                getDepartmentStats(params),
                getSiteStats(params),
                getValueStats(params),
                getMonthlyAcquisition(params),
                getAgeBuckets(params),
                getWarrantyExpiring({ ...params, days: 30 }),
                getVerificationProgress(params),
                getRepairsSummary(params),
                getTopAssets({ ...params, by: "purchase_price", direction: "desc", limit: 10 }),
                getReplacementsSummary(params),
            ]);

            return adapt({
                summary,
                statusStats,
                typeStats,
                deptStats,
                siteStats,
                valueStats,
                monthly,
                age,
                warranty,
                verification,
                repairs,
                assets,
                replacements,
            });
        },
        staleTime: 60_000,          // 1 minute cache
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
