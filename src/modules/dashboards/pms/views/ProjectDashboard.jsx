import React, {useCallback, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectDashboardFilter from "@modules/dashboards/pms/components/ProjectDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import HasPermission from "@components/HasPermission.jsx";
import ProjectDashboardTaskStats from "@modules/dashboards/pms/components/ProjectDashboardTaskStats.jsx";
import IconTabs from "@components/IconTabs.jsx";
import ProjectDashboardStats from "@modules/dashboards/pms/components/ProjectDashboardStats.jsx";


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
            <IconTabs
                tabs={[
                    {
                        id: "project_overview",
                        label: "Project Overview",
                        icon: <i className="bx bx-task"></i>,
                        content: (
                            <ProjectDashboardStats filters={filters}/>
                        ),
                    },
                    {
                        id: "task_overview",
                        label: "Task Overview",
                        icon: <i className="bx bx-bar-chart"></i>,
                        content: (
                            <>
                                <ProjectDashboardTaskStats filters={filters}/>
                            </>
                        ),
                    },
                ]}
            />
        </>
    );
}

export default ProjectDashboard;
