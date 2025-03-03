import React, {useCallback, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import MilestoneAccordion from "@modules/project-management/components/project/MilestoneAccordion.jsx";
import ProjectsMilestonesTasksFilter from "@modules/project-management/components/project/ProjectsMilestonesTasksFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import {Link} from "react-router-dom";
import {PMS_ROUTES} from "@modules/project-management/routes.js";

const ProjectsMilestonesTasksList = () => {

    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "workspaces", defaultValue:[] },
                    { name: "projects" },
                    { name: "teams" },
                    { name: "status" },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onClear = useCallback(() => {
        resetFilters();
        setFilters(getFilters());
    }, [resetFilters, getFilters]);

    const {data, isLoading} = useFetchWithFilters('/pms/projects/projects-with-tasks/', filters);

    return (
        <>
            <PageHeader currentpage="E-com Deliverables" activepage="Projects" mainpage="Tasks"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ProjectsMilestonesTasksFilter control={control} errors={errors} clearFilter={onClear}/>
            </form>
            {isLoading ? (
                <LoadingSpinner/>
            ) : data?.length > 0 ? (
                <div className="grid grid-cols-12">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box custom-box">
                            <div className="box-body">
                                {data.map((project) => (
                                    <React.Fragment key={project.id}>
                                    <span className="flex flex-nowrap items-center space-x-1 mb-4 ml-4">
                                        <h4 className="text-[1.4rem] text-defaulttextcolor">
                                            <Link to={PMS_ROUTES.PROJECT.DETAIL.path.replace(':id', project.id)}>
                                                {project.name}
                                            </Link>
                                        </h4>
                                        <i className="ri-arrow-right-s-line"></i>
                                        <p className="text-[.9375rem] text-[#8c9097] dark:text-white/50 opacity-[7]">
                                          {project?.workspace?.name}
                                        </p>
                                      </span>
                                        <MilestoneAccordion
                                            key={`milestones-${project.id}`}
                                            milestones={project.milestones}
                                            projectStatus={project.status}
                                            viewOnly={true}
                                        />
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-span-12 flex items-center justify-center h-64">
                    <p className="text-lg text-gray-500">There are no tasks related to you.</p>
                </div>
            )}
        </>
    );
};

export default ProjectsMilestonesTasksList;
