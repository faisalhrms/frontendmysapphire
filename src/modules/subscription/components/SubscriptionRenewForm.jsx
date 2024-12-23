import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import subscriptionRenewSchema from "@modules/subscription/schemas/subscriptionRenewSchema.js";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import { useSubscriptionRenewForm } from "@modules/subscription/hooks/subscriptionHooks.js";
import {
    currencies,
    paymentCycle,
    paymentStatus,
    paymentMethod,
} from "@modules/subscription/services/subscriptionService.js";
import {toTitleCase} from "@helpers/formatters.js";

const SubscriptionRenewForm = ({ subscriptionData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(subscriptionRenewSchema),
        defaultValues: {
            subscription_id: subscriptionData.id,
            ...subscriptionData,
        },
    });

    const { handleSubscriptionRenewSubmit } = useSubscriptionRenewForm(subscriptionData);

    useEffect(() => {
        if (subscriptionData) {
            Object.keys(subscriptionData).forEach((key) => {
                setValue(key, subscriptionData[key]);
            });
        }
    }, [subscriptionData, setValue]);

    return (
        <form onSubmit={handleSubmit(handleSubscriptionRenewSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                {/* Left-side Form */}
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-body !p-0">
                            <div className="sm:flex items-start p-6 main-profile-cover">
                                <div className="flex-grow main-profile-info">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* System/Platform Name */}
                                        <div>
                                            <h6 className="font-semibold text-white text-[1rem]">System/Platform
                                                Name:</h6>
                                            <p className="mb-1 ml-2 text-white">{subscriptionData.name}</p>
                                        </div>

                                        {/* Subscription Type */}
                                        <div>
                                            <h6 className="font-semibold text-white text-[1rem]">Subscription Type:</h6>
                                            <p className="mb-1 ml-2 text-white">{subscriptionData.type}</p>
                                        </div>

                                        {/* Subscription Status */}
                                        <div>
                                            <h6 className="font-semibold text-white text-[1rem]">Subscription
                                                Status:</h6>
                                            <p className="mb-1 ml-2  text-white">{subscriptionData.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">Vendor:</p>
                                <p className="text-[#8c9097] ml-2 dark:text-white/50">
                                    {subscriptionData.vendor?.name}
                                </p>
                            </div>
                            <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">Departments:</p>
                                <ul className="list-group">
                                    {subscriptionData.departments?.map((dept) => (
                                        <li key={dept.id} className="badge bg-primary/10 ml-2 text-primary">
                                            {toTitleCase(dept.name)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-6">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">Reminder:</p>
                                <p className="text-[#8c9097] ml-2 dark:text-white/50">
                                    {subscriptionData.reminder_days} days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right-side Card */}

                <div className="xxl:col-span-7">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Subscription Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="started_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="Start Date"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="ended_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="End Date"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="payment_cycle"
                                        control={control}
                                        errors={errors}
                                        options={paymentCycle}
                                        placeholder="Payment Cycle"
                                    />
                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormSelect
                                        name="currency"
                                        control={control}
                                        errors={errors}
                                        options={currencies}
                                        placeholder="Currency"
                                    />
                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormInput
                                        type="number"
                                        name="amount"
                                        control={control}
                                        errors={errors}
                                        placeholder="Amount"
                                    />
                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormSelect
                                        name="payment_method"
                                        control={control}
                                        errors={errors}
                                        options={paymentMethod}
                                        placeholder="Payment Method"
                                    />
                                </div>
                                <div className="xl:col-span-3 col-span-12">
                                    <FormSelect
                                        name="payment_status"
                                        control={control}
                                        errors={errors}
                                        options={paymentStatus}
                                        placeholder="Payment Status"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        rows={5}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <GalleryUpload
                                        currentValue={subscriptionData?.attachment_ids}
                                        files={subscriptionData?.attachments}
                                        inputName="attachment_ids"
                                        control={control}
                                        errors={errors}
                                        placeholder="Select Attachments"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                            <FormButton isLoading={isSubmitting}/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SubscriptionRenewForm;
