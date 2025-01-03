import React, {useState} from "react";
import face5 from "@assets/images/faces/5.jpg";
import {useServiceRequestForm} from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";

const ServiceRequestCard = ({serviceData = {}, currentUser}) => {
    const [remarks, setFeedback] = useState(serviceData.remarks || "");
    const [status, setStatus] = useState(serviceData.status || "");
    const [rating, setRating] = useState(serviceData.rating || 0);

    const {submitFeedback} = useServiceRequestForm(serviceData, false);

    const handleSubmit = async () => {
        const feedbackData = {
            remarks,
            status,
            rating,
        };
        await submitFeedback(serviceData?.id, feedbackData);
    };

    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box bg-primary">
                <div className="flex items-start bg-primary p-4 rounded-xl shadow-md">
                    <span className="avatar avatar-xl avatar-rounded mr-4">
                        <img src={face5} alt="Profile" className="rounded-full w-16 h-16"/>
                    </span>
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
                                    {(serviceData?.created_at
                                            ? new Date(serviceData.created_at)
                                            : new Date()
                                    ).toLocaleString() || "No Date"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm">{serviceData?.status || "In Service"}</p>
                            <p className="text-sm">
                                {serviceData?.startDate || "Mar 08, 2023"}
                            </p>
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
                            <option>Select Status</option>
                            <option value="Closed">Closed</option>
                            <option value="In-Progress">ReOpen</option>
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
                    <button
                        className="btn btn-primary w-full"
                        onClick={handleSubmit}
                    >
                        Submit Feedback
                    </button>


                </div>
            </div>
        </div>
    );
};

export default ServiceRequestCard;
