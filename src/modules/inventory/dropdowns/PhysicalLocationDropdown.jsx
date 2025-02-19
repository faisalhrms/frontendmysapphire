import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const PhysicalLocationDropdown = ({
                                      control,
                                      errors,
                                      data,
                                      multiple = false,
                                      keyName = "location",
                                      classes = "",
                                      haveLabel = false,
                                      name = "location_id",
                                      onLocationSelect,
                                  }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Physical Location"
            apiUrl="/select/equipment/locations/"
            queryKeyBase="physical_locations"
            className={classes}
            preselectedOptions={data ? formatOptions(data, keyName, "id", "name") : []}
            onSelectChange={onLocationSelect}
        />
    );
};

export default React.memo(PhysicalLocationDropdown);
