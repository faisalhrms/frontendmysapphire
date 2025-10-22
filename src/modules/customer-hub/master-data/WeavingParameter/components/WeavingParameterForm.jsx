import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { HardDrive, PlusCircle } from "lucide-react";
import {
    useWeavingParameterForm
} from "@modules/customer-hub/master-data/WeavingParameter/hooks/useWeavingParameterForm.js";
import {
    loomTypeOptions, machineTypeOptions,
    processTypeOptions, weaveOptions
} from "@modules/customer-hub/master-data/WeavingParameter/services/weavingSpecOptions.js";

const WeavingParameterForm = ({ editMode = false, paramId = null }) => {
  const { control, errors, handleSubmit, onSubmit, isSubmitting } = useWeavingParameterForm(editMode, paramId)

  return (
    <>
      <IconPageHeader
        heading={editMode ? "Edit Weaving Parameter" : "Add Weaving Parameter"}
        description={editMode ? "Edit existing parameter" : "Create a new parameter"}
        icon={editMode ? HardDrive : PlusCircle}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-6 col-span-12">
                    <FormInput name="weft_method" control={control} errors={errors} placeholder="Weft Insertion Method" is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="process_type" control={control} errors={errors} placeholder="Fabric Type" options={processTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="loom_type" control={control} errors={errors} placeholder="Loom Type" options={loomTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="machine_type" control={control} errors={errors} placeholder="Airjet/Sulzer" options={machineTypeOptions} is_required />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormSelect name="weave" control={control} errors={errors} placeholder="Weave" options={weaveOptions} is_required />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number" name="wider_loom_speed" control={control} errors={errors} placeholder="Wider Loom Speed" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number" name="wider_efficiency" control={control} errors={errors} placeholder="Wider Efficiency" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number"  name="wider_reject_percent" control={control} errors={errors} placeholder="Wider Reject %" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number" name="narrow_loom_speed" control={control} errors={errors} placeholder="Narrow Loom Speed" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number" name="narrow_efficiency" control={control} errors={errors} placeholder="Narrow Efficiency" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number"  name="narrow_reject_percent" control={control} errors={errors} placeholder="Narrow Reject %" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number" name="recovery" control={control} errors={errors} placeholder="Recovery" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number"  name="dyeing_cost_percent" control={control} errors={errors} placeholder="Dyeing Cost %" />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput type="number"  name="packing_cost_per_yard" control={control} errors={errors} placeholder="Packing Cost / Yard" />
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
  )
}

export default WeavingParameterForm
