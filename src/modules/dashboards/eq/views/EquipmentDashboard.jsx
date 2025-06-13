// src/modules/dashboards/equipment/components/EquipmentDashboard.jsx

import React, {useCallback, useEffect, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import EquipmentDashboardFilter from "@modules/dashboards/eq/components/EquipmentDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import EquipmentDashboardStats from "@modules/dashboards/eq/components/EquipmentDashboardStats.jsx";
import HasPermission from "@components/HasPermission.jsx";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
const EquipmentDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const companyId = useSelector((state) => state.auth.user.employee.company.id);

    // Initialize filters from URL
    const initialFilters = useMemo(() => {
        const params = Object.fromEntries(searchParams.entries());
        return {
            company_id: params.company_id || companyId,
            department_id: params.department_id || "",
            location_id: params.location_id || "",
            equipment_site_id: params.equipment_site_id || "",
            equipment_type_id: params.equipment_type_id || "",
            status: params.status || "",
            custodian_id: params.custodian_id || ""
        };
    }, [searchParams, companyId]);

    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters
    } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: 'company_id', defaultValue: initialFilters.company_id },
                { name: 'department_id', defaultValue: initialFilters.department_id },
                { name: 'location_id', defaultValue: initialFilters.location_id },
                { name: 'equipment_site_id', defaultValue: initialFilters.equipment_site_id },
                { name: 'equipment_type_id', defaultValue: initialFilters.equipment_type_id },
                { name: 'status', defaultValue: initialFilters.status },
                { name: 'custodian_id', defaultValue: initialFilters.custodian_id }
            ],
        }), [initialFilters])
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    // Reset form when URL changes
    useEffect(() => {
        resetFilters(initialFilters);
        setFilters(initialFilters);
    }, [initialFilters, resetFilters]);

    return (
        <>
            <PageHeader
                currentpage="Asset Dashboard"
                activepage="Dashboards"
                mainpage="Asset Management System"
            />
            <HasPermission permission='auth.equipment_dashboard_filters'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EquipmentDashboardFilter control={control} errors={errors} />
                </form>
            </HasPermission>
            <EquipmentDashboardStats filters={filters} />
        </>
    );
}

export default EquipmentDashboard;
