import React, { useMemo, useEffect, useState } from "react";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";

const EmailComposeModal = ({ isOpen, onClose, serviceRequest, user }) => {
    const [includePreviousThread, setIncludePreviousThread] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            to_email: [],
            cc_email: [],
            message: "",
        },
    });

    const preselectedToEmails = useMemo(() => {
        // Combine serviceRequest.to_email with serviceRequest.to_emails and remove duplicates
        const emails = [...new Set([...(serviceRequest?.to_email || []), ...(serviceRequest?.to_emails || [])])];
        return emails.map((email) => ({
            label: email,
            value: email,
        }));
    }, [serviceRequest?.to_email, serviceRequest?.to_emails]);

    const preselectedCcEmails = useMemo(() => {
        const reporterEmail = user?.email;
        const ccEmails = serviceRequest?.cc_email || [];
        const allCcEmails = [...new Set(reporterEmail ? [reporterEmail, ...ccEmails] : ccEmails)];

        return allCcEmails.map((email) => ({
            label: email,
            value: email,
        }));
    }, [serviceRequest?.cc_email, user?.email]);

    useEffect(() => {
        if (isOpen) {
            reset({
                to_email: preselectedToEmails,
                cc_email: preselectedCcEmails,
                message: "",
            });
            setIncludePreviousThread(false);
        }
    }, [isOpen, reset, preselectedToEmails, preselectedCcEmails]);

    const handleSave = async (data) => {
        const toEmails = data.to_email.map((item) => item.value || item);
        const ccEmails = data.cc_email.map((item) => item.value || item);

        const payload = {
            service_request_id: serviceRequest.id,
            message: data.message,
            to_email: toEmails,
            cc_email: ccEmails,
            send_email: true,
            previous_thread: includePreviousThread,
        };

        try {
            await api.post(`/sr-task/${serviceRequest.id}/send-email/`, payload);
            reset({
                to_email: preselectedToEmails,
                cc_email: preselectedCcEmails,
                message: "",
            });
            setIncludePreviousThread(false);
            onClose();
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    return (
        <div
            id="email-compose"
            className={`hs-overlay fixed inset-0 z-50 bg-black/40 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
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
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="ti-modal-body px-4 py-3 space-y-4">
                            <SRAsyncSelect
                                key={`to-email-${isOpen}`}
                                label="To"
                                isMulti
                                name="to_email"
                                control={control}
                                errors={errors}
                                placeholder="To"
                                apiUrl="/select/users/email"
                                queryKeyBase="users-email"
                                preselectedOptions={preselectedToEmails}
                                allowSaveNewOption
                            />
                            <SRAsyncSelect
                                key={`cc-email-${isOpen}`}
                                label="CC"
                                isMulti
                                name="cc_email"
                                control={control}
                                errors={errors}
                                placeholder="CC"
                                apiUrl="/select/users/email"
                                queryKeyBase="cc-email"
                                preselectedOptions={preselectedCcEmails}
                                allowSaveNewOption
                            />
                            <div className="col-span-12">
                                <FormRichTextarea
                                    name="message"
                                    control={control}
                                    errors={errors}
                                    placeholder="Write your email message here"
                                    editorOptions={{
                                        height: 150,
                                        buttonList: [
                                            ["bold", "italic", "underline", "strike"],
                                        ],
                                    }}
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="previous-thread"
                                    checked={includePreviousThread}
                                    onChange={(e) => setIncludePreviousThread(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="previous-thread" className="text-sm">
                                    Include Previous Thread
                                </label>
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
