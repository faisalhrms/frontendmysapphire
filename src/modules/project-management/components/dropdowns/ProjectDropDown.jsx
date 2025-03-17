import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import React from "react";

const ProjectDropDown = ({ control, errors, workspace_id, multiple = true, name = "projects", placeholder = "Projects" }) => {

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={false}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            preselectedOptions={[]}
            apiUrl={`/select/pms/projects/${workspace_id ? `?workspace_id=${workspace_id}` : ''}`}
            queryKeyBase={`projects-${workspace_id}`}
        />
    );
};

export default React.memo(ProjectDropDown);