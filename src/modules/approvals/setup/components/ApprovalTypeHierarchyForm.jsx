import React from "react";
import FormButton from "@components/form/FormButton.jsx";
import {useApprovalTypeHierarchyForm} from "@modules/approvals/setup/hooks/useApprovalTypeHierarchyForm.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions, formatOptionsWithConcatenation} from "@helpers/formatters.js";
import {useWatch} from "react-hook-form";

const ApprovalTypeHierarchyForm = ({ editMode = false, hierarchyId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
        formData
    } = useApprovalTypeHierarchyForm(editMode, hierarchyId);

    const company = useWatch({ control, name: "company" });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid place-items-center">
                <div className="w-full max-w-4xl">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Approval Hierarchy</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <FormAsyncSelect
                                        name="approval_type"
                                        control={control}
                                        errors={errors}
                                        placeholder="Approval Type"
                                        apiUrl="/select/approvals/types"
                                        queryKeyBase="approval_types"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptionsWithConcatenation(formData, 'approval_type_option', 'id', ['label', 'code'])}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="company"
                                        control={control}
                                        errors={errors}
                                        placeholder="Company"
                                        apiUrl="/select/companies/"
                                        queryKeyBase="companies"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(formData, 'company_option')}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="department"
                                        control={control}
                                        errors={errors}
                                        placeholder="Department"
                                        apiUrl={`/select/departments/${company ? `?company_id=${company}` : ''}`}
                                        queryKeyBase={`departments${company ? `${company}` : ''}`}
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(formData, 'department_option')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t sm:flex justify-end">
                            <FormButton isLoading={isSubmitting}/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ApprovalTypeHierarchyForm;
