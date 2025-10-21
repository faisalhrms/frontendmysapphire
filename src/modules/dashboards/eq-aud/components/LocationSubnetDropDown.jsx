import React, { useMemo } from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

/**
 * LocationSubnetDropDown
 * - Filters by locationId via query string
 * - Disabled until location is selected
 * - label: IP, value: subnet ID (from backend)
 */
const LocationSubnetDropDown = ({
                                    control,
                                    errors,
                                    locationId,
                                    multiple = false,
                                    name,
                                    preselectedOptions = [],
                                    onSubnetSelect,
                                    classes = "",
                                    haveLabel = false,
                                    is_required = false,
                                    isDisabled = false,
                                }) => {
    const computedName = useMemo(
        () => name || (multiple ? "subnet_ids" : "subnet_id"),
        [name, multiple]
    );

    const apiUrl = useMemo(() => {
        const base = "/select/subnet-ips/";
        if (!locationId) return `${base}?location_id=`;
        return `${base}?location_id=${encodeURIComponent(locationId)}`;
    }, [locationId]);

    const queryKeyBase = useMemo(
        () => `subnet-ips-${locationId || "none"}`,
        [locationId]
    );

    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={computedName}
            control={control}
            errors={errors}
            placeholder={isDisabled ? "Select a location first" : "Subnet (IP)"}
            apiUrl={apiUrl}
            queryKeyBase={queryKeyBase}
            className={classes}
            preselectedOptions={preselectedOptions}
            onSelectChange={onSubnetSelect}
            is_required={is_required}
            isClearable
            isDisabled={isDisabled}
        />
    );
};

export default React.memo(LocationSubnetDropDown);
