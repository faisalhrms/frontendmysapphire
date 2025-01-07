import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import equipmentSchema from "@modules/inventory/schemas/equipmentSchema.js";
import { useEquipmentForm } from "@modules/inventory/hooks/inventoryHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import { formatOptions } from "@helpers/formatters.js";

import GalleryUpload from "@components/GalleryUpload.jsx";
import {currencies} from "@modules/subscription/services/subscriptionService.js";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";

const AddEquipmentForm = ({ equipmentData, isEditMode = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      ...equipmentData,
    },
  });

  const { handleEquipmentSubmit } = useEquipmentForm(equipmentData, isEditMode);

  useEffect(() => {
    if (equipmentData) {
      Object.keys(equipmentData).forEach((key) => {
        setValue(key, equipmentData[key]);
      });
    }
  }, [equipmentData, setValue]);

  return (
    <>
      <PageHeader
        currentpage="Add New Equipment"
        activepage="Inventory"
        mainpage="Add"
      />

      <form onSubmit={handleSubmit(handleEquipmentSubmit)}>
        <div className="grid grid-cols-12 gap-x-6 md:flex">
          <div className="xxl:col-span-9 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title"> Equipment Info</div>
              </div>
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="Site_id"
                        control={control}
                        errors={errors}
                        placeholder="Site"
                        apiUrl="/select/equipment-sites/"
                        queryKeyBase="locations"
                        clientSideSearch={true}
                        preselectedOptions={formatOptions(
                            equipmentData,
                            "location"
                        )}
                        saveOptionEndpoint="/select/equipment-sites/"
                        allowSaveNewOption={true}
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="department_id"
                        control={control}
                        errors={errors}
                        placeholder="Department"
                        apiUrl="/select/departments"
                        queryKeyBase="departments"
                        clientSideSearch={true}
                        preselectedOptions={formatOptions(
                            equipmentData,
                            "department"
                        )}
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="location_id"
                        control={control}
                        errors={errors}
                        placeholder="Physical Location"
                        apiUrl="/select/equipment-locations/"
                        queryKeyBase="locations"
                        clientSideSearch={true}

                        preselectedOptions={formatOptions(
                            equipmentData,
                            "location"
                        )}
                        saveOptionEndpoint="/select/equipment-locations/"
                        allowSaveNewOption={true}
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        type="code"
                        name="code"
                        control={control}
                        errors={errors}
                        placeholder="Code"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormAsyncSelect
                        name="type_id"
                        control={control}
                        errors={errors}
                        placeholder="Type"
                        apiUrl="/select/equipment-types/"
                        queryKeyBase="types"
                        clientSideSearch={true}

                        preselectedOptions={formatOptions(equipmentData, "type")}
                        saveOptionEndpoint="/select/equipment-types/"
                        allowSaveNewOption={true}
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        name="asset_code"
                        control={control}
                        errors={errors}
                        placeholder="Asset Code"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        name="serial_no"
                        control={control}
                        errors={errors}
                        placeholder="Serial No"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        type="number"
                        name="part_no"
                        control={control}
                        errors={errors}
                        placeholder="Part No"
                        min="0"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormSelect
                        name="status_id"
                        control={control}
                        errors={errors}
                        placeholder="Status"
                        options={equipmentStatuses}
                        label="Status"
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <FormAsyncSelect
                        name="custodian_id"
                        control={control}
                        errors={errors}
                        placeholder="Custodian"
                        apiUrl="/select/users"
                        queryKeyBase="users"
                        clientSideSearch={true}
                        preselectedOptions={formatOptions(
                            equipmentData,
                            "users",
                            "id",
                            "full_name"
                        )}
                    />
                  </div>

                  <div className="xl:col-span-6 col-span-12">
                    <FormAsyncSelect
                        name="custodian_id"
                        control={control}
                        errors={errors}
                        placeholder="Previous Custodian"
                        apiUrl="/select/users"
                        queryKeyBase="users"
                        clientSideSearch={true}
                        preselectedOptions={formatOptions(
                            equipmentData,
                            "users",
                            "id",
                            "full_name"
                        )}
                    />
                  </div>


                  <div className="xl:col-span-6 col-span-12">
                    <FormTextarea
                        name="description"
                        control={control}
                        errors={errors}
                        placeholder="Description"
                        rows={5}
                    />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormTextarea
                        name="specs"
                        control={control}
                        errors={errors}
                        placeholder="Specification"
                        rows={5}
                    />
                  </div>
                  <div className="col-span-12">
                    <GalleryUpload
                        currentValue={equipmentData?.attachment_ids}
                        files={equipmentData?.attachments}
                        inputName="attachment_ids"
                        placeholder="Select Attachments"
                        control={control}
                        errors={errors}
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                <FormButton isLoading={isSubmitting}/>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-3  col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title"> Purchase Date</div>
              </div>
              <div className="box-body">
                <FormInput
                    type="date"
                    name="purchased_at"
                    control={control}
                    errors={errors}
                    label={false}
                  placeholder="Purchase Date"
                />
              </div>
            </div>
            <div className="box">
              <div className="box-header">
                <div className="box-title"> HandOver Date</div>
              </div>
              <div className="box-body">
                <FormInput
                  type="date"
                  name="handed_at"
                  label={false}
                  control={control}
                  errors={errors}
                  placeholder="Handover Date"
                />
              </div>
            </div>
            <div className="box">
              <div className="box-header">
                <div className="box-title"> Maturity Date</div>
              </div>
              <div className="box-body">
                <FormInput
                  type="date"
                  name="matured_at"
                  label={false}
                  control={control}
                  errors={errors}
                  placeholder="Maturity Date"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEquipmentForm;
