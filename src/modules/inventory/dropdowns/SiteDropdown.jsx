import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const SiteDropdown = ({
                          control,
                          errors,
                          data,
                          multiple = false,
                          keyName = "equipment_site",
                          classes = "",
                          haveLabel = false,
                          name = "equipment_site_id",
                          onSiteSelect,
                      }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Site"
            apiUrl="/select/locations/"
            queryKeyBase="sites"
            className={classes}
            preselectedOptions={data ? formatOptions(data, keyName) : []}
            onSelectChange={onSiteSelect}
        />
    );
};

export default React.memo(SiteDropdown);
