import React, {useCallback, useMemo, useState} from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import MilestoneAccordion from "@modules/project-management/components/project/MilestoneAccordion.jsx";
import ProjectsMilestonesTasksFilter from "@modules/project-management/components/project/ProjectsMilestonesTasksFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";

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
                    { name: "tags" },
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
            ) : (
                <div className="grid grid-cols-12">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box custom-box">
                            <div className="box-body">
                                {data?.map((project) => (
                                    <>
                                    <span key={project.id}
                                          className="flex flex-nowrap items-center space-x-1 mb-4 ml-4">
                                        <h4 className="text-[1.4rem] text-defaulttextcolor">
                                          {project.name}
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
                                    </>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectsMilestonesTasksList;
