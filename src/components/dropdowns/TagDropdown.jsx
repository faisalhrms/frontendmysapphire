import {formatOptions} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import React from "react";

const TagDropdown = ({
                             control,
                             errors,
                             data,
                             multiple = true,
                             dataKey = 'tags',
                             classes = '',
                             haveLabel = false,
                             name = 'tag_ids',
                             placeholder='Tags',
                             onTagSelect
                         }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            apiUrl="/select/tags/"
            queryKeyBase="tags"
            preselectedOptions={data ? formatOptions(data, dataKey) : []}
            className={classes}
            onSelectChange={onTagSelect}
        />
    )
}
export default React.memo(TagDropdown);