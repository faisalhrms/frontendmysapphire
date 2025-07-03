import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@components/form/FormInput.jsx';
import FormTextarea from '@components/form/FormTextarea.jsx';
import FormButton from '@components/form/FormButton.jsx';
import complaintSchema from "@modules/CustomerAssist/schema/complaintSchema.js";
import { useOnlineComplaintForm } from "@modules/CustomerAssist/hooks/complaintHook.js";
import GalleryUpload from "@components/GalleryUpload.jsx";

const ComplainOnlineForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            caseEmail: '',
            subject: '',
            description: '',
        },
    });

    const { handleComplaintSubmit } = useOnlineComplaintForm();

    return (
        <div className="max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(handleComplaintSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                    <div className='col-span-12'>
                        <FormInput
                            name="caseEmail"
                            control={control}
                            errors={errors}
                            placeholder="Enter customer email"
                            labelText="Customer Email"
                            separateLabel={true}
                            className="w-full"
                        />
                    </div>
                    <div className='col-span-12'>
                        <FormInput
                            name="phone"
                            control={control}
                            errors={errors}
                            placeholder="Enter customer phone"
                            labelText="Customer Phone"
                            separateLabel={true}
                            className="w-full"
                        />
                    </div>
                    <div className='col-span-12'>
                        <FormInput
                            name="subject"
                            control={control}
                            errors={errors}
                            placeholder="Enter subject"
                            labelText="Subject"
                            separateLabel={true}
                            is_required={true}
                            className="w-full"
                        />
                    </div>
                    <div className='col-span-12'>
                        <FormInput
                            name="orderNo"
                            control={control}
                            errors={errors}
                            placeholder="Enter Order No"
                            labelText="Order No"
                            separateLabel={true}
                            is_required={true}
                            className="w-full"
                        />
                    </div>
                    <div className='col-span-12'>
                        <FormTextarea
                            name="description"
                            control={control}
                            errors={errors}
                            placeholder="Enter description"
                            labelText="Description"
                            rows={4}
                            className="w-full"
                        />
                    </div>
                    <div className='col-span-12'>
                        <GalleryUpload
                            inputName="attachment_ids"
                            placeholder="Attachments"
                            control={control}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <FormButton
                        isLoading={isSubmitting}
                        text="Submit"
                    />
                </div>
            </form>
        </div>
    );
};

export default ComplainOnlineForm;