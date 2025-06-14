import React, { useMemo } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FilterButton from "@components/form/FilterButton.jsx";

const WeeklyReportFilter = ({ control, errors, activeTab }) => {
    const maxDate = useMemo(() => {
        return new Date().toISOString().split("T")[0];
    }, []);

    const hourOptions = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => ({
            label: i.toString(),
            value: i.toString(),
        }));
    }, []);


    return (
        <div className="grid grid-cols-12 gap-6">
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
                                {activeTab === "landing_page_performance" && (
                                    <div className="flex-1">

                                        <FormSelect
                                            name="hour"
                                            control={control}
                                            errors={errors}
                                            placeholder="Hour"
                                            options={hourOptions}
                                            label={false}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 flex-2">
                                <FilterButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WeeklyReportFilter);