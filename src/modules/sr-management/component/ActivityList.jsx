import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";

const ActivityList = ({ activities = [], refreshActivities }) => {
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
        if (refreshActivities) await refreshActivities();
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
    return completedAt <= targetTime ? "On Time" : "Delayed";
  };

  return (
    <div className="table-responsive task-table">
      <ConfirmationModal
        show={showConfirmation}
        message="Are you sure you want to mark this activity as completed?"
        onConfirm={confirmMarkAsDone}
        onCancel={() => setShowConfirmation(false)}
      />
      <table className="table whitespace-nowrap table-bordered min-w-full">
        <thead className="table-active">
          <tr className="border-b border-defaultborder">
            <th scope="col" className="text-center !text-xs">Activity</th>
            <th scope="col" className="text-center !text-xs">Sla Days</th>
            <th scope="col" className="text-center !text-xs">Target Time</th>
            <th scope="col" className="text-center !text-xs">Completed at</th>
            <th scope="col" className="text-center !text-xs">SLA</th>
            <th scope="col" className="text-center !text-xs">Action</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <tr key={activity.id} className="border-b border-defaultborder">
                <td className="text-center whitespace-normal break-words">
                  {activity.sla_activity_name}
                </td>
                <td className="text-center whitespace-normal break-words">
                  {activity.sla_activity_days}
                </td>
                <td className="text-center whitespace-normal break-words">
                  {new Date(activity.ended_at).toLocaleString()}
                </td>
                <td className="text-center whitespace-normal break-words">
                  {activity.completed_at ? new Date(activity.completed_at).toLocaleString() : "N/A"}
                </td>
                <td className="text-center whitespace-normal break-words">
                  {getSLAStatus(activity)}
                </td>
                <td className="text-center">
                  <button
                    onClick={() => onMarkAsDone(activity)}
                    className="ti-btn ti-btn-primary ti-btn-sm"
                  >
                    <i className="ri-check-line"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 !text-center text-gray-600">
                No record found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityList;
