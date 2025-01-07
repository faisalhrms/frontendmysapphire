import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";

const SignatureForm = ({ handleSubmitData, isEditMode = false, editData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: editData
      ? {
          facebook: editData.facebook || "",
          instagram: editData.instagram || "",
          linkedin: editData.linkedin || "",
          twitter: editData.twitter || "",
          tiktok: editData.tiktok || "",
             }
      : {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: "",
          tiktok: "",
          companyName: "",
         
        },
  });

  const [previewData, setPreviewData] = useState({});

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
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9 col-span-12 sm:col-span-9">
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
                      placeholder="TikTok Username"
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

        <div className="xxl:col-span-3 col-span-12 sm:col-span-3">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Preview</div>
            </div>
            <div className="box-body border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="mb-4 text-gray-700 font-semibold">Preview</div>
              <div className="space-y-2 border border-dashed border-gray-300 rounded-md p-4 bg-white">
                {previewData.facebook && (
                  <div>
                    <strong>Facebook:</strong> {previewData.facebook}
                  </div>
                )}
                {previewData.instagram && (
                  <div>
                    <strong>Instagram:</strong> {previewData.instagram}
                  </div>
                )}
                {previewData.linkedin && (
                  <div>
                    <strong>LinkedIn:</strong> {previewData.linkedin}
                  </div>
                )}
                {previewData.twitter && (
                  <div>
                    <strong>Twitter:</strong> {previewData.twitter}
                  </div>
                )}
                {previewData.tiktok && (
                  <div>
                    <strong>TikTok:</strong> {previewData.tiktok}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md"
                  onClick={() => setPreviewData({})}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureForm;
