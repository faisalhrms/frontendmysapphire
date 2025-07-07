import React from 'react';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { formatOptions } from '@helpers/formatters.js';

const DepartmentDropdown = ({
                                control,
                                errors,
                                data,
                                companyIds = [],
                                multiple = false,
                                needObject = false,
                                classes = '',
                                haveLabel = false,
                                name = 'department_ids',
                                onSelectChange,
                            }) => {
    const queryString = companyIds.length
        ? `?${companyIds.map(id => `company_id=${id}`).join('&')}`
        : '';

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            needObject={needObject}
            placeholder="Select Departments"
            apiUrl={`/select/departments/${queryString}`}
            queryKeyBase={`departments${companyIds.join('_')}`}
            className={classes}
            preselectedOptions={data ? formatOptions(data, 'departments') : []}
            onSelectChange={onSelectChange}
        />
    );
};

export default React.memo(DepartmentDropdown);
