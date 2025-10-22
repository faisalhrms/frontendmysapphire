import React from "react";
import { useQualityWeavingForm } from "@modules/customer-hub/master-data/QualityWeaving/hooks/useQualityWeavingForm.js";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { HardDrive, PlusCircle } from "lucide-react";
import { loomTypeOptions, machineTypeOptions } from "@modules/customer-hub/master-data/WeavingParameter/services/weavingSpecOptions.js";

const QualityWeavingForm = ({ editMode = false, qualityId = null }) => {
  const { control, errors, handleSubmit, onSubmit, isSubmitting, resolvedEdit } = useQualityWeavingForm(editMode, qualityId);

  return (
    <>
      <IconPageHeader
        heading={resolvedEdit ? "Edit Quality Weaving" : "Add Quality Weaving"}
        description={resolvedEdit ? "Edit existing record" : "Create a new record"}
        icon={resolvedEdit ? HardDrive : PlusCircle}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-6 col-span-12">
                    <FormInput name="quality_code" control={control} errors={errors} placeholder="Quality Code" is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="machine_type" control={control} errors={errors} placeholder="Airjet/Sulzer" options={machineTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="loom_type" control={control} errors={errors} placeholder="Loom Type" options={loomTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormInput name="weft_method" control={control} errors={errors} placeholder="Weft Method" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t sm:flex justify-end">
                <FormButton isLoading={isSubmitting} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default QualityWeavingForm;
