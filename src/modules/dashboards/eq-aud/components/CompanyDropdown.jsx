import React from "react";
import { formatOptions } from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

/**
 * CompanyDropdown
 * - Supports `preselectedOptions` (same pattern as TaskQuickAdd)
 * - If `preselectedOptions` is not provided, it falls back to mapping `data`
 */
const CompanyDropdown = ({
                             control,
                             errors,
                             data,
                             multiple = false,
                             dataKey = "company",
                             classes = "",
                             haveLabel = false,
                             name = "company_id",
                             placeholder = "Company",
                             onCompanySelect,
                             preselectedOptions = [],   // <--- new, preferred
                         }) => {
    const mapped = data ? formatOptions(data, dataKey) : [];
    const initial = preselectedOptions.length > 0 ? preselectedOptions : mapped;

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            apiUrl="/select/companies/"
            queryKeyBase="companies"
            clientSideSearch={true}
            preselectedOptions={initial}
            className={classes}
            onSelectChange={onCompanySelect}
        />
    );
};

export default React.memo(CompanyDropdown);
