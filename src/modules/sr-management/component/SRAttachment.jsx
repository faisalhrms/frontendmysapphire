import React, { useState, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import { Link } from "react-router-dom";
import Notify from "@helpers/toastNotifications.js";

const getAttachmentIcon = (fileType) => {
    if (!fileType) return "ti ti-file-text";
    if (fileType.startsWith("image")) return "ri-image-line";
    if (fileType.startsWith("video")) return "ri-video-line";
    if (fileType.startsWith("audio") || fileType.includes("audio")) return "ri-user-voice-line";
    return "ti ti-file-text";
};

const SRAttachment = ({ attachments, onRemoveAttachment, onUpdateAttachments }) => {
    const safeAttachments = Array.isArray(attachments) ? attachments : [];
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null); // Reference for the input element

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpdateAttachments = async () => {
        setIsUpdating(true);
        try {
            if (!selectedFile) {
                Notify.error("No file selected");
                return;
            }

            await onUpdateAttachments({ file: selectedFile }); // Pass only the selected file
            setSelectedFile(null); // Clear the file state
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset the input field
            }
        } catch (error) {
            Notify.error("Error uploading attachment");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="box shadow-md border border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="box-header">
                <div className="box-title">
                    Attachments <span className="badge bg-primary/10 !rounded-full text-primary ms-1">{safeAttachments.length}</span>
                </div>
            </div>
            <PerfectScrollbar className="box-body max-h-72">
                <div className="attachments">
                    <ul className="shared-files list-none">
                        {safeAttachments.map((attachment, key) => (
                            <li key={key} className="!mb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="me-2">
                                        <span className="shared-file-icon">
                                            <i className={getAttachmentIcon(attachment.file_type)}></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <Link
                                            className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                            aria-label={attachment.file_name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            to={attachment.file}
                                        >
                                            {attachment.file_name || "Unknown File"}
                                        </Link>
                                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                            {formatDate(attachment.created_at)}
                                        </p>
                                    </div>
                                </div>
                                {onRemoveAttachment && (
                                    <button
                                        onClick={() => onRemoveAttachment(attachment.id)}
                                        className="ti-btn ti-btn-danger ti-btn-sm"
                                    >
                                        <i className="ri-close-circle-line"></i>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </PerfectScrollbar>

            <div className="box-footer border-t p-2 flex items-center justify-between gap-2 rounded-md">
                <div className="flex-grow !text-xs">
                    <label className="block !text-xs">
                        <span className="sr-only">Choose Files</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm !text-xs focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10 dark:border-white/10 dark:text-[#8c9097] dark:text-white/50 file:me-4 file:py-2 file:px-4 file:rounded-s-sm file:border-0 file:!text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary focus-visible:outline-none"
                        />
                    </label>
                </div>

                <button
                    type="button"
                    className="bg-primary text-white text-[0.75rem] px-4 py-2 rounded-full hover:bg-primary/90"
                    onClick={handleUpdateAttachments}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
};

export default SRAttachment;
