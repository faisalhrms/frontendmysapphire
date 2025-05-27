import React, {useMemo, useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

const DigitalDate = ({ control, errors, clearFilter, filters }) => {
  const yesterday = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split("T")[0]
  }, [])
    const [isDownloading, setIsDownloading] = useState(false);
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <FormInput
                                    type="date"
                                    placeholder="Till Date"
                                    name="till_date"
                                    control={control}
                                    errors={errors}
                                    defaultValue={filters?.till_date || yesterday()}
                                    label={true}
                                />
                            </div>
                            <div className="flex items-center gap-4 mt-6 flex-2">
                                <FilterButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DigitalDate);
