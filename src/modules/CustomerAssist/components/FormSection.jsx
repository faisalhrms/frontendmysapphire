// src/modules/CustomerAssist/components/FormSection.jsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { useCaseForm } from "@modules/CustomerAssist/hooks/customerAssistHook.js";

const FormSection = ({ data, isEdit = false }) => {
    // Safely get caseId if editing; data might be undefined initially
    const caseId = isEdit && data ? data.id : null;

    // Setup react-hook-form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            case_id: data?.case_id || "",
            case_number: data?.case_number || "",
            customer_name: data?.customer_name || "",
            email: data?.email || "",
            phone: data?.phone || "",
            type: data?.type || "",
            case_status: data?.case_status || data?.status || "",
            reason: data?.reason || "",
            origin: data?.origin || "",
            subject: data?.subject || "",
            priority: data?.priority || "",
            description: data?.description || "",
            // For remarks: if editing and data has remarks, show it; otherwise empty
            remarks: isEdit && data?.remarks ? data.remarks : "",
        },
    });

    // Pass caseId to hook: if null, create mode; if truthy, edit mode
    const { handleCaseSubmit } = useCaseForm(caseId);

    // When `data` changes (e.g., after fetch), reset form fields:
    useEffect(() => {
        if (data) {
            reset({
                case_id: data.case_id || "",
                case_number: data.case_number || "",
                customer_name: data.customer_name || "",
                email: data.email || "",
                phone: data.phone || "",
                type: data.type || "",
                case_status: data.case_status || data.status || "",
                reason: data.reason || "",
                origin: data.origin || "",
                subject: data.subject || "",
                priority: data.priority || "",
                description: data.description || "",
                cc_resolution:data.cc_resolution||"",
                // **Show existing remarks** in edit mode:
                remarks: isEdit && data.remarks ? data.remarks : "",
            });
        } else {
            // If creating new, clear all fields
            reset({
                case_id: "",
                case_number: "",
                customer_name: "",
                email: "",
                phone: "",
                type: "",
                case_status: "",
                reason: "",
                origin: "",
                subject: "",
                priority: "",
                description: "",
                remarks: "",
                cc_resolution:""
            });
        }
    }, [data, isEdit, reset]);

    // Optional: for debugging, guard console.log
    useEffect(() => {
        if (isEdit && data) {
            console.log("Existing remarks:", data.remarks);
        }
    }, [data, isEdit]);

    return (
        <>
            <form onSubmit={handleSubmit(handleCaseSubmit)}>
                <div className="grid grid-cols-12 pt-4 gap-6">
                    <div className="col-span-12">
                        {/* Personal & Application Info */}
                        <div className="box shadow-md rounded-lg">
                            <div className="box-header bg-gray-100 p-4 rounded-t-lg">
                                <div className="box-title text-lg font-semibold">Customer Info</div>
                            </div>
                            <div className="box-body p-6">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-4">
                                        <FormInput
                                            name="customer_name"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Customer Name"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormInput
                                            name="email"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormInput
                                            name="phone"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12  gap-6">
                    <div className="col-span-12">
                        {/* Personal & Application Info */}
                        <div className="box shadow-md rounded-lg">
                            <div className="box-header bg-gray-100 p-4 rounded-t-lg">
                                <div className="box-title text-lg font-semibold">Case Details</div>
                            </div>
                            <div className="box-body p-6">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Read-only fields */}
                                    <div className="col-span-4 hidden">
                                        <FormInput
                                            name="case_id"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Case ID"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormInput
                                            name="case_number"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Case Number"
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <FormInput
                                            name="type"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Type"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormInput
                                            name="case_status"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Case Status"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormInput
                                            name="reason"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Reason"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormInput
                                            name="origin"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Origin"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormInput
                                            name="subject"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Subject"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <FormInput
                                            name="priority"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Priority"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <FormTextarea
                                            name="description"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder="Description"
                                            rows={6}
                                        />
                                    </div>

                                    {/* Editable remarks */}


                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12  gap-6">
                    <div className="col-span-12">
                        {/* Personal & Application Info */}
                        <div className="box shadow-md rounded-lg">
                            <div className="box-header bg-gray-100 p-4 rounded-t-lg">
                                <div className="box-title text-lg font-semibold">Execution Details</div>
                            </div>
                            <div className="box-body p-6">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-6">
                                        <FormTextarea
                                            name="remarks"
                                            control={control}
                                            errors={errors}
                                            placeholder={"Remarks"}
                                            rows={4}
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <FormTextarea
                                            name="cc_resolution"
                                            control={control}
                                            errors={errors}
                                            readOnly={true}
                                            placeholder={"CC Resolution"}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end my-6">
                    <FormButton
                        isLoading={isSubmitting}
                        text={isEdit ? "Update Remarks" : "Submit Case"}
                        submitTxt={isEdit ? "Updating..." : "Submitting..."}
                        className="ti-btn ti-btn-primary ti-btn-lg"
                    />
                </div>

            </form>
        </>

    )
        ;
};

export default FormSection;
