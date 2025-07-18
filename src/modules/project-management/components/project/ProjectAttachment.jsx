import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatDate} from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css"
import {Link} from "react-router-dom";
import GalleryUpload from "@components/GalleryUpload.jsx";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";

const ProjectAttachment = ({ attachments: initialAttachments, Id = null, projectUsers = [] }) => {
    const [attachments, setAttachments] = useState(initialAttachments || []);
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
            const response = await api.post(`/pms/projects/${Id}/attachments/link/`, {
                attachment_ids: attachmentIds
            });
            setClearFiles(true);
            reset({ attachment_ids: [] });
            Notify.success("Attachments linked successfully");
            const newAttachments = response.data.data;
            setAttachments((prev) => [...prev, ...newAttachments]);
        } catch (error) {
            Notify.error("Failed to attach files");
        } finally {
            setLoading(false);
            setTimeout(() => setClearFiles(false), 10);
        }
    };
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Attachments <span className="badge bg-primary/10 !rounded-full text-primary ms-1">{attachments.length}</span></div>
            </div>
            <PerfectScrollbar className="box-body max-h-72">
            <div className="attachments">
                    <ul className="shared-files list-none">
                        {attachments?.map((attachment, key) => (
                            <li key={key} className="!mb-4">
                                <div className="flex items-center">
                                    <div className="me-2">
                                    <span className="shared-file-icon">
                                            {attachment.file_type.startsWith('image') && (
                                                <i className="ri-image-line"></i>
                                            )}
                                            {attachment.file_type.startsWith('video') && (
                                                <i className="ri-video-line"></i>
                                            )}
                                            {attachment.file_type.includes('audio') ||
                                            attachment.file_type.startsWith('audio') ? (
                                                <i className="ri-user-voice-line"></i>
                                            ) : (
                                                !attachment.file_type.startsWith('image') &&
                                                !attachment.file_type.startsWith('video') && (
                                                    <i className="ti ti-file-text"></i>
                                                )
                                            )}
                                    </span>
                                    </div>
                                    <div className="flex-grow">
                                        <Link className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                              aria-label={attachment.file_name}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              to={attachment.file_url}
                                        >
                                            {attachment.file_name}.{attachment.file_extension}
                                        </Link>
                                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                            {formatDate(attachment.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </PerfectScrollbar>
            {
                Id &&
                <HasProjectPermission globalPermission='pms.change_project' users={projectUsers}>
                    <div className="box-footer text-center">
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
                        {attachmentIds.length > 1 && (
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
                </HasProjectPermission>
            }
        </div>
    );
};

export default ProjectAttachment;
