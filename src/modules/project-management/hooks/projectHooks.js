import {useCallback, useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    createProject, editProjectById,
    getProjectById, getProjectMilestoneDashboardStats,
    getProjectMilestonesWithTasks, getProjectMilestoneTaskDashboardStats,
    getProjects, getProjectStats,
    toggleFavouriteProject,
    updateProject, uploadProjects
} from "@modules/project-management/services/projectService.js";

import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import uploadProjectSchema from "@modules/project-management/schemas/uploadProjectSchema.js";
import {uploadTasks} from "@modules/project-management/services/taskService.js";
import {uploadMilestones} from "@modules/project-management/services/milestoneService.js";
import {useConflictHook} from "@modules/project-management/hooks/conflictHooks.js";
import projectFilterSchema from "@modules/project-management/schemas/projectFilterSchema.js";
import {useSelector} from "react-redux";

export const useProjects = (page = 1, size = 8, search, workspaces = null, status = null, priority = null, tags = null) => {
    const query = useQuery({
        queryKey: ['projects', page, size, search, workspaces, status, priority, tags],
        queryFn: () => getProjects(page, size, search, workspaces, status, priority, tags),
        keepPreviousData: false,
        staleTime: 0,
    });

    return {
        ...query,
        refetch: query.refetch,
    };
};

export const useProjectForm = (projectData, isEditMode) => {
    const navigate = useNavigate();
    const { haveConflict, conflicts, handleConflict, closeConflictModal } = useConflictHook();

    const handleProjectSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateProject(projectData.id, data);
            } else {
                await createProject(data);
            }
            navigate('/module/projects');
        } catch (error) {
            if (error.response) {
                const { status, data: errorData } = error.response;
                if (status === 409) {
                    handleConflict(errorData);
                }
            }
        }
    };

    return { handleProjectSubmit, haveConflict, conflicts, closeConflictModal };
};

export const useProject = (id, forEdit = false) => {
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = forEdit ? await editProjectById(id) : await getProjectById(id);
                setProjectData(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchProject();
    }, [id]);

    return { projectData };
};

export const useProjectMilestonesWithTasks = (projectId) => {
    const { data: milestones = [], isLoading, refetch } = useQuery({
        queryKey: ['projectMilestones', projectId],
        queryFn: () => getProjectMilestonesWithTasks(projectId),
        enabled: !!projectId,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { milestones, isLoading, refetch };
}

export const useProjectStatistics = (projectId = null, months = 6, options = {}) => {
    const {
        data: statistics = [],
        isLoading: statsFetching,
        refetch: statsRefetch,
        error: statsError,
    } = useQuery({
        queryKey: ['projectStatistics', projectId],
        queryFn: () => getProjectStats(projectId, months),
        enabled: options.enabled || false,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        ...options,
    });

    return { statistics, statsFetching, statsRefetch, statsError };
}

export const useToggleFavouriteProject = () => {
    const [isLoading, setLoading] = useState(false);

    const handleToggleFavourite = useCallback(async (id, isFavourite) => {
        setLoading(true);
        try {
            return await toggleFavouriteProject(id, isFavourite);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleToggleFavourite, isLoading };
};

export const useUploadProjectModal = (refetch, type = 'P') => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [id, setId] = useState(null);
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(uploadProjectSchema),
    });

    const openUploadModal = (id = null) => {
        setIsUploadModalOpen(true);
        setTimeout(() => {
            const modal = document.getElementById("uploadProjectModal");
            if (modal) {
                window.HSOverlay.open(modal);
                modal.classList.add('open');
            }
            type !== 'P' && setId(id);
        })
    };

    const closeUploadModal = () => {
        const modal = document.getElementById("uploadProjectModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        setTimeout(() => setIsUploadModalOpen(false), 350);
        setId(null);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('file', data.file);

        let response;

        if (type === 'P') {
            response = await uploadProjects(formData);
        } else if (type === 'T') {
            response = await uploadTasks(id, formData);
        } else if (type === 'M') {
            response = await uploadMilestones(id, formData);
        }

        if (response && response.status) {
            closeUploadModal();
            refetch();
        }
    };

    return {
        openUploadModal,
        closeUploadModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isUploadModalOpen,
    };
};

export const useProjectFilter = () => {
    const filters = useSelector((state) => state.pms.filters);
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(projectFilterSchema),
        defaultValues: {
            status: filters.status,
            priority: filters.priority,
            workspaces: filters.workspaces
                ? filters.workspaces
                    .map(workspace => workspace.id || null)
                    .filter(value => value !== null)
                : []
        },
    });

    return {
        filterControl : control,
        filterSubmit: handleSubmit,
        filterErrors: errors,
        isFiltering: isSubmitting
    }
}

export const useProjectMilestoneDashboardStatistics = (projectId) => {
    const { data = {}, isLoading } = useQuery({
        queryKey: ['projectMilestoneDashboardStatistics', projectId],
        queryFn: () => getProjectMilestoneDashboardStats(projectId),
        enabled: !!projectId,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading };
}

export const useProjectMilestoneTaskDashboardStatistics = (milestoneId) => {
    const { data = {}, isLoading } = useQuery({
        queryKey: ['projectMilestoneTaskDashboardStatistics', milestoneId],
        queryFn: () => getProjectMilestoneTaskDashboardStats(milestoneId),
        enabled: !!milestoneId,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading };
}

export const useMilestoneSearch = (items, searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return items.reduce((acc, item) => {
        const matchesName = item.name && item.name.toLowerCase().includes(lowerCaseSearchTerm);
        const matchesPriority = item.priority && item.priority.toLowerCase().includes(lowerCaseSearchTerm);
        const matchesStatus = item.status && item.status.toLowerCase().includes(lowerCaseSearchTerm);
        const matchesTeams = item.teams && item.teams.some(team => team.name.toLowerCase().includes(lowerCaseSearchTerm));
        const matchesUsers = item.users && item.users.some(user => user.full_name.toLowerCase().includes(lowerCaseSearchTerm));
        if (matchesName || matchesPriority || matchesStatus || matchesTeams || matchesUsers) {
            const filteredChildren = item.children
                ? useMilestoneSearch(item.children, searchTerm)
                : [];

            acc.push({ ...item, children: filteredChildren.length > 0 ? filteredChildren : item.children });
        } else if (item.children && item.children.length > 0) {
            const filteredChildren = useMilestoneSearch(item.children, searchTerm);
            if (filteredChildren.length > 0) {
                acc.push({ ...item, children: filteredChildren });
            }
        }

        return acc;
    }, []);
};
