import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {BEIRHOLM_BI_ROUTES} from "@modules/beirholm-bi/routes.js";
import {usePatternForm} from "@modules/beirholm-bi/hooks/CorrectionPatterns.js";

const CorrectionPatternsForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = location.state || {};
    const {
        handleSubmit,
        control,
        errors,
        isSubmitting,
        onSubmit,
        append,
        remove,
        initialData,
        watch,
    } = usePatternForm(id);

    const submitHandler = async () => {
        await onSubmit();
        navigate(BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.path);
    };

    const preselectedHeader = initialData?.header
        ? [{value: initialData.header.id, label: initialData.header.name}]
        : [];

    const preselectedDataCategory = initialData?.data_category
        ? [{value: initialData.data_category.id, label: initialData.data_category.name}]
        : [];

    return (
        <div>
            <PageHeader
                currentpage={id ? "Edit Data Correction Patterns" : "Add Data Correction Patterns"}
                activepage="Data Correction Patterns"
                mainpage="Data Correction Patterns"
            />
            <div className="grid grid-cols-12 gap-4">
                {/* Left Side: Main Fields */}
                <div className="xl:col-span-8 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                {id ? "Edit Data Correction Patterns" : "Add Data Correction Patterns"}
                            </div>
                        </div>
                        <div className="box-body">
                            <form onSubmit={handleSubmit(submitHandler)}>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            label={true}
                                            name="data_category"
                                            control={control}
                                            errors={errors}
                                            placeholder="Select Data Category"
                                            apiUrl="/select/data/categories/"
                                            queryKeyBase="data_category"
                                            preselectedOptions={preselectedDataCategory}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            label={true}
                                            name="header"
                                            control={control}
                                            errors={errors}
                                            placeholder="Header Name"
                                            apiUrl="/select/beirholm/excel/headers/"
                                            queryKeyBase="header"
                                            preselectedOptions={preselectedHeader}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-6 mt-4">
                                        <FormInput
                                            name="pattern"
                                            control={control}
                                            errors={errors}
                                            placeholder="Enter pattern"
                                        />
                                        <small className="text-gray-500">
                                            Define your <strong>pattern</strong> using the following rules:
                                            <br/>
                                            • Use <code>N</code> to represent a digit. Use multiple N's for fixed digit
                                            counts (e.g. <code>NNN</code> = 3 digits).
                                            <br/>
                                            • Use <code>L</code> to represent a letter. (e.g. <code>LL</code> = 2
                                            letters).
                                            <br/>
                                            • Use <code>X</code> or any symbol as a separator
                                            (e.g. <code>NNNXNN</code> means 3 digits, then 'X', then 2 digits).
                                            <br/>
                                            • Pattern must match **exactly** in the description to be valid.
                                        </small>
                                    </div>


                                    <div className="xl:col-span-6 col-span-6 mt-4">
                                        <FormInput
                                            name="correct_pattern"
                                            control={control}
                                            errors={errors}
                                            placeholder="Correct Pattern"
                                        />
                                        <small className="text-gray-500">
                                            Define the <strong>correct pattern</strong> format that will be applied to
                                            extracted data:
                                            <br/>
                                            • Use the same structure of <code>N</code> and separators (e.g. <code>NNN /
                                            NN</code>).
                                        </small>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-dashed flex justify-end mt-4">
                                    <FormButton isLoading={isSubmitting} type="submit"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Right Side: Child Patterns */}
                <div className="xl:col-span-4 col-span-12">
                    <div className="box">
                        <div className="box-header flex items-center justify-between">
                            <div className="box-title">Child Patterns</div>
                            <button
                                type="button"
                                onClick={() => append({pattern: ""})}
                                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                            >
                                <i className="ri-add-line font-semibold align-middle"></i> Add
                            </button>
                        </div>
                        <div className="box-body">
                            {watch("child_patterns").map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="flex items-center space-x-2 p-2 mb-2 bg-gray-50 rounded-md border"
                                >
                                    <FormInput
                                        name={`child_patterns.${index}.pattern`}
                                        control={control}
                                        errors={errors}
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="ti-btn ti-btn-danger ti-btn-sm flex items-center"
                                    >
                                        <i className="ti ti-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorrectionPatternsForm;
