import React, {useMemo, useCallback, useEffect, useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import {formatOptions, formatOptionsWithConcatenation} from "@helpers/formatters.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import { taskStatuses } from "@modules/project-management/services/taskService.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {priorities} from "@modules/project-management/services/projectService.js";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormToggle from "@components/form/FormToggle.jsx";

const TaskModel = ({taskData, control, errors, isSubmitting, handleSubmit, onSubmit, closeModal, projectId, startedAt, endedAt, isEditMode = false}) => {
    const [data, setData]    = useState(taskData);

    const formattedUsers = useMemo(() => formatOptionsWithConcatenation(data, "users", "id", ['full_name', 'email']), [data]);
    const formattedTags  = useMemo(() => formatOptions(data, "tags", "id", "name"), [data]);
    const formattedTeams  = useMemo(() => formatOptions(data, "teams", "id", "name"), [data]);
    const handleClose        = useCallback(() => closeModal(), [closeModal]);
    useEffect(() => {
        setData(taskData);
    }, [taskData]);

    return (
        <>
            <div
                id="taskModal"
                data-hs-overlay-keyboard="false"
                className="hs-overlay ti-modal hidden [--overlay-backdrop:static] backdrop-blur-[0.08rem] parent-modal"
            >
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                    <div className="max-h-full overflow-hidden ti-modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="ti-modal-header">
                                <h6 className="modal-title" id="staticBackdropLabel">
                                    {isEditMode ? `Update ${data?.task_no}` : "Create Task"}
                                </h6>
                                <button type="button" className="hs-dropdown-toggle ti-modal-close-btn" onClick={handleClose}>
                                    <span className="sr-only">Close</span>
                                    <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="ti-modal-body overflow-y-auto max-h-[calc(100vh-200px)]">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="col-span-12">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-12">
                                                <FormInput
                                                    name="name"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Task Name"
                                                />
                                            </div>
                                            <div className="col-span-12">
                                                <FormAsyncSelect
                                                    isMulti={true}
                                                    name="team_ids"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Teams"
                                                    apiUrl="/select/pms/teams/"
                                                    queryKeyBase="pms_teams"
                                                    preselectedOptions={formattedTeams}
                                                    saveOptionEndpoint="/select/pms/team/"
                                                    allowSaveNewOption={true}
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <FormInput
                                                    type="datetime-local"
                                                    name="started_at"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Start Date"
                                                    min={startedAt}
                                                    max={endedAt}
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <FormInput
                                                    type="datetime-local"
                                                    name="ended_at"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="End Date"
                                                    min={startedAt}
                                                    max={endedAt}
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <FormSelect
                                                    name="status"
                                                    control={control}
                                                    errors={errors}
                                                    options={taskStatuses}
                                                    placeholder="Status"
                                                />
                                                {data?.status === 'rejected' && (
                                                    <div className=" mt-1 text-red">Current Status is Rejected
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-6">
                                                <FormSelect
                                                    name="priority"
                                                    control={control}
                                                    errors={errors}
                                                    options={priorities}
                                                    placeholder="Priority"
                                                />
                                            </div>
                                            <div className="col-span-6">
                                                <FormAsyncSelect
                                                    isMulti={true}
                                                    clientSideSearch={true}
                                                    name="user_ids"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Assigned To"
                                                    apiUrl={`/select/project/${projectId}/users/`}
                                                    queryKeyBase="project_users"
                                                    preselectedOptions={formattedUsers}
                                                />
                                            </div>
                                            <div className="col-span-6">

                                                <FormAsyncSelect
                                                    isMulti={true}
                                                    name="tag_ids"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Tags"
                                                    apiUrl="/select/tags/"
                                                    queryKeyBase="tags"
                                                    preselectedOptions={formattedTags}
                                                    saveOptionEndpoint="/select/tag/"
                                                    allowSaveNewOption={true}
                                                />
                                            </div>
                                            <div className="col-span-12">
                                                <FormToggle
                                                    label={true}
                                                    placeholder='Requires Approval'
                                                    toggleClasses=''
                                                    name="requires_approval"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </div>
                                            <div className="col-span-12">
                                                <FormTextarea
                                                    name="description"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Description"
                                                    rows={5}
                                                />
                                            </div>
                                            <div className="col-span-12">
                                                <GalleryUpload
                                                    haveOldValue={false}
                                                    currentValue={data?.attachment_ids}
                                                    files={data?.attachments}
                                                    inputName="attachment_ids"
                                                    placeholder="Select Attachments"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskModel;
