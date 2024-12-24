import React, { useMemo, useEffect } from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";

const EmailComposeModal = ({ isOpen, onClose, serviceRequest }) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            to_email: [],
            cc_email: [],
            message: "",
        }
    });

    // Format options to match the expected format of FormAsyncSelect
    const formatEmails = (emails) =>
        Array.isArray(emails) ? emails.map((email) => ({ value: email, label: email })) : [];

    // Prepare preselected options for "To" field
    const preselectedToEmails = useMemo(() => {
        const reporterEmail = serviceRequest?.reporter_email;
        return reporterEmail ? [{ value: reporterEmail, label: reporterEmail }] : [];
    }, [serviceRequest]);

    // Prepare preselected options for "CC" field
    const preselectedCcEmails = useMemo(() => {
        return formatEmails(serviceRequest?.cc_emails || []);
    }, [serviceRequest]);

    // Reset form values when modal opens
    useEffect(() => {
        if (isOpen) {
            const defaultValues = {
                to_email: preselectedToEmails,
                cc_email: preselectedCcEmails,
                message: "",
            };
            reset(defaultValues);
        }
    }, [isOpen, reset, preselectedToEmails, preselectedCcEmails]);

    // Handle form submission
    const handleSave = async (data) => {
        const toEmails = Array.isArray(data.to_email) ? data.to_email.map((item) => item.value) : [];
        const ccEmails = Array.isArray(data.cc_email) ? data.cc_email.map((item) => item.value) : [];

        const payload = {
            service_request_id: serviceRequest.id,
            message: data.message,
            to_email: toEmails,
            cc_email: ccEmails,
            send_email: true,
        };

        try {
            await api.post(`/sr-task/${serviceRequest.id}/send-email/`, payload);
            onClose();
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    return (
        <div
            id="email-compose"
            className={`hs-overlay fixed inset-0 z-50 bg-black/40 transition-all duration-300 ${
                isOpen ? "block" : "hidden"
            }`}
            tabIndex={-1}
        >
            <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out relative flex min-h-[calc(100%-3.5rem)] items-center justify-center max-w-2xl mx-auto my-auto">
                <div className="ti-modal-content bg-white rounded-lg shadow-xl w-full">
                    <div className="ti-modal-header flex justify-between items-center p-4 border-b">
                        <h6 className="modal-title text-[1rem] font-semibold">Compose Email</h6>
                        <button
                            onClick={onClose}
                            type="button"
                            className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                        >
                            <span className="sr-only">Close</span>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="ti-modal-body px-4 py-3 space-y-4">
                            <div className="xl:col-span-12 col-span-12">
                                <FormAsyncSelect
                                    label="To"
                                    isMulti
                                    name="to_email"
                                    control={control}
                                    errors={errors}
                                    placeholder="To"
                                    apiUrl="/select/users/email"
                                    queryKeyBase="users-email"
                                    preselectedOptions={preselectedToEmails}
                                    allowSaveNewOption={false}
                                />
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <FormAsyncSelect
                                    label="CC"
                                    isMulti
                                    name="cc_email"
                                    control={control}
                                    errors={errors}
                                    placeholder="CC"
                                    apiUrl="/select/users/email"
                                    queryKeyBase="cc-email"
                                    preselectedOptions={preselectedCcEmails}
                                    allowSaveNewOption={false}
                                />
                            </div>
                            <div>
                                <FormTextarea
                                    name="message"
                                    control={control}
                                    errors={errors}
                                    placeholder="Write your email message here"
                                    rows={6}
                                />
                            </div>
                        </div>
                        <div className="ti-modal-footer flex justify-end gap-2 p-4 border-t">
                            <button
                                onClick={onClose}
                                type="button"
                                className="ti-btn ti-btn-primary-full ti-btn-loader m-2"
                            >
                                Cancel
                            </button>
                            <FormButton isLoading={isSubmitting} text="Send" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmailComposeModal;
