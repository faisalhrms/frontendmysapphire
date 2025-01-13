import FormSelect from "@components/form/FormSelect.jsx";
import {projectStatuses} from "@modules/project-management/services/projectService.js";
import React from "react";

const ProjectStatusDropdown = ({ control, errors, haveLabel = false }) => {
    return (
        <FormSelect
            label={haveLabel}
            name="status"
            control={control}
            errors={errors}
            options={projectStatuses}
            placeholder="Status"
        />
    )
}

export default ProjectStatusDropdown