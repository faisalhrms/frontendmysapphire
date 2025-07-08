// src/modules/policies/components/CompanyDropdown.jsx
import React from 'react';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { formatOptions } from '@helpers/formatters.js';

const CompanyDropdown = ({
                             control,
                             errors,
                             data,
                             multiple = false,
                             needObject = false,
                             classes = '',
                             haveLabel = false,
                             name = 'company_ids',
                             onSelectChange,
                         }) => (
    <FormAsyncSelect
        isMulti={multiple}
        label={haveLabel}
        name={name}
        control={control}
        errors={errors}
        needObject={needObject}
        placeholder="Select Companies"
        apiUrl="/select/companies/"
        queryKeyBase="companies"
        className={classes}
        preselectedOptions={data ? formatOptions(data, 'companies') : []}
        onSelectChange={onSelectChange}
    />
);

export default React.memo(CompanyDropdown);
