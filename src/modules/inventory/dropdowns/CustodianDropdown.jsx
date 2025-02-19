import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const CustodianDropdown = ({
                               control,
                               errors,
                               data,
                               multiple = false,
                               keyName = "custodian",
                               classes = "",
                               haveLabel = false,
                               name = "custodian_id",
                               onCustodianSelect,
                           }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Custodian"
            apiUrl="/select/custodians/"
            queryKeyBase="custodians"
            className={classes}
            preselectedOptions={data ? formatOptions(data, keyName, "id", "name") : []}
            onSelectChange={onCustodianSelect}
        />
    );
};

export default React.memo(CustodianDropdown);
