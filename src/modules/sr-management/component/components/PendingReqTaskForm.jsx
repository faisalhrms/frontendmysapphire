import React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";
import {formatOptions} from "@helpers/formatters.js";
import {usePendingReqTaskForm} from "@modules/sr-management/Hooks/PendingServiceReqHook.js";
import PendingReqTaskCard from "@modules/sr-management/component/components/PendingReqTaskCard.jsx";
import pendingReqTaskSchema from "@modules/sr-management/schema/PendingReqCreateSchema.js";

const PendingReqTaskForm = ({pendingReqData}) => {
    const createdAtDate = pendingReqData?.created_at
        ? format(new Date(pendingReqData.created_at), "yyyy-MM-dd")
        : "";
    const endedAtDate = pendingReqData?.need_by_date
        ? format(new Date(pendingReqData.created_at), "yyyy-MM-dd")
        : "";
    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(pendingReqTaskSchema()),
        defaultValues: {
            ...pendingReqData,
            location_id: pendingReqData?.location?.id,
            sr_type: pendingReqData?.sr_type?.id || null,
            started_at: createdAtDate,
            ended_at: endedAtDate,
            user_ids: (pendingReqData.users || []).map((user) => user.id),
            description: pendingReqData.description || "",
        },
    });

    const {handleTaskSubmit} = usePendingReqTaskForm(pendingReqData);

    const handleSaveDraft = async (data) => {
        console.log("Form data before submission:", data);
        try {
            await handleTaskSubmit(data);
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(
                (data) => {
                    console.log("Form Submitted Data:", data);
                    handleSaveDraft(data);
                },
                (validationErrors) => {
                    console.error("Validation Errors:", validationErrors);
                }
            )}
        >
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
                                        clientSideSearch
                                        preselectedOptions={
                                            pendingReqData?.location
                                                ? [{
                                                    value: pendingReqData.location.id,
                                                    label: pendingReqData.location?.name
                                                }]
                                                : []
                                        }
                                        onChange={(selected) => {
                                            setValue("location_id", selected?.value || null); // Set location_id value
                                        }}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        label="SR Type"
                                        name="sr_type"
                                        control={control}
                                        errors={errors}
                                        placeholder="SR Type"
                                        apiUrl="/select/sr-types"
                                        queryKeyBase="sr_types"
                                        clientSideSearch
                                        preselectedOptions={
                                            pendingReqData?.sr_type
                                                ? [{
                                                    value: pendingReqData.sr_type.id,
                                                    label: pendingReqData.sr_type.name
                                                }]
                                                : []
                                        }
                                        onChange={(selected) => {
                                            setValue("sr_type", selected?.value || null); // Use setValue here
                                        }}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        label="Members"
                                        isMulti
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
                                                ["align", "list", "table"],
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                            <FormButton
                                text="Save"
                                onClick={() => handleSubmit(handleSaveDraft)()}
                                isLoading={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
                <PendingReqTaskCard pendingReqData={pendingReqData}/>
            </div>
        </form>
    );
};

export default PendingReqTaskForm;
