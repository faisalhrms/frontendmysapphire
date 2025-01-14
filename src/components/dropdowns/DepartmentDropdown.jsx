import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const DepartmentDropdown = ({ control, errors, data, company_id = null, multiple = false, key = 'department', classes = '', haveLabel = false, name = 'department_id', onDepartmentSelect}) => {

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Department"
            apiUrl={`/select/departments/${company_id ? `?company_id=${company_id}` : ''}`}
            queryKeyBase={`departments${company_id ? `${company_id}` : ''}`}
            className={classes}
            preselectedOptions={data ? formatOptions(data, key) : []}
            onSelectChange={onDepartmentSelect}
        />
    )
}

export default React.memo(DepartmentDropdown);