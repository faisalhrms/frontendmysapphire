import React, {useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FormSelect from "@components/form/FormSelect.jsx";

const OrderExceptionFilter = ({ control, errors }) => {
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <FormSelect
                                    name="country"
                                    control={control}
                                    errors={errors}
                                    placeholder=""
                                    options={[
                                        { value: 'PK', label: 'PK' },
                                        { value: 'UK', label: 'UK' },
                                        { value: 'UAE', label: 'UAE' },
                                    ]}
                                    label="New Status"
                                />
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <FormInput
                                    type="date"
                                    name="date"
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                            <FilterButton/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(OrderExceptionFilter);
