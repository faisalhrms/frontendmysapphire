import React, {useState, useEffect} from "react";
import {useForm, useWatch} from "react-hook-form";
import Rating from "@mui/material/Rating";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import SubTaskList from "@modules/sr-management/component/components/SubTaskList.jsx";
import SRAttachment from "@modules/sr-management/component/SRAttachment.jsx";
import {updateTask, updateServiceRequest} from "@modules/sr-management/services/Pending.js";
import Notify from "@helpers/toastNotifications.js";
import {formatOptions} from "@helpers/formatters.js";
import ActivityList from "@modules/sr-management/component/ActivityList.jsx";

const ContentRight = ({projectData = {}, isEditMode = false, generatedReqData, serviceRequest}) => {
    const {control, setValue, getValues, formState: {errors}} = useForm({});
    const [updating, setUpdating] = useState(false);
    const [attachments, setAttachments] = useState(serviceRequest?.attachments || []);
    useEffect(() => {
        if (generatedReqData) {
            Object.keys(generatedReqData).forEach((key) => {
                setValue(key, generatedReqData[key]);
            });
        }
    }, [generatedReqData, setValue]);

    const userOptions = formatOptions(generatedReqData, "users", "id", "full_name");

    const handleUpdateTeam = async () => {
        setUpdating(true);
        try {
            const user_ids = getValues("user_ids").map((user) => user.value || user); // Ensure user_ids are integers
            const payload = {user_ids};

            await updateTask(generatedReqData.id, payload);
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUpdateAttachments = async (newAttachment) => {
        try {
            if (!newAttachment) {
                Notify.error("No attachment selected");
                return;
            }

            const fileContent = await fileToBase64(newAttachment.file).then((res) => res.split(",")[1]);

            const updatedPayload = [
                ...attachments.map((att) => (att.id ? att.id : {
                    file_name: att.file_name,
                    file_content: att.file_content
                })),
                {file_name: newAttachment.file.name, file_content: fileContent},
            ];

            const response = await updateServiceRequest(serviceRequest?.id, {attachments: updatedPayload});
            setAttachments(response.attachments || []);
            Notify.success("Attachment uploaded successfully");
        } catch (error) {
            console.error(error);
            Notify.error("Error uploading attachment");
        }
    };

    const handleRemoveAttachment = async (attachmentId) => {
        try {
            const filteredAttachments = attachments.filter((att) => att.id !== attachmentId);

            const payloadAttachments = filteredAttachments.map((att) =>
                att.id ? att.id : {file_name: att.file_name, file_content: att.file_content}
            );

            const response = await updateServiceRequest(serviceRequest?.id, {attachments: payloadAttachments});
            setAttachments(response.attachments || []);
            Notify.success("Attachment removed successfully");
        } catch (error) {
            console.error(error);
            Notify.error("Error removing attachment");
        }
    };

    return (
        <div className="w-full lg:w-2/5 rounded-lg mt-4 lg:mt-0 dark:bg-bodybg">
            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">Rating & Remarks</h2>
                    <Rating name="clickable-rating" value={serviceRequest?.rating} readOnly/>
                </div>
                <div className="xxl:col-span-4 xl:col-span-6 col-span-12">
                    <div className="box custom-box">
                        <div className="box-body">
                          <textarea
                              className="form-control text-sm mb-1"
                              rows="3"
                              value={serviceRequest?.remarks || ""}
                              readOnly={true}
                          />


                        </div>

                    </div>
                </div>
            </div>

            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="box-header p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">Team</h2>
                </div>
                <div className="box-body p-4">
                    <div className="flex flex-col items-end space-y-4">
                        <FormAsyncSelect
                            label={false}
                            isMulti={true}
                            name="user_ids"
                            control={control}
                            errors={errors}
                            placeholder="Members"
                            apiUrl={`/select/users?department_id=${generatedReqData?.service_request?.department_id}`}
                            queryKeyBase="users"
                            preselectedOptions={userOptions}
                        />
                        <button
                            onClick={handleUpdateTeam}
                            className="ti-btn ti-btn-primary-full !py-1 !px-4 !text-[0.75rem] flex items-center justify-center"
                            disabled={updating}
                        >
                            <i className="ri-refresh-line font-semibold align-middle !me-1"></i>
                            <span>{updating ? "Updating..." : "Update"}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="xl:col-span-3 col-span-12 mt-4">
                <SRAttachment
                    attachments={attachments}
                    onUpdateAttachments={handleUpdateAttachments}
                    onRemoveAttachment={handleRemoveAttachment}
                />
            </div>
            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">SLA Activity</h2>
                </div>
                <ActivityList activities={generatedReqData?.activities}/>
            </div>
            <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                <div className="box-header flex justify-between items-center p-4 border-b border-gray-200 bg-blue-50">
                    <h2 className="box-title text-lg font-semibold text-gray-700">Sub Tasks</h2>
                </div>
                <SubTaskList serviceRequest={serviceRequest?.children}/>
            </div>
        </div>
    );
};

export default ContentRight;
