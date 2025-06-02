import React, {useMemo} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FormSelect from "@components/form/FormSelect.jsx";

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
                                {
                                    activeTab === 'landing_page_performance' ?
                                        <div className="flex-1">
                                            <FormSelect
                                                name="top"
                                                control={control}
                                                errors={errors}
                                                options={[
                                                    {value: 5, label: "Top 5"},
                                                    {value: 10, label: "Top 10"},
                                                    {value: 20, label: "Top 20"},
                                                    {value: 30, label: "Top 30"},
                                                    {value: 40, label: "Top 40"},
                                                    {value: 50, label: "Top 50"},
                                                    {value: 70, label: "Top 70"},
                                                    {value: 100, label: "Top 100"},
                                                    {value: 150, label: "Top 150"},
                                                    {value: 200, label: "Top 200"},
                                                    {value: 250, label: "Top 250"},
                                                    {value: 300, label: "Top 300"},
                                                    {value: 400, label: "Top 400"},
                                                    {value: 500, label: "Top 500"},
                                                ]}
                                                label={false}
                                            />
                                        </div>
                                        :
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

                                }
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
