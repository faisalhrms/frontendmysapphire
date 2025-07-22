import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { Controller, useFieldArray } from "react-hook-form";
import { useUnit } from "@modules/road-map/setup/unit/hooks/useUnit.js";
import { businessUnit } from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";
import { formatOptions } from "@helpers/formatters.js";
import CertificateRow from "@modules/road-map/setup/unit/components/CertificateRow.jsx";

const UnitForm = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
    watch,
    unit,
    setValue
  } = useUnit(id);
  const selectedBU = watch("business_unit");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates"
  });

  useEffect(() => {
    if (!fields.length) {
      append({
        certificateType: null,
        certificateType_label: "",
        certificateList: null,
        certificateList_label: "",
        optionType: "",
        expiryDate: "",
        attachment: null
      });
    }
  }, [append, fields.length]);

  return (
    <div>
      <PageHeader
        currentpage={id ? "Edit Unit" : "Add Unit"}
        activepage="Unit"
        mainpage={id ? "Edit Unit" : "Add Unit"}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">{id ? "Edit Unit" : "Add Unit"}</div>
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
                    <FormAsyncSelect
                      label="Unit Category"
                      name="unit_category"
                      control={control}
                      errors={errors}
                      clientSideSearch
                      placeholder="Select Unit Category"
                      apiUrl={`/select/roadmap/unit-categories?business_unit=${selectedBU}`}
                      queryKeyBase={`unit-categories-${selectedBU}`}
                      preselectedOptions={formatOptions(
                        unit,
                        "unit_category",
                        "id",
                        "name"
                      )}
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="name"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Unit Name"
                    />
                  </div>
                  <div className="xl:col-span-12 col-span-12 flex items-center space-x-2">
                    <Controller
                      name="is_in_house"
                      control={control}
                      render={({ field }) => (
                        <div className="custom-toggle-switch flex items-center">
                          <input
                            id="toggleswitch_is_in_house"
                            type="checkbox"
                            checked={field.value}
                            onChange={e => field.onChange(e.target.checked)}
                            className="hidden"
                          />
                          <label
                            htmlFor="toggleswitch_is_in_house"
                            className="label-info"
                          />
                          <span className="ml-2">Is in house?</span>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="box-header flex justify-between items-center">
                <div className="box-title">Certificates</div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      certificateType: null,
                      certificateType_label: "",
                      certificateList: null,
                      certificateList_label: "",
                      optionType: "",
                      expiryDate: "",
                      attachment: null
                    })
                  }
                  className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                >
                  <i className="ri-add-line" /> Add certificate
                </button>
              </div>
              <div className="box-body space-y-2">
                {fields.map((row, i) => (
                  <CertificateRow
                    key={row.id}
                    row={row}
                    index={i}
                    control={control}
                    errors={errors}
                    selectedBU={selectedBU}
                    remove={remove}
                    watch={watch}
                    setValue={setValue}
                  />
                ))}
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

export default UnitForm;
