// src/modules/dashboards/equipment/components/EquipmentDashboardStats.jsx

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
    const { data, isLoading } = useFetchWithFilters('/dashboard/equipment/statistics/', filters);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data?.statuses?.map((item, index) => (
                    <EquipmentStatusCard
                        key={index}
                        item={item}
                    />
                ))}
            </div>

            {/* Analysis, Recent Equipments, and Summary */}
            <div className="grid grid-cols-12 gap-x-6 mt-4">
                <EquipmentAnalysisCard
                    data={data.monthly_acquisitions}
                />

                <div className="xl:col-span-4 col-span-12">
                    <EquipmentSummaryStats summary={data.summary} />
                </div>
                <div className="xl:col-span-12 col-span-12">
                    <EquipmentDepartmentStats equipmentsByDepartment={data.equipments_by_department} />
                </div>
                {/* Add the new EquipmentSiteStats component */}
                <div className="xl:col-span-12 col-span-12">
                    <EquipmentSiteStats
                        equipmentsBySite={data.equipments_by_site} // Ensure this exists in the API response
                        statsFetching={!data.equipments_by_site} // Adjust fetching logic as needed
                    />
                </div>

            </div>
        </>
    )
}

export default React.memo(EquipmentDashboardStats);
