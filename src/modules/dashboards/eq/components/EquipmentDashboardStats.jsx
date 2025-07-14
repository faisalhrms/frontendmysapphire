import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EquipmentStatusCard from "@modules/dashboards/eq/components/EquipmentStatusCard.jsx";
import EquipmentAnalysisCard from "@modules/dashboards/eq/components/EquipmentAnalysisCard.jsx";
import RecentEquipmentCard from "@modules/dashboards/eq/components/RecentEquipmentCard.jsx";
import EquipmentSummaryStats from "@modules/dashboards/eq/components/EquipmentSummaryStats.jsx";
import EquipmentDepartmentStats from "@modules/dashboards/eq/components/EquipmentDepartmentStats.jsx";
import EquipmentTableCard from "@modules/dashboards/eq/components/EquipmentTableCard.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import EquipmentSiteStats from "@modules/dashboards/eq/components/EquipmentSiteStats.jsx";

const EquipmentDashboardStats = ({ filters }) => {
    const { data: mainData, isLoading: mainLoading } = useFetchWithFilters('/dashboard/equipment/statistics/', filters);
    const { data: statusData, isLoading: statusLoading } = useFetchWithFilters('/dashboard/equipment/status-stats/', filters);

    if (mainLoading || statusLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {statusData?.map((item, index) => (
                    <EquipmentStatusCard
                        key={index}
                        item={item}
                        currentFilters={filters}
                    />
                ))}
            </div>

            {/* Analysis, Recent Equipments, and Summary */}
            <div className="grid grid-cols-12 gap-x-6 mt-4">
                <EquipmentAnalysisCard data={mainData.monthly_acquisitions} />

                <div className="xl:col-span-4 col-span-12">
                    <EquipmentSummaryStats summary={mainData.summary} />
                </div>

                <div className="xl:col-span-12 col-span-12">
                    <EquipmentDepartmentStats equipmentsByDepartment={mainData.equipments_by_department} />
                </div>

                <div className="xl:col-span-12 col-span-12">
                    <EquipmentSiteStats
                        equipmentsBySite={mainData.equipments_by_site}
                        statsFetching={!mainData.equipments_by_site}
                    />
                </div>
            </div>
        </>
    );
};

export default React.memo(EquipmentDashboardStats);
