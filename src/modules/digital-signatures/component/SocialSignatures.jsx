import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import TemplateSignature from "./TemplateSignature";

const SignatureForm = ({ handleSubmitData, isEditMode = false,tempStep, editData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      facebook: editData.facebook || "",
      instagram: editData.instagram || "",
      linkedin: editData.linkedin || "",
      twitter: editData.twitter || "",
      tiktok: editData.tiktok || "",
    },
  });

  const [previewData, setPreviewData] = useState({});

  useEffect(() => {
    const payload = {
      companyName: editData?.company?.name || "",
      employee_code: editData?.employee_code || "",
      name: editData?.name || "",
      designation: editData?.designation || "",
      department: editData?.department || "",
      website: editData?.website || "",
      phone: editData?.phone || "",
      mobile: editData?.mobile || "",
      email: editData?.email || "",
      address: editData?.address || "",
      facebook: editData.facebook || "",
      instagram: editData.instagram || "",
      linkedin: editData.linkedin || "",
      twitter: editData.twitter || "",
      tiktok: editData.tiktok || "",
    };
    setPreviewData(payload);
  }, [editData]);

  useEffect(() => {
    const subscription = watch((formData) => {
      setPreviewData(formData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (formData) => {
    handleSubmitData(formData, 2);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4">
        <div className="  xxl:col-span-5 col-span-12 sm:col-span-5">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Social Media</div>
            </div>
            <div className="box-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="facebook"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="instagram"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Instagram Username"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="linkedin"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="LinkedIn Profile"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="twitter"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Twitter Handle"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="tiktok"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="TikTok  Username"
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

        <div className=" xxl:col-span-7 col-span-12 sm:col-span-7      ">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Preview</div>
            </div>

            <div className="border border-dashed border-gray-300 rounded-md p-4 bg-white">

                <div>
                  <strong>Template:</strong>
                </div>

              {Object.keys(previewData).map(
                (key) =>
                  previewData[key] && (
                    <div key={key}>
                      <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                      {previewData[key]}
                    </div>
                  )
              )}
              {
                <TemplateSignature
                  title={false}
                  editData={editData}
                  previewData={previewData}
                  tempStep={tempStep}
                />
              }
            </div>
            {/* <div className="mt-4 flex justify-end gap-4 mb-4 mr-4">
              <button
                className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
                onClick={handleClear}
              >
                Clear
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureForm;
