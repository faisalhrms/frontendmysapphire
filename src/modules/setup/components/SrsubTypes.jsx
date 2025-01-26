import { useForm, Controller } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import api from "@config/axiosConfig.js";
import FormButton from "@components/form/FormButton.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

const SrsubTypesForm = ({ handleSubmitData, saveData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: saveData?.name || "",
            short_name: saveData?.short_name || "",
            department: saveData?.sr_type_joins?.[0]?.department?.id || null,
            sub_department: saveData?.sr_type_joins?.[0]?.sub_department?.id || null,
            company_id: saveData?.sr_type_joins?.[0]?.department?.company_id || null,
        },
    });

    const onSubmit = (formData) => {
        console.log("Form Data Submitted:", formData);
        handleSubmitData(formData, 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
                {/* Company */}
                <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="company_id"
                        label="Company"
                        control={control}
                        errors={errors}
                        placeholder="Select a Company"
                        apiUrl="/select/companies"
                        queryKeyBase="companies"
                        debounceDelay={300}
                        onSelectChange={(selected) => {
                            setValue("company_id", selected || null);
                            setValue("department", null); // Reset department
                            setValue("sub_department", null); // Reset sub-department
                        }}
                    />
                </div>

                {/* Department */}
                <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="department"
                        label="Department"
                        control={control}
                        errors={errors}
                        placeholder="Select a Department"
                        apiUrl={`/select/departments?company_id=${watch("company_id") || ""}`}
                        queryKeyBase="departments"
                        debounceDelay={300}
                        onSelectChange={(selected) => {
                            setValue("department", selected || null);
                            setValue("sub_department", null); // Reset sub-department
                        }}
                    />
                </div>

                {/* Sub-Department */}
                <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="sub_department"
                        label="Sub-Department"
                        control={control}
                        errors={errors}
                        placeholder="Select a Sub-Department"
                        apiUrl={`/select/sub-departments?department_id=${watch("department") || ""}`}
                        queryKeyBase="subDepartments"
                        debounceDelay={300}
                        onSelectChange={(selected) => setValue("sub_department", selected || null)}
                    />
                </div>

                {/* Submit Button */}
                <div className="col-span-12 flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit" />
                </div>
            </div>
        </form>
    );
};

export default SrsubTypesForm;
