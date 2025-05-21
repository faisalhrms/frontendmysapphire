import React, {useState} from "react";
import Avatar from "@components/Avatar.jsx";
import {useServiceRequestForm} from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Link} from "react-router-dom";
import {formatDate} from "@helpers/dateTime.js";
import {getAttachmentColor, getAttachmentIcon} from "@modules/sr-management/services/srServices.js";

const ServiceRequestCard = ({serviceData = {}, currentUser}) => {
    const [remarks, setFeedback] = useState("");
    const [status, setStatus] = useState("Closed");
    const [rating, setRating] = useState(serviceData.rating || 0);
    const {submitFeedback} = useServiceRequestForm(serviceData, false);
    const handleSubmit = async () => {
        const feedbackData = {remarks, status, rating};
        await submitFeedback(serviceData?.id, feedbackData);
    };
    const attachments = Array.isArray(serviceData.attachments) ? serviceData.attachments : [];

    return (
        <div className="w-full lg:w-1/3 rounded-lg mt-4 lg:mt-0 dark:bg-bodybg">
            <div className="box bg-primary">
                <div className="flex items-start bg-primary p-4 rounded-xl shadow-md">
                    <Avatar avatar={serviceData?.employee_info?.avatar} size="xl" parentClasses="me-4"/>
                    <div className="flex-grow text-white">
                        <h6 className="font-semibold text-lg mb-1">
                            {serviceData?.reporter || currentUser?.full_name}
                        </h6>
                        <p className="opacity-70 mb-1">
                            {serviceData?.company?.name || currentUser?.company?.name}
                        </p>
                        <div className="flex items-center mb-2">
                            <div>
                                <p className="text-sm opacity-50 mb-0">{serviceData?.name}</p>
                                <p className="text-md font-normal mb-0 text-shadow">
                                    {(serviceData?.created_at ? new Date(serviceData.created_at) : new Date()).toLocaleString() || "No Date"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm">{serviceData?.status}</p>
                            <p className="text-sm">{serviceData?.startDate || "Mar 08, 2023"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box">
                <div className="p-4">
                    <div>
                        <label className="form-label text-sm mb-2">Feedback</label>
                        <textarea
                            className="form-control text-sm mb-3"
                            rows="3"
                            value={remarks}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-label text-sm mb-2">Status</label>
                        <select
                            className="form-control text-sm mb-3"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Closed">Closed</option>
                            <option
                                value="In-Progress"
                                disabled={
                                    serviceData?.closed_at &&
                                    (new Date() - new Date(serviceData.closed_at)) / (1000 * 60 * 60 * 24) > 5
                                }
                            >
                                ReOpen
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label text-sm mb-2">Rating</label>
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary w-full" onClick={handleSubmit}>
                        Submit Feedback
                    </button>
                </div>
            </div>
            <div className="box">
                <div className="box-header">
                    <div className="box-title">Attachments <span
                        className="badge bg-primary/10 !rounded-full text-primary ms-1">{attachments.length}</span>
                    </div>
                </div>
                <PerfectScrollbar className="box-body max-h-72">
                    <ul className="shared-files list-none">
                        {attachments.map((attachment, idx) => {
                            return (
                                <li key={idx} className="!mb-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                   <div className="me-2">
                                        <span className="shared-file-icon">
                                        <i className={`${getAttachmentIcon(attachment.file_type)} ${getAttachmentColor(attachment.file_type)} text-xl`}></i>
                                        </span>
                                    </div>
                                        <div className="flex-grow">
                                            <Link
                                                className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                to={attachment.file || "#"}
                                            >
                                                {attachment.file_name || "Unknown File"}
                                            </Link>
                                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                                {formatDate(attachment.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    );
};

export default ServiceRequestCard;
