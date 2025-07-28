import React, {useCallback, useState} from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EquipmentStatusCard from "@modules/dashboards/eq/components/EquipmentStatusCard.jsx";
import EquipmentAnalysisCard from "@modules/dashboards/eq/components/EquipmentAnalysisCard.jsx";
import RecentEquipmentCard from "@modules/dashboards/eq/components/RecentEquipmentCard.jsx";
import EquipmentSummaryStats from "@modules/dashboards/eq/components/EquipmentSummaryStats.jsx";
import EquipmentDepartmentStats from "@modules/dashboards/eq/components/EquipmentDepartmentStats.jsx";
import EquipmentTableCard from "@modules/dashboards/eq/components/EquipmentTableCard.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import EquipmentSiteStats from "@modules/dashboards/eq/components/EquipmentSiteStats.jsx";
import EquipmentSummaryCard from "@modules/dashboards/eq/components/EquipmentSummaryCard.jsx";
import EquipmentTypeChart from "@modules/dashboards/eq/components/EquipmentTypeChart.jsx";
import EquipmentValueStats from "@modules/dashboards/eq/components/EquipmentValueStats.jsx";
import {equipmentColumns} from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";

const EquipmentDashboardStats = ({ filters }) => {
    const { data: mainData, isLoading: mainLoading } = useFetchWithFilters('/dashboard/equipment/statistics/', filters);
    const { data: statusData, isLoading: statusLoading } = useFetchWithFilters('/dashboard/equipment/status-stats/', filters);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});

    const handleCardClick = useCallback((status) => {
        setModalParams({ status, company_id: filters.company_id });
        setModalOpen(true);
    }, [filters]);

    if (mainLoading || statusLoading) return <LoadingSpinner />;

    return (
        <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {Array.isArray(statusData) && statusData.map((item, index) => (
                    <EquipmentStatusCard
                        key={index}
                        item={item}
                        currentFilters={filters}
                        onCardClick={handleCardClick}
                    />
                ))}
            </div>

            {/* Analysis, Recent Equipments, and Summary */}
            <div className="grid grid-cols-12 gap-x-6 mt-4">
                <div className="xl:col-span-12 col-span-12">
                    <EquipmentSummaryCard filters={filters} />
                </div>
                <div className="xl:col-span-12 col-span-12">
                    <EquipmentTypeChart filters={filters} />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <EquipmentAnalysisCard filters={filters} />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <EquipmentDepartmentStats filters={filters} />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <EquipmentSiteStats filters={filters} />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <EquipmentValueStats filters={filters} />
                </div>
            </div>
            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams.status}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={modalParams}
                columns={equipmentColumns}
                addButton={null}
            />
        </>
    );
};


export default React.memo(EquipmentDashboardStats);
