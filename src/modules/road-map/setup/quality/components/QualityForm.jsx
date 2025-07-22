import React from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { businessUnit } from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";
import { useQuality } from "@modules/road-map/setup/quality/hooks/useQuality.js";
import {formatOptions} from "@helpers/formatters.js";

const QualityForm = () => {
  const { id } = useLocation().state || {};
  const {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
    quality,
    attachment,
    fileInputRef,
    handleFileChange,
    handleRemoveAttachment
  } = useQuality(id);

  return (
    <div>
      <PageHeader
        currentpage={id ? "Edit Quality" : "Add Quality"}
        activepage="Quality"
        mainpage={id ? "Edit Quality" : "Add Quality"}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="md:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">
                  {id ? "Edit Quality" : "Add Quality"}
                </div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <FormSelect
                      name="business_unit"
                      control={control}
                      errors={errors}
                      placeholder="Select Business Unit"
                      options={businessUnit}
                      label="Select Business Unit"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="code"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Quality Code"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                      label="Certificate Labels"
                      isMulti
                      name="label_certificates"
                      control={control}
                      errors={errors}
                      placeholder="Select Labels"
                      apiUrl="/select/roadmap/certificate-labels/"
                      queryKeyBase="certificate_labels"
                      preselectedOptions={formatOptions(quality, "label_certificates", "id", "name")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Attachment</div>
              </div>
              <div className="box-body p-4 rounded-md">
                {attachment && (
                  <div className="flex items-center justify-between bg-gray-100 rounded-md mb-3">
                    <span className="flex-grow py-1 px-2">
                      {attachment.file_name}
                    </span>
                    <div className="flex items-center">
                      <i
                        className="ri-eye-fill text-success mr-2 cursor-pointer"
                        onClick={() => window.open(attachment.url, "_blank")}
                      />
                      <i
                        className="ri-delete-bin-5-fill text-danger cursor-pointer"
                        onClick={handleRemoveAttachment}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <label className="block text-xs">
                    <span className="mt-2 mb-2 font-semibold">Choose TDS PDF</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="block w-full border border-gray-200 rounded-sm text-xs file:py-2 file:px-4 file:rounded-s-sm file:border-0 file:font-semibold file:bg-primary file:text-white hover:file:bg-primary"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
          <FormButton isLoading={isSubmitting} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default QualityForm;
