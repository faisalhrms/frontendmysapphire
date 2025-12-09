import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";

const RequisitionAttachments = ({ attachments }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">
                    Attachments
                    <span className="badge bg-primary/10 ms-1">{attachments.length}</span>
                </div>
            </div>

            <PerfectScrollbar className="box-body max-h-72">
                <ul className="shared-files list-none">
                    {attachments.map((file) => (
                        <li key={file.id} className="mb-3">
                            <div className="flex items-center gap-2">
                                <i className="ri-file-line text-lg"></i>

                                <div>
                                    <Link
                                        to={file.file_url}
                                        className="text-sm font-semibold"
                                        target="_blank"
                                    >
                                        {file.file_name}.{file.file_extension}
                                    </Link>

                                    <p className="text-xs text-gray-500">
                                        {formatDate(file.created_at)}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </PerfectScrollbar>
        </div>
    );
};

export default RequisitionAttachments;
