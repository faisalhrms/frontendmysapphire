import React from "react";
import {Controller} from "react-hook-form";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import DateDropdown from "@modules/dashboards/beirholmBi/components/DateDropdown.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import {productCountry} from "@modules/beirholm-bi/services/DataSanitizeService.js";

const ExportDashboardFilter = ({control, errors}) => (
    <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
            <div className="box custom-box">
                <div className="box-body p-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Controller
                                name="date"
                                control={control}
                                defaultValue={[]}
                                render={({field}) => (
                                    <DateDropdown
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 flex-1">
                          <FormSelect
                            label={false}
                            name="product_country"
                            control={control}
                            errors={errors}
                            placeholder="Select Country"
                            options={productCountry}
                          />
                         </div>
                        <div>
                            <FormAsyncSelect
                                label={false}
                                name="header"
                                control={control}
                                errors={errors}
                                placeholder="Select header"
                                apiUrl="/select/beirholm/excel/headers/"
                                queryKeyBase="header"
                                isMulti={true}
                                allowSaveNewOption={false}
                            />
                        </div>

                        <div>
                            <FormAsyncSelect
                                label={false}
                                name="data_category"
                                control={control}
                                errors={errors}
                                placeholder="Select Data Category"
                                apiUrl="/select/data/categories/"
                                queryKeyBase="data_category"
                                preselectedOptions={[]}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default React.memo(ExportDashboardFilter);
