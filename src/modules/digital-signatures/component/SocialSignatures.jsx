import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";

const SignatureForm = ({ handleSubmitData, isEditMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const [previewData, setPreviewData] = useState({});
  const data = {};

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData) => {
    handleSubmitData(formData, 2);
  };

  const facebook = watch("facebook");
  const instagram = watch("instagram");
  const linkedIn = watch("linkedin");
  const twitter = watch("twitter");
  const tiktok = watch("tiktok");

  useEffect(() => {
    setPreviewData({
      facebook,
      instagram,
      linkedIn,
      twitter,
      tiktok,
    });
  }, [facebook, instagram, linkedIn, twitter, tiktok]);

  return (
    <>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9">
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
                      placeholder="User name"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="linkedin"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="LinkedIn profile"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="twitter"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Twitter handle"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="tiktok"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="TikTok username"
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

        <div className="xxl:col-span-3">
          <div className="box">
            <div className="box-header">
              <div className="box-title"> Preview</div>
            </div>
           
            <div className="box-body border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="mb-4 text-gray-700 font-semibold">Preview</div>
              <div className="border border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-white">
               
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md ti-btn-primary-full  focus:outline-none"
                  onClick={() => console.log("Save Signature")}
                >
                  Save Signature
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md ti-btn-primary-full  focus:outline-none"
                  onClick={() => console.log("Clear")}
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
