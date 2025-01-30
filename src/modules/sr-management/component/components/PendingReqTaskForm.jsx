import React, {useEffect} from "react";
import {useForm, useWatch} from "react-hook-form";
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
import {useSelector} from "react-redux";
import FormSelect from "@components/form/FormSelect.jsx";
import {priorities} from "@modules/sr-management/services/Pending.js";

const PendingReqTaskForm = ({pendingReqData}) => {
    const {user} = useSelector((state) => state.auth);
    const createdAtDate = pendingReqData?.created_at
        ? format(new Date(pendingReqData.created_at), "yyyy-MM-dd")
        : "";
    const endedAtDate = pendingReqData?.need_by_date
        ? format(new Date(pendingReqData.created_at), "yyyy-MM-dd")
        : "";
    const {control, setValue, handleSubmit, formState: {errors, isSubmitting}} = useForm({
        resolver: zodResolver(pendingReqTaskSchema()),
        defaultValues: {
            ...pendingReqData,
            location_id: pendingReqData?.location?.id,
            sr_type: pendingReqData?.sr_type?.id,
            team_group_id: pendingReqData?.team_group?.id,
            started_at: createdAtDate,
            ended_at: endedAtDate,
            user_ids: (pendingReqData.users || []).map((user) => user.id),
            description: pendingReqData.description || "",
            priority: pendingReqData.priority || "low",
            sla_hours: pendingReqData.sla_hours || "",

        },
    });
    const selectedPriority = useWatch({control, name: "priority"});

    useEffect(() => {
        if (selectedPriority) {
            const priority = priorities.find((p) => p.value === selectedPriority);
            if (priority) {
                setValue("sla_hours", priority.sla_hours);
            }
        }
    }, [selectedPriority, setValue]);


    const {handleTaskSubmit} = usePendingReqTaskForm(pendingReqData);

    const handleSaveDraft = async (data) => {
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
                    handleSaveDraft(data);
                },
                (validationErrors) => {
                    console.error("Validation Errors:", validationErrors);
                }
            )}
        >
            <div className="grid grid-cols-12 gap-x-4">
                <div className="md:col-span-9 sm:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-8 col-span-12">
                                    <FormInput
                                        name="request_title"
                                        control={control}
                                        errors={errors}
                                        placeholder="Request Title"
                                        readOnly
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="Requester Location"
                                        name="location_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Requester Location"
                                        apiUrl="/select/locations"
                                        queryKeyBase="locations"
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
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="SR Type"
                                        name="sr_type"
                                        control={control}
                                        errors={errors}
                                        placeholder="SR Type"
                                        apiUrl={`/select/sr-types?sub_department_id=${pendingReqData.sub_department.id}`}
                                        queryKeyBase="sr_types"
                                        preselectedOptions={
                                            pendingReqData?.sr_type
                                                ? [{
                                                    value: pendingReqData.sr_type.id,
                                                    label: pendingReqData.sr_type.name
                                                }]
                                                : []
                                        }
                                        onChange={(selected) => {
                                            setValue("sr_type", selected?.value || null);
                                        }}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="priority"
                                        control={control}
                                        errors={errors}
                                        options={priorities}
                                        placeholder="Priority"
                                    />
                                </div>
                                <div className={`xl:col-span-4 col-span-12`}>
                                    <FormInput
                                        type="number"
                                        name="sla_hours"
                                        control={control}
                                        errors={errors}
                                        placeholder="SLA Hours"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="Members"
                                        isMulti
                                        name="user_ids"
                                        control={control}
                                        errors={errors}
                                        placeholder="Members"
                                        apiUrl={`/select/users?sub_department_id=${pendingReqData.sub_department.id}`}
                                        queryKeyBase="users"
                                        preselectedOptions={formatOptions(pendingReqData, "users", "id", "full_name")}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        label="Team Group"
                                        name="team_group_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Team Group"
                                        apiUrl={`/select/teams/groups/?sub_department_id=${pendingReqData.sub_department.id}`}
                                        queryKeyBase="team_groups"
                                        preselectedOptions={formatOptions(pendingReqData, "team_groups", "id", "name")}
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
                                            height: 280,
                                            buttonList: [
                                                ["bold", "italic", "underline", "strike"],
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
