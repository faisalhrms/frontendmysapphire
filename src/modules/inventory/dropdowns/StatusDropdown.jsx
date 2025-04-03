import React from "react";
import FormSelect from "@components/form/FormSelect.jsx";

const StatusDropdown = ({
                            control,
                            errors,
                            classes = "",
                            haveLabel = false,
                            name = "status",
                            onStatusSelect,
                            // Pass your static status options here
                            options = [],
                        }) => {
    return (
        <FormSelect
            name={name}
            control={control}
            errors={errors}
            placeholder="Status"
            options={options}
            label={haveLabel ? "Status" : ""}
            className={classes}
            onChange={onStatusSelect}
        />
    );
};

export default React.memo(StatusDropdown);
