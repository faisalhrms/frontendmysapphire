import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import { Link } from "react-router-dom";

const getAttachmentIcon = (fileType) => {
    if (!fileType) return "ti ti-file-text"; // Default icon for undefined or null file_type
    if (fileType.startsWith("image")) return "ri-image-line"; // Icon for images
    if (fileType.startsWith("video")) return "ri-video-line"; // Icon for videos
    if (fileType.startsWith("audio") || fileType.includes("audio")) return "ri-user-voice-line"; // Icon for audio
    return "ti ti-file-text"; // Default icon for other file types
};

const SRAttachment = ({ attachments }) => {
    // Ensure attachments is an array
    const safeAttachments = Array.isArray(attachments) ? attachments : [];

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">
                    Attachments <span className="badge bg-primary/10 !rounded-full text-primary ms-1">{safeAttachments.length}</span>
                </div>
            </div>
            <PerfectScrollbar className="box-body max-h-72">
                <div className="attachments">
                    <ul className="shared-files list-none">
                        {safeAttachments.map((attachment, key) => (
                            <li key={key} className="!mb-4">
                                <div className="flex items-center">
                                    {/* Attachment Icon */}
                                    <div className="me-2">
                                        <span className="shared-file-icon">
                                            <i className={getAttachmentIcon(attachment.file_type)}></i>
                                        </span>
                                    </div>

                                    {/* File Name and Details */}
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
                            </li>
                        ))}
                    </ul>
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default SRAttachment;
