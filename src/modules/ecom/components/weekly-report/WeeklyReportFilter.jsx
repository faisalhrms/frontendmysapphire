import React, {useMemo} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";

const WeeklyReportFilter = ({control, errors, filters, activeTab}) => {

    const maxDate = useMemo(() => {
        return new Date().toISOString().split("T")[0];
    }, []);

    return (<div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1">
                                            <FormInput
                                                type="date"
                                                placeholder="From Current Period"
                                                name="date"
                                                max={maxDate}
                                                control={control}
                                                errors={errors}
                                                label={false}
                                            />
                                        </div>
                            </div>
                            <div className="flex items-center gap-4 flex-2">
                                <FilterButton/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>);
};

export default React.memo(WeeklyReportFilter);
