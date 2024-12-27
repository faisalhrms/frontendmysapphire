

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
                      placeholder="Enter a Facebook URL"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="instagram"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Enter an Instagram username"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="linkedin"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Enter a LinkedIn profile"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="twitter"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Enter a Twitter handle"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="tiktok"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Enter a TikTok username"
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

        {/* Preview Section */}
        <div className="xxl:col-span-3">
          <div className="box">
            <div className="box-header">
              <div className="box-title"> Preview</div>
            </div>
            <div className="box-body">
              <FormInput
                type="text"
                name="Preview"
                control={control}
                errors={errors}
                label={false}
                placeholder="Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureForm;
