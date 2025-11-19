import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import { useCustomerItemForm } from "@modules/customer-hub/master-data/customer-item-data/hooks/useCustomerItemForm.js";

const Section = ({ title, children }) => (
  <div className="rounded-lg border border-defaultborder/60 bg-white dark:bg-bodybg p-5">
    <div className="text-[0.9rem] font-semibold text-defaulttextcolor mb-4">{title}</div>
    <div className="grid grid-cols-12 gap-4">{children}</div>
  </div>
);

const CustomerItemForm = () => {
  const { id, handleSubmit, control, errors, isSubmitting, onSubmit } = useCustomerItemForm();

  return (
    <div>
      <PageHeader currentpage={id ? "Edit Customer Item" : "Add Customer Item"} activepage="Customer Items" mainpage={id ? "Edit Customer Item" : "Add Customer Item"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="box overflow-hidden">
              <div className="box-header">
                <div className="box-title">{id ? "Edit Customer Item" : "Add Customer Item"}</div>
              </div>
              <div className="box-body space-y-6">
                <Section title="Identity">
                  <div className="xl:col-span-3 col-span-12"><FormInput name="customer_name" control={control} errors={errors} placeholder="Customer Name" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput type="date" name="item_code_creation_date" control={control} errors={errors} placeholder="Item Code Creation Date" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="processed_item_code" control={control} errors={errors} placeholder="Processed Item Code" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_item_code" control={control} errors={errors} placeholder="Greige Item Code" /></div>
                </Section>

                <Section title="Greige Basics">
                  <div className="xl:col-span-3 col-span-12"><FormInput name="quality_code" control={control} errors={errors} placeholder="Quality Code" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_design" control={control} errors={errors} placeholder="Greige Design" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_design_code" control={control} errors={errors} placeholder="Greige Design Code" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_color" control={control} errors={errors} placeholder="Greige Color" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_color_code" control={control} errors={errors} placeholder="Greige Color Code" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="greige_width" control={control} errors={errors} placeholder="Greige Width" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="selvedge" control={control} errors={errors} placeholder="Selvedge" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="weave" control={control} errors={errors} placeholder="Weave" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="stripe_size" control={control} errors={errors} placeholder="Stripe Size" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="fab_construction" control={control} errors={errors} placeholder="Fab Construction" /></div>
                </Section>

                <Section title="Construction & Counts">
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" name="warp_count" control={control} errors={errors} placeholder="Warp Count" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput  name="warp_count_raw" control={control} errors={errors} placeholder="Warp Count Raw" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" name="weft_count" control={control} errors={errors} placeholder="Weft Count" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput  name="weft_count_raw" control={control} errors={errors} placeholder="Weft Count Raw" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" name="ends" control={control} errors={errors} placeholder="Ends" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" name="picks" control={control} errors={errors} placeholder="Picks" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="yarn_dyed_or_greige" control={control} errors={errors} placeholder="Yarn Dyed / Greige" /></div>
                </Section>

                <Section title="Yarn Details">
                  <div className="xl:col-span-3 col-span-12"><FormInput name="warp_yarn_grade" control={control} errors={errors} placeholder="Warp Yarn Grade" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="warp_spin_method" control={control} errors={errors} placeholder="Warp Spin Method" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="warp_blend" control={control} errors={errors} placeholder="Warp Blend" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="weft_yarn_grade" control={control} errors={errors} placeholder="Weft Yarn Grade" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="weft_spin_method" control={control} errors={errors} placeholder="Weft Spin Method" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="weft_blend" control={control} errors={errors} placeholder="Weft Blend" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="weft_insertion_method" control={control} errors={errors} placeholder="Weft Insertion Method" /></div>
                </Section>

                <Section title="Finished">
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" step="any" name="finished_width_inches" control={control} errors={errors} placeholder="Finished Width (Inches)" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput type="number" step="any" name="finished_width_cm" control={control} errors={errors} placeholder="Finished Width (Cm)" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="finished_design_description" control={control} errors={errors} placeholder="Finished Design Description" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="finished_design_code" control={control} errors={errors} placeholder="Finished Design Code" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="finished_color_description" control={control} errors={errors} placeholder="Finished Color Description" /></div>
                  <div className="xl:col-span-3 col-span-12"><FormInput name="finished_color_code" control={control} errors={errors} placeholder="Finished Color Code" /></div>
                </Section>

                <Section title="Process">
                  <div className="xl:col-span-6 col-span-12"><FormInput name="process_route" control={control} errors={errors} placeholder="Process Route" /></div>
                  <div className="xl:col-span-6 col-span-12"><FormInput name="process_code" control={control} errors={errors} placeholder="Process Code" /></div>
                </Section>
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerItemForm;
