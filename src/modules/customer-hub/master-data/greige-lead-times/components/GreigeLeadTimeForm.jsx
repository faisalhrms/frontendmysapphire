import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {
    useGreigeLeadTimeForm
} from "@modules/customer-hub/master-data/greige-lead-times/hooks/useGreigeLeadTimeForm.js";
import {
    loomTypeOptions,
    processTypeOptions
} from "@modules/customer-hub/master-data/WeavingParameter/services/weavingSpecOptions.js";
import FormSelect from "@components/form/FormSelect.jsx";

const GreigeLeadTimeForm = () => {
  const { id, handleSubmit, control, errors, isSubmitting, onSubmit } = useGreigeLeadTimeForm();

  return (
    <div>
      <PageHeader currentpage={id ? "Edit Greige Lead Time" : "Add Greige Lead Time"} activepage="Greige Lead Times" mainpage={id ? "Edit Greige Lead Time" : "Add Greige Lead Time"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">{id ? "Edit Greige Lead Time" : "Add Greige Lead Time"}</div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="vendor_no" control={control} errors={errors} placeholder="Vendor No." is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="main_group" control={control} errors={errors} placeholder="Main Group" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="quality_code" control={control} errors={errors} placeholder="Quality" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormSelect name="loom_type" control={control} errors={errors} placeholder="Loom Type" options={loomTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                   <FormSelect name="process_type" control={control} errors={errors} placeholder="Fabric Type" options={processTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="lead_time_days" control={control} errors={errors} placeholder="Lead Time (Days)" is_required />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t sm:flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default GreigeLeadTimeForm;
