import React, {useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { useFieldDefinition } from "@modules/beirholm-bi/hooks/FieldDefinition.js";
import { formatOptions } from "@helpers/formatters.js";

const FieldDefinitionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {};
    const { handleSubmit, control, errors, isSubmitting, onSubmit, fieldDefinition } = useFieldDefinition(id);
    const headerData = fieldDefinition || {};


    const submitHandler = async (data) => {
        await onSubmit();
        navigate(BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.path);
    };
    return (
        <div>
            <PageHeader
                currentpage="Add Field Definitions"
                activepage="Field Definitions"
                mainpage="Add Field Definitions"
            />
            <div className="xl:col-span-9 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">
                            {id && id !== ":id" ? "Edit Field Definitions" : "Add Field Definitions"}
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
                                        preselectedOptions={formatOptions(headerData, 'header')}
                                        saveOptionEndpoint="/select/beirholm/excel/header/"
                                        allowSaveNewOption={true}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="correct_value"
                                        type="text"
                                        control={control}
                                        errors={errors}
                                        placeholder="Sanitized Value"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                                <FormButton isLoading={isSubmitting} type="submit" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDefinitionForm;
