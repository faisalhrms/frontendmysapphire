import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const SubDepartmentDropdown = ({ control, errors, data, department_id = null, multiple = false, key = 'sub_department', classes = '', haveLabel = false, name = 'sub_department_id', onSubDepartmentSelect}) => {

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Sub Department"
            apiUrl={`/select/sub-departments/${department_id ? `?department_id=${department_id}` : ''}`}
            queryKeyBase={`sub-departments${department_id ? `${department_id}` : ''}`}
            className={classes}
            preselectedOptions={data ? formatOptions(data, key) : []}
            onSelectChange={onSubDepartmentSelect}
        />
    )
}

export default React.memo(SubDepartmentDropdown);