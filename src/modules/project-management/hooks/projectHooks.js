import {useCallback, useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    createProject,
    getProjectById, getProjectDashboardStats,
    getProjectMilestonesWithTasks,
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
import projectDashboardFilterSchema from "@modules/project-management/schemas/projectDashboardFilterSchema.js";

export const useProjects = (page = 1, size = 8, search, workspaces = null, status = null, priority = null) => {
    const query = useQuery({
        queryKey: ['projects', page, size, search, workspaces, status, priority],
        queryFn: () => getProjects(page, size, search, workspaces, status, priority),
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

export const useProject = (id) => {
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id);
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
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(projectFilterSchema),
    });

    return {
        filterControl : control,
        filterSubmit: handleSubmit,
        filterErrors: errors,
        isFiltering: isSubmitting
    }
}

export const useProjectDashboardStatistics = (filters) => {
    const { data = {}, isLoading } = useQuery({
        queryKey: ['projectDashboardStatistics', filters],
        queryFn: () => getProjectDashboardStats(filters),
        enabled: !!filters,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    return { data, isLoading };
}