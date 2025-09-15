import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

/**
 * Dropdown specifically for selecting the "Replaced By" user
 */
const ReplacedByDropdown = ({
                                control,
                                errors,
                                company_id = null,
                                multiple = false,
                                classes = "",
                                haveLabel = false,
                                name = "replaced_by_id",
                                defaultUser = null,
                                onUserSelect
                            }) => {
    // If company filtering is needed
    const apiUrl = company_id
        ? `/select/custodians/?company_id=${company_id}`
        : `/select/custodians/`;

    const queryKeyBase = company_id
        ? `custodians_company_${company_id}`
        : `custodians`;

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel ? "Replaced By" : false}
            name={name}
            control={control}
            errors={errors}
            placeholder="Replaced By"
            apiUrl={apiUrl}
            queryKeyBase={queryKeyBase}
            className={classes}
            preselectedOptions={
                defaultUser
                    ? [{
                        label: `${defaultUser.full_name}${
                            defaultUser.email ? ` (${defaultUser.email})` : ""
                        }`,
                        value: defaultUser.id
                    }]
                    : []
            }
            onSelectChange={onUserSelect}
        />
    );
};

export default React.memo(ReplacedByDropdown);
