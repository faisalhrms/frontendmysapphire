import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const WorkspaceDropdown = ({ control, errors, data, multiple = false, key = 'workspace', classes = '', haveLabel = false, name = 'workspace_id', saveNewOption = true }) => {

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Workspace"
            apiUrl={`/select/pms/workspaces/`}
            queryKeyBase={`pms_workspaces`}
            preselectedOptions={data ? formatOptions(data, key) : []}
            saveOptionEndpoint="/select/pms/workspace/"
            allowSaveNewOption={saveNewOption}
            className={classes}
        />
    )
}

export default WorkspaceDropdown