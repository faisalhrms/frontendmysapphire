import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@components/form/FormInput.jsx';
import FormTextarea from '@components/form/FormTextarea.jsx';
import FormButton from '@components/form/FormButton.jsx';
import complaintSchema from "@modules/CustomerAssist/schema/complaintSchema.js";
import { useStoreComplaintForm } from "@modules/CustomerAssist/hooks/complaintHook.js";

const ComplainAtStoreForm = () => {
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

    const { handleComplaintSubmit } = useStoreComplaintForm();

    return (
        <div className="max-w-md mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(handleComplaintSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                    <FormInput
                        name="caseEmail"
                        control={control}
                        errors={errors}
                        placeholder="Enter Customer email"
                        labelText="Customer Email"
                        separateLabel={true}
                        is_required={true}
                        className="w-full"
                    />
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
                <div className="mt-4 flex justify-center">
                    <FormButton
                        isLoading={isSubmitting}
                        text="SUBMIT"
                        className="px-6 py-2 bg-black text-white font-bold rounded-md"
                    />
                </div>
            </form>
        </div>
    );
};

export default ComplainAtStoreForm;