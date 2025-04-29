import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import media86 from "../../../assets/images/media/media-83.svg";
import SimpleBar from "simplebar-react";
import {format} from 'date-fns';

const ActivityList = ({activities = [], refreshActivities}) => {
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const onViewTask = (id) => {
        navigate(`/module/ess/service-request/detail/${id}`);
    };

    const onMarkAsDone = (activity) => {
        setSelectedActivity(activity);
        setShowConfirmation(true);
    };

    const confirmMarkAsDone = async () => {
        try {
            const response = await api.post(
                `/sr-task/${selectedActivity.sr_task}/activity/${selectedActivity.id}/complete`
            );
            if (response.status === 200) {
                Notify.success("Activity marked as completed");
                setShowConfirmation(false);
                await refreshActivities?.();
            } else {
                Notify.error("Failed to mark activity as completed");
            }
        } catch (error) {
            Notify.error("Failed to mark activity as completed");
        }
    };

    const getSLAStatus = (activity) => {
        if (!activity.completed_at) return "";
        const completedAt = new Date(activity.completed_at);
        const targetTime = new Date(activity.ended_at);
        return completedAt <= targetTime ? "On Time" : "Due Date";
    };

    return (
        <>
            <div className="border-b dark:border-defaultborder/10">
                <ConfirmationModal
                    show={showConfirmation}
                    message="Are you sure you want to mark this activity as completed?"
                    onConfirm={confirmMarkAsDone}
                    onCancel={() => setShowConfirmation(false)}
                />
                <SimpleBar className="p-3" style={{height: "330px"}}>
                    <ul className="list-none mb-0 fullcalendar-events-activity" id="full-calendar-activity">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <li key={activity.id} className="mb-4">
                                    <div className="flex items-center justify-between flex-wrap">
                                        <p className="mb-1 flex items-center gap-2">
                                            <span
                                                className="font-medium text-defaulttextcolor dark:text-defaulttextcolor/70">{activity.sla_activity_name}</span>
                                            <span
                                                className="px-2 py-0.5 text-xs bg-gray-90 text-gray-600 rounded-full">
                                          {activity.sla_activity_days} Day SLA
                                        </span>
                                        </p>


                                        {getSLAStatus(activity) && (
                                            <span
                                                className={`badge ${getSLAStatus(activity) === 'On Time' ? 'bg-success' : 'bg-danger'} text-white`}>
                                        {getSLAStatus(activity)}
                                      </span>
                                        )}

                                    </div>
                                    <p className="badge bg-light text-default">
                                        Target Time: {format(new Date(activity.ended_at), 'EEEE, MMM d, yyyy, h:mm a')}
                                    </p>
                                    <div className="flex items-center justify-between flex-wrap">
                                        <div>
                                            <p className="badge bg-light text-default">
                                                Completed: {activity.completed_at ? format(new Date(activity.completed_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onMarkAsDone(activity)}
                                            className="ti-btn ti-btn-primary ti-btn-sm"
                                        >
                                            <i className="ri-check-line"></i>
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="p-4">
                                <img src={media86} alt=""/>
                            </div>
                        )}
                    </ul>
                </SimpleBar>
            </div>

        </>
    );
};

export default ActivityList;
