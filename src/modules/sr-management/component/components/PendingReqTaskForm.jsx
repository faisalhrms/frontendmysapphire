import { useParams } from "react-router-dom";
import { usePendingReqTaskForm, useServiceRequest } from "@modules/sr-management/Hooks/PendingServiceReqHook.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import pendingReqTaskSchema from "@modules/sr-management/schema/PendingReqCreateSchema.js";
import { format } from "date-fns";
import FormButton from "@components/form/FormButton.jsx";
import PendingReqTaskCard from "@modules/sr-management/component/components/PendingReqTaskCard.jsx";

const PendingReqTaskForm = ({ pendingReqData, currentReqId }) => {
  console.log(
    `Pending Req Data: department_id=${pendingReqData.department_id}, sub_department_id=${pendingReqData.sub_department_id}, sr_type_id=${pendingReqData.sr_type_id}, attachments=${pendingReqData.attachment_ids}`
  );

  // Destructure serviceData for easier access
  const createdAtDate = pendingReqData?.created_at
    ? format(new Date(pendingReqData.created_at), "yyyy-MM-dd")
    : "";
  console.log(`This is subdepartment ${pendingReqData.sub_department_id}`);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(pendingReqTaskSchema()),
    defaultValues: {
      ...pendingReqData,
      location_id: pendingReqData.location_id,
      department_id: pendingReqData.department_id,
      sub_department_id: pendingReqData.sub_department_id,
      sr_type_id: pendingReqData.sr_type_id,
      started_at: createdAtDate,
      ended_at: "",
      user_ids: (pendingReqData.users || []).map((user) => user.id) || [],
      attachment_ids: pendingReqData.attachment_ids || [],
      description: pendingReqData.description || "",
    },
  });

  const { handleTaskSubmit } = usePendingReqTaskForm(pendingReqData);

  console.log("Pending Request Data:", pendingReqData);

  // Only render form once pendingReqData is loaded
  if (!pendingReqData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleTaskSubmit)}>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9">
          <div className="box">
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-6 col-span-12">
                  <FormInput
                    name="request_title"
                    control={control}
                    errors={errors}
                    placeholder="Request Title"
                    readOnly
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <FormAsyncSelect
                    label="Requester Location"
                    name="location_id"
                    control={control}
                    errors={errors}
                    placeholder="Requester Location"
                    apiUrl="/select/locations"
                    queryKeyBase="locations"
                    clientSideSearch={true}
                    preselectedOptions={
                      pendingReqData.location_id
                        ? [{ value: pendingReqData.location_id, label: pendingReqData.location?.name }]
                        : []
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <FormAsyncSelect
                    label="SR Type"
                    name="sr_type_id"
                    control={control}
                    errors={errors}
                    placeholder="SR Type"
                    apiUrl="/select/sr-types"
                    queryKeyBase="sr_types"
                    clientSideSearch={true}
                    preselectedOptions={
                      pendingReqData?.sr_type
                        ? [{ value: pendingReqData.sr_type.id, label: pendingReqData.sr_type.name }]
                        : []
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <FormAsyncSelect
                    label="Members"
                    isMulti={true}
                    name="user_ids"
                    control={control}
                    errors={errors}
                    placeholder="Members"
                    apiUrl="/select/users"
                    queryKeyBase="users"
                    preselectedOptions={formatOptions(pendingReqData, "users", "id", "full_name")}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="date"
                    name="need_by_date"
                    control={control}
                    errors={errors}
                    placeholder="Need By Date"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="date"
                    name="started_at"
                    control={control}
                    errors={errors}
                    placeholder="Start Date"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="date"
                    name="ended_at"
                    control={control}
                    errors={errors}
                    placeholder="End Date"
                    min={createdAtDate}
                  />
                </div>
                <div className="col-span-12">
                  <FormRichTextarea
                    name="description"
                    control={control}
                    errors={errors}
                    placeholder="Description"
                    editorOptions={{
                      height: 300,
                      buttonList: [
                        ["bold", "italic", "underline", "strike"],
                        ["font", "fontSize", "fontColor", "hiliteColor"],
                        ["align", "list", "table"]
                      ],
                    }}
                  />
                </div>
                <div className="col-span-12">
                  <GalleryUpload
                    currentValue={pendingReqData?.attachment_ids}
                    files={pendingReqData?.attachments}
                    inputName="attachment_ids"
                    placeholder="Select Attachments"
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
              <FormButton type="submit" isLoading={isSubmitting} />
            </div>
          </div>
        </div>
        <PendingReqTaskCard pendingReqData={pendingReqData} />
      </div>
    </form>
  );
};

export default PendingReqTaskForm;
