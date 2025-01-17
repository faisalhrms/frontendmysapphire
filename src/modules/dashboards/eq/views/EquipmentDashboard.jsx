// src/modules/dashboards/equipment/components/EquipmentDashboard.jsx

import React, { useCallback, useMemo, useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentDashboardFilter from "@modules/dashboards/eq/components/EquipmentDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import EquipmentDashboardStats from "@modules/dashboards/eq/components/EquipmentDashboardStats.jsx";
import HasPermission from "@components/HasPermission.jsx";

const EquipmentDashboard = () => {
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'company_id' },
                    { name: 'department_id' },
                    { name: 'location_id' },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    return (
        <>
            <PageHeader
                currentpage="Equipment Dashboard"
                activepage="Dashboards"
                mainpage="Inventory Management System"
            />
            <HasPermission permission='equipment_dashboard_filters'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EquipmentDashboardFilter control={control} errors={errors} />
                </form>
            </HasPermission>
            <EquipmentDashboardStats filters={filters} />
        </>
    );
}

export default EquipmentDashboard;
