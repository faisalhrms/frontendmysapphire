import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
import "@assets/css/custom/attachment-card.css";
import { formatDate } from "@helpers/dateTime.js";

const ProjectDrawingAttachment = ({ drawings = [] }) => {
    if (!drawings) return null;
    return (
        <div className="box">
            {/* Header */}
            <div className="box-header">
                <div className="box-title">
                    Project Drawings{" "}
                    <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
                        {drawings?.length}
                    </span>
                </div>
            </div>

            {/* Body */}
            <PerfectScrollbar className="box-body max-h-72">
                <div className="attachments">
                    <ul className="shared-files list-none">
                        {drawings?.map((drawing, key) => (
                            <li key={key} className="!mb-4">
                                <div className="flex items-center">
                                    <div className="me-2">
                                        <span className="shared-file-icon">
                                            {/* Since these are drawings, show image icon always */}
                                            <i className="ri-image-line"></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <Link
                                            className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                            aria-label={drawing.file_name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            to={drawing.file_url}
                                        >
                                            {drawing.file_name}.{drawing.file_extension}
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {drawings?.length === 0 && (
                        <div className="text-center text-sm text-gray-500">
                            No drawings uploaded
                        </div>
                    )}
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default ProjectDrawingAttachment;
