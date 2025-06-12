import React from "react";
import moment from 'moment';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useTaskActivityLog} from "@modules/project-management/hooks/taskHooks.js";

const TaskActivityLog = ({ id = null }) => {
    const { data, isLoading } = useTaskActivityLog(id);

    const getActionStyles = (actionType) => {
        const success = ['created', 'tag_added', 'team_added', 'member_added', 'attachment_added'];
        const warning = ['updated', 'dates_changed'];
        const danger = ['deleted', 'member_removed'];

        if (success.includes(actionType)) {
            return { icon: 'featured-success', text: 'text-success' };
        }
        if (warning.includes(actionType)) {
            return { icon: 'featured-warning', text: 'text-warning' };
        }
        if (danger.includes(actionType)) {
            return { icon: 'featured-danger', text: 'text-danger' };
        }
        return { icon: 'featured-primary', text: 'text-primary' };
    };

    const renderMessage = (log) => {
        const { message, created_by, action_type } = log;
        const userName = created_by?.full_name || 'System';
        const cleanMessage = message;
        const parts = cleanMessage.split(/(['"][^'"]+['"])/);

        return (
            <p className="mb-0">
                <span className={`font-semibold`}>
                  #{userName}
                </span>
                <span className="ms-2 text-[0.75rem]">
                  {parts.map((part, index) => {
                      if (part.match(/^['"].*['"]$/)) {
                          return (
                              <span key={index} className="font-semibold">
                          {part.slice(1, -1)}
                        </span>
                          );
                      }
                      return part;
                  })}.
                </span>
                {action_type === 'attachment_added' && (
                    <p className="p-1 border border-dotted dark:border-defaultborder/10 wp-50 br-5 mb-0">
                        <span>
                            <span className="badge bg-success text-white me-2">File</span>
                            <span className="text-[0.6875rem]"> {cleanMessage.match(/['"]([^'"]+)['"]/)[1]}</span>
                        </span>
                    </p>
                )}
            </p>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <LoadingSpinner />
            </div>
        );
    }

    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)){
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                No activity logs found.
            </div>
        );
    }

    return (
        <div className="latest-timeline">
            <ul className="timeline-main mb-0 list-unstyled">
                {data.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <li>
                            <div className={`featured_icon1 ${getActionStyles(item.action_type).icon}`}></div>
                        </li>
                        <li className="mt-0 activity">
                            <div className="text-[0.75rem] animate-fade-in">
                                {renderMessage(item)}
                                <small className="text-[#8c9097] dark:text-white/50 mt-0 mb-0 block text-[0.625rem]">
                                    {moment(item.created_at).fromNow()}.
                                </small>
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default TaskActivityLog;