import React, {useCallback, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectDashboardFilter from "@modules/dashboards/pms/components/ProjectDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import HasPermission from "@components/HasPermission.jsx";
import ProjectDashboardTaskStats from "@modules/dashboards/pms/components/ProjectDashboardTaskStats.jsx";
import IconTabs from "@components/IconTabs.jsx";
import ProjectDashboardStats from "@modules/dashboards/pms/components/ProjectDashboardStats.jsx";
import {useSelector} from "react-redux";
import ProjectDashboardProjectTasksStatuses from "@modules/dashboards/pms/components/ProjectDashboardProjectTasksStatuses.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import ProjectDashboardProjectTasksPriorities
    from "@modules/dashboards/pms/components/ProjectDashboardProjectTasksPriorities.jsx";


const ProjectDashboard = () => {
    const companyId = useSelector((state) => state.auth.user.employee.company.id);
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'company_id', defaultValue: companyId},
                    { name: 'department_id'},
                    { name: 'workspace_id'},
                    { name: 'projects'},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());
    const [activeTab, setActiveTab] = useState('project_overview');
    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const { data, isLoading } = useFetchWithFilters(
        activeTab === "task_overview" ? '/dashboard/pms/task/statistics/' : activeTab === "project_status_overview" ? '/dashboard/pms/project/tasks/statuses/' : activeTab === "task_priority_overview" ? '/dashboard/pms/project/tasks/priorities/' : '/dashboard/pms/statistics/', filters
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
                            <ProjectDashboardStats data={data} isLoading={isLoading} isActive={'project_overview' === activeTab}  filters={filters}/>
                        ),
                    },
                    {
                        id: "task_overview",
                        label: "Task Overview",
                        icon: <i className="bx bx-bar-chart"></i>,
                        content: (
                            <>
                                <ProjectDashboardTaskStats data={data} isLoading={isLoading} isActive={'task_overview' === activeTab} />
                            </>
                        ),
                    },
                    {
                        id: "project_status_overview",
                        label: "Status Overview",
                        icon: <i className="bx bx-stats"></i>,
                        content: (
                            <>
                                <ProjectDashboardProjectTasksStatuses data={data} isLoading={isLoading} isActive={'project_status_overview' === activeTab} />
                            </>
                        ),
                    },
                    {
                        id: "task_priority_overview",
                        label: "Priority Overview",
                        icon: <i class='bx bx-line-chart'></i>,
                        content: (
                            <>
                                <ProjectDashboardProjectTasksPriorities data={data} isLoading={isLoading} isActive={'task_priority_overview' === activeTab} />
                            </>
                        ),
                    },
                ]}
                onTabChange={handleTabChange}
            />
        </>
    );
}

export default ProjectDashboard;
