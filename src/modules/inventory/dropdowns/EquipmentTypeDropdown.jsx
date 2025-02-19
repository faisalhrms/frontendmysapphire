import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";

const EquipmentTypeDropdown = ({
                                   control,
                                   errors,
                                   data,
                                   multiple = false,
                                   keyName = "equipment_type",
                                   classes = "",
                                   haveLabel = false,
                                   name = "equipment_type_id",
                                   onTypeSelect,
                               }) => {
    return (
        <FormAsyncSelect
            isMulti={multiple}
            label={haveLabel}
            name={name}
            control={control}
            errors={errors}
            placeholder="Equipment Type"
            apiUrl="/select/equipment/types/"
            queryKeyBase="equipment_types"
            className={classes}
            preselectedOptions={data ? formatOptions(data, keyName, "id", "name") : []}
            onSelectChange={onTypeSelect}
        />
    );
};

export default React.memo(EquipmentTypeDropdown);
