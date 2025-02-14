import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const ProjectCategoryDropdown = ({ control, errors, data, multiple = false, key = 'category', classes = '', haveLabel = false, name = 'category_id', saveNewOption = true }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Category"
            preselectedOptions={data ? formatOptions(data, key) : []}
            saveOptionEndpoint="/select/pms/category/"
            allowSaveNewOption={saveNewOption}
            className={classes}
            apiUrl={`/select/pms/categories/`}
            queryKeyBase={`pms_categories}`}
        />
    )
}
export default React.memo(ProjectCategoryDropdown);