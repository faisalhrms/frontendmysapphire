import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {useDyeingChargeForm} from "@modules/customer-hub/master-data/dyeing-charges/hooks/useDyeingChargeForm.js";

const DyeingChargeForm = () => {
  const { id, handleSubmit, control, errors, isSubmitting, onSubmit } = useDyeingChargeForm();

  return (
    <div>
      <PageHeader currentpage={id ? "Edit Dyeing Charge" : "Add Dyeing Charge"} activepage="Dyeing Charges" mainpage={id ? "Edit Dyeing Charge" : "Add Dyeing Charge"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">{id ? "Edit Dyeing Charge" : "Add Dyeing Charge"}</div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="quality_code" control={control} errors={errors} placeholder="Quality" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="design_name" control={control} errors={errors} placeholder="Design Name" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="color_name" control={control} errors={errors} placeholder="Color" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="date" name="effective_date" control={control} errors={errors} placeholder="Effective Date" />
                  </div>

                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="warp_charges" control={control} errors={errors} placeholder="Warp Charges" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="weft_charges" control={control} errors={errors} placeholder="Weft Charges" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="accumulative_charges" control={control} errors={errors} placeholder="Accumulative Charges" />
                  </div>

                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="warp_coverage" control={control} errors={errors} placeholder="Warp Coverage" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="number" name="weft_coverage" control={control} errors={errors} placeholder="Weft Coverage" />
                  </div>

                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="design_code" control={control} errors={errors} placeholder="Design Code" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name="color_code" control={control} errors={errors} placeholder="Color Code" />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormInput name="design" control={control} errors={errors} placeholder="Design (Auto Piano/7009)" />
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

export default DyeingChargeForm;
