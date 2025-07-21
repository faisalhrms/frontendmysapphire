import GalleryUpload from "@components/GalleryUpload.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import {generateFile} from "@helpers/media.js";
import {formatDate} from "@helpers/dateTime.js";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {Files} from "lucide-react";
import EmptyState from "@components/EmptyState.jsx";

const TaskDetailAttachments = ({task, viewOnly = true}) => {
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const [attachments, setAttachments] = useState(task.attachments || []);
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            attachment_ids: []
        }
    });
    const [loading, setLoading] = useState(false);
    const attachmentIds = watch("attachment_ids") || [];
    const [clearFiles, setClearFiles] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await api.post(`/pms/tasks/${task.id}/attachments/link/`, {
                attachment_ids: attachmentIds
            });

            setClearFiles(true);
            reset({ attachment_ids: [] });
            Notify.success("Attachments linked successfully");

            let newAttachments = response.data.data;
            if (Array.isArray(newAttachments)) {
                setAttachments((prev) => [...prev, ...newAttachments]);
            }
        } catch (error) {
            Notify.error("Failed to attach files");
        } finally {
            setLoading(false);
            setTimeout(() => setClearFiles(false), 10);
        }
    };

    return (
        <>
            <div className="h-full rounded-lg overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                {
                    !viewOnly &&
                    <div className="text-center p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <GalleryUpload
                            currentValue={[]}
                            files={[]}
                            inputName="attachment_ids"
                            placeholder=""
                            control={control}
                            errors={errors}
                            btnTxt='Upload Attachments'
                            portal={true}
                            clearFiles={clearFiles}
                        />
                        {attachmentIds.length > 0 && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <button
                                    type="submit"
                                    className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem] mt-3"
                                >
                                    {loading && <i className="ri-loader-4-line animate-spin mr-2"></i>}
                                    {loading ? "Attaching..." : "Attach"}
                                </button>
                            </form>
                        )}
                    </div>
                }

                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Existing Attachments
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {attachments?.length || 0} file(s)
                        </span>
                    </div>

                    {!attachments || attachments.length === 0 ? (
                        <EmptyState
                            icon={Files}
                            heading="No Attachments Found"
                            description="Upload files using the section above"
                        />
                    ) : (
                        <div className="space-y-3">
                            <PerfectScrollbar className='max-h-[calc(100vh-25rem)] ps--active-y'>
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="mb-2 flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-3 hover:shadow-md transition-all dark:text-gray-200 dark:bg-bodybg dark:border-gray-600"
                                    >
                                        <div className="flex-shrink-0">
                                            <div
                                                className="w-10 h-10 flex items-center justify-center"
                                                dangerouslySetInnerHTML={{__html: generateFile(attachment)}}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 px-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {attachment.file_name}
                                                {attachment.file_extension && `.${attachment.file_extension}`}
                                            </p>
                                            <div
                                                className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <span>{formatFileSize(attachment.file_size)}</span>
                                                {attachment.uploaded_at && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{formatDate(attachment.uploaded_at)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <a
                                                href={attachment.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ti-btn ti-btn-info ti-btn-sm"
                                                title="View / Download"
                                            >
                                                <i className="ri-eye-line"/>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </PerfectScrollbar>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default TaskDetailAttachments