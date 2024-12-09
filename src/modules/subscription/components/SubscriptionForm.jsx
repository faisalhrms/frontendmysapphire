import React, {useEffect} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import subscriptionSchema from "@modules/subscription/schemas/subscriptionSchema.js";
import { useSubscriptionForm } from "@modules/subscription/hooks/subscriptionHooks.js";
import { useEditSubscription } from "@modules/subscription/hooks/editsubscriptionHook.js";
import {
  currencies,
  paymentCycle,
  paymentStatus,
  reminderDays,
  subscriptionTypes,
  subscriptionStatuses, paymentMethod,
} from "@modules/subscription/services/subscriptionService.js";
import { formatOptions } from "@helpers/formatters.js";

const SubscriptionForm = ({ subscriptionData = {}, isEditMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },setValue
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      reminder_days: "30",
      type: "free",
      payment_cycle: "yearly",
      currency: "PKR",
      status: "active", // Ensure this matches the schema key
      ...subscriptionData,
    },
  });

  const subscriptionType = useWatch({ control, name: "type" });


  const { handleSubscriptionSubmit } = useSubscriptionForm(subscriptionData, isEditMode);
  useEffect(() => {
    if (subscriptionData) {
      Object.keys(subscriptionData).forEach(key => {
        setValue(key, subscriptionData[key]);
      });
    }
  }, [subscriptionData, setValue]);

  const status = useWatch({ control, name: "status" });
  console.log("Current Status Value:", status);


  return (
    <form onSubmit={handleSubmit(handleSubscriptionSubmit)}>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="md:col-span-9 sm:col-span-12 col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="box-title"> Subscription Info</div>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="name"
                      control={control}
                      errors={errors}
                      placeholder="System/Platform Name"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormSelect
                      name="type"
                      control={control}
                      errors={errors}
                      options={subscriptionTypes}
                      placeholder=" Subscription Type"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">

                  <FormSelect
                      name="status" // Matches the schema key
                      control={control}
                      errors={errors}
                      options={subscriptionStatuses} // Ensure this is passed
                      placeholder="Subscription Status"
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <FormInput
                      type="date"
                      name="started_at"
                      control={control}
                      errors={errors}
                      placeholder="Start Date"
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <FormInput
                      type="date"
                      name="ended_at"
                      control={control}
                      errors={errors}
                      placeholder="End Date"
                  />
                </div>

                {subscriptionType === "paid" && (
                    <>

                      <div className="xl:col-span-6 col-span-12">
                        <FormSelect
                            name="payment_cycle"
                            control={control}
                            label="Payment Cycle"
                            errors={errors}
                            options={paymentCycle}
                            placeholder="Select Payment Cycle"
                            clientSideSearch={false}
                        />
                      </div>
                      <div className="xl:col-span-6 col-span-12">
                        <FormSelect
                            name="currency"
                            control={control}
                            errors={errors}
                            options={currencies}
                            placeholder="Currency"
                        />
                      </div>
                      <div className="xl:col-span-6 col-span-12">
                        <FormInput
                            type="number"
                            name="amount"
                            control={control}
                            errors={errors}
                            placeholder="Amount"
                        />
                      </div>
                      {/*<div className="xl:col-span-6 col-span-12">*/}
                      {/*  <FormSelect*/}
                      {/*      name="payment_method"*/}
                      {/*      control={control}*/}
                      {/*      errors={errors}*/}
                      {/*      options={paymentMethod}*/}
                      {/*      placeholder="Payment Method"*/}
                      {/*  />*/}
                      {/*</div>*/}
                      {/*<div className="xl:col-span-4 col-span-12">*/}
                      {/*  <FormInput*/}
                      {/*      type="date"*/}
                      {/*      name="due_date"*/}
                      {/*      control={control}*/}
                      {/*      errors={errors}*/}
                      {/*      placeholder="Next Due Date"*/}
                      {/*  />*/}
                      {/*</div>*/}
                      <div className="xl:col-span-6 col-span-12">
                        <FormSelect
                            name="payment_status"
                            control={control}
                            errors={errors}
                            options={paymentStatus}
                            placeholder=" Payment Status"
                        />
                      </div>
                      {/*<div className="xl:col-span-4 col-span-12">*/}
                      {/*  <FormInput*/}
                      {/*      type="number"*/}
                      {/*      name="due_amount"*/}
                      {/*      control={control}*/}
                      {/*      errors={errors}*/}
                      {/*      placeholder="Next Due Amount"*/}
                      {/*  />*/}
                      {/*</div>*/}
                    </>
                )}


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
                      label={false}
                      inputName="attachment_ids"
                      placeholder="Select Attachments"
                      control={control}
                      errors={errors}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
              <FormButton isLoading={isSubmitting}/>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          {subscriptionType === "paid" && (<div className="box">
            <div className="box-header">
              <div className="box-title"> Vendor</div>
            </div>
            <div className="box-body">
              <FormAsyncSelect
                  isMulti={false}
                  name="vendor_id"
                  control={control}
                  errors={errors}
                  placeholder="Vendor"
                  apiUrl="/select/subscription/vendors"
                  queryKeyBase="subscriptionVendors"
                  preselectedOptions={formatOptions(subscriptionData, "vendor")}
                  saveOptionEndpoint="/select/subscription/vendor"
                  allowSaveNewOption={true}
              />
            </div>
          </div>)}


          <div className="box">
            <div className="box-header">
              <div className="box-title">Departments</div>
            </div>
            <div className="box-body">
              <FormAsyncSelect
                  name="department_ids"
                  control={control}
                  errors={errors}
                  label={false}
                  placeholder="Department"
                  apiUrl="/select/departments"
                  queryKeyBase="departments"
                  clientSideSearch={true}
                  isMulti={true}
                  preselectedOptions={formatOptions(subscriptionData, "departments")}
              />
            </div>
          </div>

          <div className="box">
            <div className="box-header">
              <div className="box-title"> Reminder</div>
            </div>
            <div className="box-body">
              <FormSelect
                name="reminder_days"
                label={false}
                control={control}
                errors={errors}
                options={reminderDays}
                placeholder="Set Reminder"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SubscriptionForm;
