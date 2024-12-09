import PerfectScrollbar from "react-perfect-scrollbar";
import {Link} from "react-router-dom";
import {formatDate} from "@helpers/dateTime.js";

const SubscriptionAttachment=({ attachments })=>{
    return(
        <>
            <div className="box">
                <div className="box-header">
                    <div className="box-title">Attachments <span
                        className="badge bg-primary/10 !rounded-full text-primary ms-1">{attachments.length}</span>
                    </div>
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
                                            <Link
                                                className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
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
            </div>
        </>
    )
}
export default SubscriptionAttachment