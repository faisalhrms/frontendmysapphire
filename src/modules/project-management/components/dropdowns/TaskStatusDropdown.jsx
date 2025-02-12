import FormSelect from "@components/form/FormSelect.jsx";
import React, { useEffect } from "react";
import { taskStatuses } from "@modules/project-management/services/taskService.js";
import { useForm } from "react-hook-form";
import { useUpdateTaskStatus } from "@modules/project-management/hooks/taskHooks.js";

const TaskStatusDropdown = ({ status, taskId, refetch }) => {
    const { handleTaskStatus, isLoading } = useUpdateTaskStatus();

    const { control, formState: { errors }, reset } = useForm({
        defaultValues: {
            status: status,
        },
    });

    useEffect(() => {
        reset({ status });
    }, [status, taskId, reset]);

    const handleStatusChange = async (newStatus) => {
        await handleTaskStatus(taskId, newStatus);
        if (refetch) {
            refetch();
        }
    };

    return (
        <FormSelect
            label={false}
            name="status"
            control={control}
            errors={errors}
            options={taskStatuses}
            placeholder="Status"
            isClearable={false}
            onSelectChange={handleStatusChange}
            className='select-sm'
        />
    );
};

export default React.memo(TaskStatusDropdown);