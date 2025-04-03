import {
  createTask,
  updateTask,
  getTaskById,
  getTaskWithChild, updateTaskStatus, updateOverdueTask, fetchKanbanTasksAll, getTaskDetail,

} from "@modules/project-management/services/taskService.js";
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import taskSchema from "@modules/project-management/schemas/taskSchema.js";
import { useForm } from "react-hook-form";
import {useState, useEffect, useCallback} from "react";
import {useQuery} from "@tanstack/react-query";
import taskOverdueSchema from "@modules/project-management/schemas/taskOverdueSchema.js";


const useTaskForm = (isEditMode) => {
  const handleTaskSubmit = async (id, taskData) => {
    try {
     return isEditMode
          ?  await updateTask(id, taskData)
          :  await createTask(id, taskData)
    } catch (error) {
      throw error;
    }
  };

  return { handleTaskSubmit };
};

export const useTaskModal = (refetch) => {
  const [id, setId] = useState(null);
  const [milestoneDates, setMilestoneDates] = useState({ startedAt: null, endedAt: null });
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleTaskSubmit } = useTaskForm(isEditMode);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "in_progress",
      priority: "medium",
      description: "",
      start_date: "",
      end_date: ""
    },
  });

  // Fetch the task data if in edit mode
  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode && id) {
        try {
          const data = await getTaskById(id);
          setTaskData(data);
          reset(data);
        } catch (err) {
          console.error("Error fetching task:", err.message);
        }
      }
    };

    fetchTask();
  }, [id, isEditMode, reset]);

  const openTaskModal = (id = null, startedAt, endedAt, approval = false, parent = null, isEditMode = false) => {
    setId(id);
    setMilestoneDates({ startedAt, endedAt });
    setIsEditMode(isEditMode);
    setIsModalOpen(true);
    if (!isEditMode) {
      reset({
        status: "not_started",
        priority: "medium",
        description: "",
        parent: parent,
        requires_approval: approval,
        start_date: "",
        end_date: ""
      });
    }

    setTimeout(() => {
      const modal = document.getElementById("taskModal");
      if (modal) {
        window.HSOverlay.open(modal);
        modal.classList.add('open');
      }
    })
  };

  const closeTaskModal = () => {
    const modal = document.getElementById("taskModal");
    if (modal) {
      window.HSOverlay.close(modal);
    }
    reset();
    setTaskData(null);
    setIsEditMode(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const { start_date, end_date } = data;

    // Validate task dates fall between milestone dates
    if (milestoneDates.startedAt && new Date(start_date) < new Date(milestoneDates.startedAt)) {
      console.error("Start date cannot be before milestone start date");
      return;
    }
    if (milestoneDates.endedAt && new Date(end_date) > new Date(milestoneDates.endedAt)) {
      console.error("End date cannot be after milestone end date");
      return;
    }
    try {
      const response = await handleTaskSubmit(id, data);
      if (response.status){
        closeTaskModal();
        refetch()
      }
    } catch (error) {
      console.error("Failed to submit task:", error.message);
    }
  };

  return {
    taskData,
    openTaskModal,
    closeTaskModal,
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    isEditMode,
    isModalOpen,
    milestoneDates
  };
};


export const useTask = (id) => {
  const [taskData, setTaskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(id);
        setTaskData(data);
      } catch (err) {
        console.error("Error fetching task:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  return { taskData, isLoading };
};

export const useTaskWithChild = (taskId) => {
  const { data: task = {}, isLoading, refetch } = useQuery({
    queryKey: ['taskWithChild', taskId],
    queryFn: () => getTaskWithChild(taskId),
    enabled: !!taskId,
  });

  return { task, isLoading, refetch };
}

export const useUpdateTaskStatus = () => {
  const [isLoading, setLoading] = useState(false);

  const handleTaskStatus = useCallback(async (id, status) => {
    setLoading(true);
    try {
      return await updateTaskStatus(id, status);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleTaskStatus, isLoading };
};

export const useTaskOverdueModal = (refetch) => {
  const [id, setId] = useState(null);
  const [taskName, setTaskName] = useState(null);
  const [dates, setDates] = useState({ startedAt: null, endedAt: null });
  const [isOverdueTaskModalOpen, setIsModalOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskOverdueSchema),
  });

  const openTaskOverdueModal = (id, oldDueDate, taskName, startedAt, endedAt) => {
    setId(id);
    setTaskName(taskName);
    setDates({ startedAt, endedAt });
      reset({
        challenges: "",
        requested_due_date: oldDueDate,
        support_required: ""
      });
    setIsModalOpen(true)
    setTimeout(() => {
      const modal = document.getElementById("taskOverdueModal");
      if (modal) {
        window.HSOverlay.open(modal);
        modal.classList.add('open');
      }
    })
  };

  const closeTaskOverdueModal = () => {
    const modal = document.getElementById("taskOverdueModal");
    if (modal) {
      window.HSOverlay.close(modal);
    }
    reset();
    setId(null)
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const onOverdueTaskSubmit = async (data) => {
    try {
      const response = await updateOverdueTask(id, data);
      if (response.status){
        closeTaskOverdueModal();
        refetch()
      }
    } catch (error) {
      console.error("Failed to submit task:", error.message);
    }
  };

  return {
    taskName,
    openTaskOverdueModal,
    closeTaskOverdueModal,
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onOverdueTaskSubmit,
    isOverdueTaskModalOpen,
    dates
  };
};

export function useKanbanBoard({ filterPriority, searchQuery }) {
  const { data: initialData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["kanbanBoard", filterPriority, searchQuery],
    queryFn: () => fetchKanbanTasksAll(5, searchQuery, filterPriority, 0, ""),
    keepPreviousData: true,
  });

  const [statusTasks, setStatusTasks] = useState({});
  const [statusOffsets, setStatusOffsets] = useState({});
  const [loadingStatuses, setLoadingStatuses] = useState({});

  useEffect(() => {
    setStatusTasks({});
    setStatusOffsets({});
    setLoadingStatuses({});
    refetch();
  }, [filterPriority, searchQuery, refetch]);

  // Update tasks and offsets when initialData changes
  useEffect(() => {
    if (initialData?.data) {
      const newTasks = {};
      const newOffsets = {};
      Object.entries(initialData.data).forEach(([status, { tasks, task_count }]) => {
        newTasks[status] = tasks;
        newOffsets[status] = tasks.length;
      });
      setStatusTasks(newTasks);
      setStatusOffsets(newOffsets);
    }
  }, [initialData]);

  const loadMore = async (status) => {
    setLoadingStatuses((prev) => ({ ...prev, [status]: true }));

    const currentOffset = statusOffsets[status] || 0;

    try {
      const response = await fetchKanbanTasksAll(5, searchQuery, filterPriority, currentOffset, status);

      const newTasks = response.data[status]?.tasks || [];

      setStatusTasks((prev) => ({
        ...prev,
        [status]: [...(prev[status] || []), ...newTasks],
      }));

      setStatusOffsets((prev) => ({
        ...prev,
        [status]: currentOffset + newTasks.length,
      }));
    } catch (error) {
      console.error(`Error loading more tasks for ${status}:`, error);
    } finally {
      setLoadingStatuses((prev) => ({ ...prev, [status]: false }));
    }
  };

  const kanbanData = {};
  const hasMore = {};

  if (initialData?.data) {
    Object.entries(initialData.data).forEach(([status, { task_count }]) => {
      const loadedTasks = statusTasks[status] || [];
      kanbanData[status] = {
        tasks: loadedTasks,
        task_count,
      };
      hasMore[status] = loadedTasks.length < task_count;
    });
  }

  return {
    kanbanData,
    isLoading,
    loadingStatuses,
    loadMore,
    hasMore,
    refetch,
    isError,
    error,
  };
}


export const useTaskDetailModal = () => {
  const [id, setId] = useState(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  const openTaskDetailModal = (id) => {
    setId(id); // Set the task ID to trigger the query
    setIsTaskDetailModalOpen(true);
    setTimeout(() => {
      const modal = document.getElementById("taskDetailModal");
      if (modal) {
        window.HSOverlay.open(modal);
        modal.classList.add('open');
      }
    }, 200);
  };

  const closeTaskDetailModal = () => {
    const modal = document.getElementById("taskDetailModal");
    if (modal) {
      window.HSOverlay.close(modal);
    }
    setId(null);
    setTimeout(() => setIsTaskDetailModalOpen(false), 300);
  };

  const { data: task = {}, isLoading: isTaskDetailLoading, refetch } = useQuery({
    queryKey: ['taskDetail', id],
    queryFn: () => getTaskDetail(id),
    enabled: !!id,
  });

  return {
    openTaskDetailModal,
    closeTaskDetailModal,
    isTaskDetailModalOpen,
    isTaskDetailLoading,
    task,
  };
};

