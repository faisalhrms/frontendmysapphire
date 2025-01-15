import {formatOptions} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import React from "react";

const CompanyDropdown = ({
                             control,
                             errors,
                             data,
                             multiple = false,
                             key = 'company',
                             classes = '',
                             haveLabel = false,
                             name = 'company_id',
                             onCompanySelect
                         }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Company"
            apiUrl="/select/companies/"
            queryKeyBase="companies"
            clientSideSearch={true}
            preselectedOptions={data ? formatOptions(data, key) : []}
            className={classes}
            onSelectChange={onCompanySelect}
        />
    )
}
export default React.memo(CompanyDropdown);