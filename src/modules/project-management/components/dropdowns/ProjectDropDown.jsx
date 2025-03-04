import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import React from "react";

const ProjectDropDown = ({ control, errors, workspaces_id = [], multiple = true, name = "projects", placeholder = "Projects" }) => {
    const queryParams = [];
console.log(workspaces_id);
    if (workspaces_id.length > 0) {
        queryParams.push(`workspaces_id=${workspaces_id.join(',')}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={false}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            preselectedOptions={[]}
            saveOptionEndpoint="/select/pms/project/"
            allowSaveNewOption={false}
            apiUrl={`/select/pms/projects/${queryString}`}
            queryKeyBase={`pms_projects${queryParams.join('_')}`}
            needObject={true}

        />
    );
};

export default React.memo(ProjectDropDown);