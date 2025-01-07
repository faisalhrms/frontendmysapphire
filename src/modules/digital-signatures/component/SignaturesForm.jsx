import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";

import TemplateSignature from "./TemplateSignature";

const SignatureForm = ({
  handleSubmitData,
  isEditMode = false,
  editData,
  hide,
  handleHide,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: editData
      ? {
          companyName: editData.company?.name || "",
          employee_code: editData.employee_code || "",
          name: editData.name || null,
          designation: editData.designation || "",
          department: editData.department || null,
          website: editData.website || "",
          phone: editData.phone || "",
          mobile: editData.mobile || "",
          email: editData.email || "",
          address: editData.address || "",
          attachment_ids: editData.attachment_ids || [],
        }
      : {},
  });

  const [previewData, setPreviewData] = useState({});

  useEffect(() => {
    const subscription = watch((formData) => {
      setPreviewData(formData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (formData) => {
    handleSubmitData(formData, 1);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4">
        <div className="xxl:col-span-8 col-span-12 sm:col-span-8">
          <div className="box">
            <div className="box-header">
              <div className="box-title">SignatureForm</div>
            </div>
            <div className="box-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="companyName"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="employee_code"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Employee Code"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="name"
                      control={control}
                      errors={errors}
                      placeholder="Employee Name"
                      apiUrl="/select/employees/"
                      queryKeyBase="employees Name"
                      isMulti={false}
                      preselectedOptions={[]}
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="designation"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Designation"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="department"
                      control={control}
                      errors={errors}
                      placeholder="Department"
                      apiUrl="/select/departments"
                      queryKeyBase="departments"
                      clientSideSearch={true}
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="website"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Website"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="phone"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="mobile"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Mobile"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="email"
                      name="email"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Email"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="address"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                  <FormButton isLoading={isSubmitting} type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-4 col-span-12 sm:col-span-4">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Preview</div>
            </div>

            <div className="border border-dashed border-gray-300 rounded-md p-4 bg-white">
              {previewData.companyName && (
                <div>
                  <strong>Company Name:</strong> {previewData.companyName}
                </div>
              )}
              {previewData.employee_code && (
                <div>
                  <strong>Employee Code:</strong> {previewData.employee_code}
                </div>
              )}
              {previewData.designation && (
                <div>
                  <strong>Designation:</strong> {previewData.designation}
                </div>
              )}
              {previewData.department && (
                <div>
                  <strong>Department:</strong> {previewData.department}
                </div>
              )}
              {previewData.website && (
                <div>
                  <strong>Website:</strong> {previewData.website}
                </div>
              )}
              {previewData.phone && (
                <div>
                  <strong>Phone:</strong> {previewData.phone}
                </div>
              )}
              {previewData.mobile && (
                <div>
                  <strong>Mobile:</strong> {previewData.mobile}
                </div>
              )}
              {previewData.email && (
                <div>
                  <strong>Email:</strong> {previewData.email}
                </div>
              )}
              {previewData.address && (
                <div>
                  <strong>Address:</strong> {previewData.address}
                </div>
              )}
              {hide && <TemplateSignature title={false} />}
            </div>
            <div className="mt-4 flex justify-end gap-4 mb-4 mr-4">
              <button
                className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
                onClick={() => {
                  setPreviewData({});
                  handleHide();
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureForm;
