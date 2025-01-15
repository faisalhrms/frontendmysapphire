import React, {useCallback, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectDashboardFilter from "@modules/dashboards/pms/components/ProjectDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import ProjectDashboardStats from "@modules/dashboards/pms/components/ProjectDashboardStats.jsx";
import HasPermission from "@components/HasPermission.jsx";


const ProjectDashboard = () => {

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'company_id'},
                    { name: 'department_id'},
                    { name: 'workspace_id'},
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

    return(
        <>
            <PageHeader currentpage="Project Dashboard" activepage="Dashboards" mainpage="Project Management System"/>
            <HasPermission permission='pms_dashboard_filters'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ProjectDashboardFilter control={control} errors={errors}/>
                </form>
            </HasPermission>
            <ProjectDashboardStats filters={filters}/>
        </>
    );
}

export default ProjectDashboard;
