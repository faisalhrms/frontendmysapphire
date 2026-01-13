import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import {useCompetitorForm} from "@modules/beirholm-bi/hooks/competitorsHooks.js";
import competitorSchema from "@modules/beirholm-bi/schemas/competitorSchema.js";
import {COMPETITOR_TYPES} from "@modules/beirholm-bi/services/competitorsService.js";

const CompetitorsForm = ({ competitorData = {}, isEditMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(competitorSchema),
    defaultValues: {
      competitor_type: "",
      title: "",
      attachment_ids: [],
      ...competitorData,
    },
  });

  const { handleCompetitorSubmit } = useCompetitorForm(competitorData, isEditMode);

  useEffect(() => {
    if (!competitorData) return;
    Object.keys(competitorData).forEach((key) => {
      setValue(key, competitorData[key]);
    });
  }, [competitorData, setValue]);

  return (
    <form onSubmit={handleSubmit(handleCompetitorSubmit)}>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          <div className="box">
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormSelect
                    name="competitor_type"
                    control={control}
                    errors={errors}
                    options={COMPETITOR_TYPES}
                    placeholder="Competitor Type"
                    isClearable={false}
                  />
                </div>

                <div className="col-span-12 md:col-span-6">
                  <FormInput
                    is_required
                    name="title"
                    control={control}
                    errors={errors}
                    placeholder="Title"
                  />
                </div>

                <div className="col-span-12">
                  <GalleryUpload
                    currentValue={competitorData?.attachment_ids}
                    files={competitorData?.attachments}
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
              <FormButton isLoading={isSubmitting} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CompetitorsForm;
