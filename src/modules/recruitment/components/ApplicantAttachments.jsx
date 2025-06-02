import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";

const ApplicantAttachments = ({ attachments }) => {
    if (!attachments || attachments.length === 0) {
        return <div className="text-center text-gray-500 py-4">No attachments added</div>;
    }

    return (
        <PerfectScrollbar className="max-h-72">
            <div className="attachments">
                <ul className="shared-files list-none">
                    {attachments.map((attachment, index) => (
                        <li key={attachment.id || index} className="!mb-4">
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
                                    <Link
                                        className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70 truncate block max-w-[200px]"
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
    );
};

export default ApplicantAttachments;