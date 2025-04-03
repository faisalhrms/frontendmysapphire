import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const WorkspaceDropdown = ({ control, errors, data, company_id = null, department_id = null, multiple = false, needObject = true, dataKey = 'workspace', classes = '', haveLabel = false, name = 'workspace_id', saveNewOption = true, placeholder='Workspace', onSelectChange }) => {
    const queryParams = [];

    if (company_id) {
        queryParams.push(`company_id=${company_id}`);
    }

    if (department_id) {
        queryParams.push(`department_id=${department_id}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            preselectedOptions={data ? formatOptions(data, dataKey) : []}
            saveOptionEndpoint="/select/pms/workspace/"
            allowSaveNewOption={saveNewOption}
            className={classes}
            apiUrl={`/select/pms/workspaces/${queryString}`}
            queryKeyBase={`pms_workspaces${queryParams.join('_')}`}
            needObject={needObject}
            onSelectChange={onSelectChange}
        />
    )
}
export default React.memo(WorkspaceDropdown);