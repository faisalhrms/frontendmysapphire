import {formatOptions} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import React from "react";

const CompanyDropdown = ({
                             control,
                             errors,
                             eqData,
                             multiple = false,
                             dataKey = 'company',
                             classes = '',
                             haveLabel = false,
                             name = 'company_id',
                             placeholder='Company',
                             onCompanySelect
                         }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            apiUrl="/select/user/companies/"
            queryKeyBase="companies"
            clientSideSearch={true}
            isClearable={false}
            preselectedOptions={eqData ? formatOptions(eqData, dataKey) : []}
            className={classes}
            onSelectChange={onCompanySelect}
        />
    )
}
export default React.memo(CompanyDropdown);