import FormSelect from "@components/form/FormSelect.jsx";
import { priorities } from "@modules/project-management/services/taskService.js";
import React from "react";

const TaskPriorityDropDown = ({ control, errors, haveLabel = false }) => {
    return (
        <FormSelect
            label={haveLabel}
            name="priority"
            control={control} // Make sure this is correctly handled
            errors={errors}
            options={priorities}
            placeholder="Priority"
        />
    );
};

export default TaskPriorityDropDown;
