import React, { useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import { getPastDate } from "@helpers/dateTime.js";

const OciForm = ({ control, errors, clearFilter, filters }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const defaultDate = filters?.date || getPastDate(1);

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <FormInput
                                    type="date"
                                    name="date"
                                    control={control}
                                    errors={errors}
                                    defaultValue={defaultDate}
                                    min={getPastDate(3)}
                                    max={getPastDate(1)}
                                />
                            </div>
                            <FilterButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(OciForm);
