import React, {useCallback} from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";


const DataSanitizeFilter = ({ control, errors, clearFilter }) => {
    return (
        <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <FormInput
                                    type="month"
                                    name="from_month"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                />
                            </div>
                              <div className="flex items-center gap-4 flex-1">
                                <FormInput
                                    type="month"
                                    name="to_month"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                />
                            </div>
                            <FilterButton />
                            <FilterClearButton onClick={clearFilter} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(DataSanitizeFilter)