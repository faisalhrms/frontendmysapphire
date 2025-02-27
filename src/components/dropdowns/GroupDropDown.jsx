import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import React from "react";

const GroupDropDown = ({control, errors, data,multiple = false,key = 'group', classes = '', haveLabel = false, name = 'group_id', onGroupSelect}) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Groups"
            apiUrl="/select/roles/"
            queryKeyBase="groups"
            className={classes}
            preselectedOptions={data ? formatOptions(data, key) : []}
            onSelectChange={onGroupSelect}
        />
    )
}
export default GroupDropDown