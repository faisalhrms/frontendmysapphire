import React, {useEffect, useState} from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import serviceRequestSchema from "@modules/employee-self-services/schemas/service-request/ServiceRequestSchema.js";
import {useServiceRequestForm} from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import FormInput from "@components/form/FormInput.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import ServiceRequestCard from "@modules/employee-self-services/service-request/components/ServiceRequestCard.jsx";
import {useSelector} from "react-redux";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";

const ServiceRequestForm = ({
                                serviceData,
                                isSaveMode = false,
                                isChild = false,
                                serviceRequestId,
                            }) => {
    const user = useSelector((state) => state.auth.user);

    const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(
        serviceData?.is_submitted || false
    );
    const [subDepartmentOptions, setSubDepartmentOptions] = useState([]);
    const [showOnBehalfOfField, setShowOnBehalfOfField] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Loading state for "Save" button
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false); // Loading state for "Submit" button

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(serviceRequestSchema()),
        defaultValues: {
            company_id: user.employee.company.id || 1,
            sr_number: serviceData?.sr_number || "",
            on_behalf_of: serviceData?.on_behalf_of || false,
            on_behalf_employee: serviceData?.on_behalf_employee || "",
            reporter: user?.full_name,
            reporter_email: user?.email,
            to_email: serviceData?.to_email?.map((email) =>
                email.replace(/[\n\r]+/g, "").trim()
            ) || [],
            cc_email: serviceData?.cc_email || [], // Initialize as empty array
            attachments: serviceData?.attachments?.map((file) => file.id) || [], // Initialize with existing attachment IDs
            description: serviceData?.description || "", // Initialize as empty string
            location_id: serviceData?.location.id || null,
            department_id: serviceData?.department.id || null,
            sub_department_id: serviceData?.sub_department.id || null,
            sr_type: serviceData?.sr_type.id || null,
            parent_request: serviceData?.parent_request || null,
            need_by_date: serviceData?.need_by_date || "",
        },
    });

    const selectedDepartment = watch("department_id");
    const selectedSubDepartment = watch("sub_department_id");

    const handleEmailSelect = (email) => {
        setValue("to_email", [email?.email]);
    };

    const {saveAsDraft, submitRequest} = useServiceRequestForm(
        serviceData,
        isSaveMode
    );

    useEffect(() => {
        if (serviceData) {
            Object.keys(serviceData).forEach((key) => {
                setValue(key, serviceData[key]);
            });
            setIsSavedAsDraft(serviceData?.is_submitted === false);
            setIsSubmitted(serviceData?.is_submitted || false);
        }
    }, [serviceData, setValue]);

    // Removed the second useEffect that was conflicting

    const handleSaveDraft = async (data) => {
        setIsSaving(true);
        try {
            const payload = {
                ...data,
                attachments: data.attachments.filter((file) =>
                    typeof file === "object" ? file.file_content : true
                ),
                is_submitted: false,
                parent_request: serviceRequestId || null,
            };
            await saveAsDraft(payload);
            console.log("Draft saved successfully.");
            setIsSavedAsDraft(true);
        } catch (error) {
            console.error("Error saving draft:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const onError = (errors) => {
        console.error("Form validation errors:", errors);
    };

    const handleSubmitRequest = async (data) => {
        setIsSubmittingRequest(true);
        try {
            const payload = {
                ...data,
                attachments: data.attachments.filter((file) =>
                    typeof file === "object" ? file.file_content : true
                ),
                is_submitted: true,
                parent_request: serviceRequestId || null,
            };
            if (isSaveMode && serviceData?.id) {
                await submitRequest(serviceData.id, payload);
            } else {
                await submitRequest(null, payload);
            }
            setIsSavedAsDraft(false);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting request:", error);
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-12 gap-x-6 ">
                <div className="xxl:col-span-9">
                    <div className="box">
                        <div className="box-body overflow-hidden">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="Location"
                                        name="location_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Location"
                                        apiUrl="/select/locations"
                                        queryKeyBase="locations"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(serviceData, "location")}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="Department"
                                        name="department_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Department"
                                        apiUrl="/select/departments"
                                        queryKeyBase="departments"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            serviceData,
                                            "department"
                                        )}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <SRAsyncSelect
                                        label="Sub Department"
                                        name="sub_department_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Sub Department"
                                        apiUrl={`/select/sub-departments?department_id=${selectedDepartment}`}
                                        queryKeyBase={`subdepartments-${selectedDepartment}`}
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            serviceData,
                                            "sub_department"
                                        )}
                                        isDisabled={!selectedDepartment}
                                        onOptionSelect={handleEmailSelect}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="SR Type"
                                        name="sr_type"
                                        control={control}
                                        errors={errors}
                                        placeholder="SR Type"
                                        apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`}
                                        queryKeyBase={`srtype-${selectedSubDepartment}`}
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(serviceData, "sr_type")}
                                        isDisabled={!selectedSubDepartment}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="need_by_date"
                                        control={control}
                                        errors={errors}
                                        placeholder="Needed Date"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="on_behalf_of"
                                            onChange={(e) => {
                                                const isChecked = e.target.checked; // Boolean value
                                                setShowOnBehalfOfField(isChecked);
                                                setValue("on_behalf_of", isChecked); // Pass boolean directly
                                                setValue("on_behalf_employee", isChecked ? "" : null); // Reset if unchecked
                                            }}
                                            checked={watch("on_behalf_of") || false} // Reflect current form state
                                        />
                                        <span className="ml-2">On Behalf Of</span>
                                    </label>
                                </div>

                                {showOnBehalfOfField && (
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormAsyncSelect
                                            label="On Behalf Of Employee"
                                            name="on_behalf_employee"
                                            control={control}
                                            errors={errors}
                                            placeholder="On Behalf Of Employee"
                                            apiUrl="/select/users/email/"
                                            queryKeyBase="employees"
                                            clientSideSearch={true}
                                            preselectedOptions={formatOptions(serviceData, "on_behalf_employee")}
                                        />
                                    </div>
                                )}


                                <div className="xl:col-span-12 col-span-12">
                                    <FormInput
                                        name="request_title"
                                        control={control}
                                        errors={errors}
                                        placeholder="Request Title"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormRichTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        editorOptions={{
                                            height: 150,
                                            buttonList: [
                                                ["bold", "italic", "underline", "strike"],
                                                ["font", "fontSize", "fontColor", "hiliteColor"],
                                                ["align", "list", "table"],
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                            {!isSubmitted && (
                                <>
                                    <FormButton
                                        text="Save"
                                        type="button"
                                        isLoading={isSaving}
                                        onClick={handleSubmit(handleSaveDraft, onError)}
                                    />
                                    <FormButton
                                        text="Submit"
                                        type="button"
                                        isLoading={isSubmittingRequest}
                                        onClick={handleSubmit(handleSubmitRequest, onError)}
                                    />
                                </>
                            )}
                        </div>

                    </div>
                </div>
                <ServiceRequestCard
                    currentUser={user}
                    serviceData={serviceData}
                    control={control}
                    setValue={setValue}
                    errors={errors}
                />
            </div>
        </form>
    );

};

export default ServiceRequestForm;
