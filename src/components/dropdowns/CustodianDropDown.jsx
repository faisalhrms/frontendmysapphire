// @modules/inventory/components/CustodianDropdown.jsx

import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const CustodianDropdown = ({
                               control,
                               errors,
                               data,
                               company_id = null, // Accept company_id as a prop
                               multiple = false,
                               key = "custodian",
                               classes = "",
                               haveLabel = false,
                               name = "custodian_id",
                               onCustodianSelect,
                           }) => {
    // Construct the API URL with company_id if provided
    const apiUrl = company_id
        ? `/select/custodians/?company_id=${company_id}`
        : `/select/custodians/`;

    const queryKeyBase = company_id
        ? `custodians_company_${company_id}`
        : `custodians`;

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Custodian"
            apiUrl={apiUrl}
            queryKeyBase={queryKeyBase}
            className={classes}
            preselectedOptions={
                data?.custodian
                    ? [
                        {
                            label: `${data.custodian.full_name} ${
                                data.custodian.email ? `(${data.custodian.email})` : ""
                            }`,
                            value: data.custodian.id,
                        },
                    ]
                    : []
            }
            onSelectChange={onCustodianSelect}
        />
    );
};

export default React.memo(CustodianDropdown);
