import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {BEIRHOLM_BI_ROUTES} from "@modules/beirholm-bi/routes.js";
import {useErrorCorrectionForm} from "@modules/beirholm-bi/hooks/CorrectionRules.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";

const CorrectionRulesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = location.state || {};
    const {
        handleSubmit,
        control,
        errors,
        isSubmitting,
        onSubmit,
        fields,
        append,
        remove,
        initialData,
        watch
    } = useErrorCorrectionForm(id);

    const selectedHeader = watch("header")?.value || watch("header");

    const submitHandler = async () => {
        await onSubmit();
        navigate(BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.path);
    };
console.log(initialData)
    return (
        <div>
            <PageHeader
                currentpage={id ? "Edit Data Correction Rules" : "Add Data Correction Rules"}
                activepage="Data Correction Rules"
                mainpage="Data Correction Rules"
            />
            <div className="xl:col-span-9 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">
                            {id ? "Edit Data Correction Rule" : "Add Data Correction Rule"}
                        </div>
                    </div>
                    <div className="box-body">
                        <form onSubmit={handleSubmit(submitHandler)}>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label={true}
                                        name="header"
                                        control={control}
                                        errors={errors}
                                        placeholder="Header Name"
                                        apiUrl="/select/beirholm/excel/headers/"
                                        queryKeyBase="header"
                                        preselectedOptions={formatOptions(initialData?.field_definition, "header")}
                                    />
                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormAsyncSelect
                                        label={true}
                                        name="correct_value"
                                        control={control}
                                        errors={errors}
                                        placeholder="Correct Values"
                                        apiUrl={`/select/sanitized/data${selectedHeader ? `?selected_header_id=${selectedHeader}` : ""}`}
                                        queryKeyBase={["correct_value", selectedHeader]}
                                        preselectedOptions={formatOptions(initialData, "sanitized_data")}
                                    />

                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormInput
                                        name="error_value"
                                        control={control}
                                        errors={errors}
                                        placeholder="Error Value"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="box-title">Child Errors</div>
                                    <button
                                        type="button"
                                        onClick={() => append({error_value: ""})}
                                        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                    >
                                        <i className="ri-add-line font-semibold align-middle"></i> Add
                                    </button>
                                </div>
                                {fields.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-2 p-2 mb-2 bg-gray-50 rounded-md border"
                                    >
                                        <FormInput
                                            name={`child_errors.${index}.error_value`}
                                            control={control}
                                            errors={errors}
                                            placeholder="Error value"
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
                            <div className="px-6 py-4 border-t border-dashed flex justify-end">
                                <FormButton isLoading={isSubmitting} type="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorrectionRulesForm;
