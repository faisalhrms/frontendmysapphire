import React, { useMemo } from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

/**
 * LocationDropdown
 * - Filters by companyId via query string
 * - Supports disabled state until a company is chosen
 */
const LocationDropdown = ({
                              control,
                              errors,
                              data,
                              multiple = false,
                              keyName = "location",
                              classes = "",
                              haveLabel = false,
                              name = "location_id",
                              onSiteSelect,
                              preselectedOptions = [],
                              companyId = null,
                              isDisabled = false,
                          }) => {
    const mapped = data ? formatOptions(data, keyName) : [];
    const initial = preselectedOptions.length > 0 ? preselectedOptions : mapped;

    const apiUrl = useMemo(() => {
        const base = "/select/locations/";
        if (!companyId) return `${base}?company_id=`;
        return `${base}?company_id=${encodeURIComponent(companyId)}`;
    }, [companyId]);

    const queryKeyBase = useMemo(
        () => `locations-${companyId || "none"}`,
        [companyId]
    );

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder={isDisabled ? "Select a company first" : "Location"}
            apiUrl={apiUrl}
            queryKeyBase={queryKeyBase}
            className={classes}
            preselectedOptions={initial}
            onSelectChange={onSiteSelect}
            isDisabled={isDisabled}
        />
    );
};

export default React.memo(LocationDropdown);
