import React, {useMemo} from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import {useForm} from "react-hook-form";
import api from "@config/axiosConfig.js";

const EmailComposeModal = ({isOpen, onClose, serviceRequest}) => {
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm();

    const preselectedToEmails = useMemo(() => {
        return serviceRequest?.reporter_email
            ? [{value: serviceRequest.reporter_email, label: serviceRequest.reporter_email}]
            : [];
    }, [serviceRequest]);

    const preselectedCcEmails = useMemo(() => {
        return [];
    }, []);

const handleSave = async (data) => {
    const toEmails = data.to_email || [];
    const ccEmails = data.cc_email || [];

    const payload = {
        service_request_id: serviceRequest.id,
        message: data.message,
        to_email: toEmails,
        cc_email: ccEmails,
        send_email: true,
    };

    try {
        await api.post(`/sr-task/${serviceRequest.id}/send-email/`, payload);
        console.log("Email sent successfully");
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
            <div
                className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out relative flex min-h-[calc(100%-3.5rem)] items-center justify-center max-w-2xl mx-auto my-auto">
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
                                    isMulti={true}
                                    name="to_email"
                                    control={control}
                                    errors={errors}
                                    placeholder="To"
                                    apiUrl="/select/users-email"
                                    queryKeyBase="users-email"
                                    allowSaveNewOption={false}
                                    preselectedOptions={preselectedToEmails}
                                />
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <FormAsyncSelect
                                    label="CC"
                                    isMulti={true}
                                    name="cc_email"
                                    control={control}
                                    errors={errors}
                                    placeholder="CC"
                                    apiUrl="/select/users-email"
                                    queryKeyBase="users-email"
                                    allowSaveNewOption={false}
                                    preselectedOptions={preselectedCcEmails}
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
                            <FormButton isLoading={isSubmitting} text="Send"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default EmailComposeModal;
