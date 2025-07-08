// src/modules/policies/components/UserDropdown.jsx
import React from 'react';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { formatOptions } from '@helpers/formatters.js';

const UserDropdown = ({
                          control,
                          errors,
                          data,
                          companyIds = [],
                          departmentIds = [],
                          multiple = false,
                          needObject = false,
                          classes = '',
                          haveLabel = false,
                          name = 'user_ids',
                          onSelectChange,
                      }) => {
    const params = [];
    companyIds.forEach(id => params.push(`company_id=${id}`));
    departmentIds.forEach(id => params.push(`department_id=${id}`));
    const queryString = params.length ? `?${params.join('&')}` : '';

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            needObject={needObject}
            placeholder="Select Users"
            apiUrl={`/select/users/${queryString}`}
            queryKeyBase={`users${params.join('_')}`}
            className={classes}
            preselectedOptions={data ? formatOptions(data, 'users') : []}
            onSelectChange={onSelectChange}
        />
    );
};

export default React.memo(UserDropdown);