import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "@components/Tooltip.jsx";
import { getBadgeClasses } from "@helpers/badges.js";
import { getExcerptFromText, toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import Avatar from "@components/Avatar.jsx";

const TaskApprovalCard = ({ approval, onApprove, onReject }) => {
    return (
        <div className="box custom-box">
            <div className="box-header items-center !justify-center flex-wrap !flex">
                <div className="flex-grow">
                    <Tooltip
                        id={`project-tooltip-${approval.id}`}
                        text={`(${approval.task.task_no}) ${approval.task.name}`}
                        tooltipContent={`Task Number: ${approval.task.task_no}`}
                    >
                        <Link
                            to={`/module/tasks/detail/${approval.task.id}`}
                            className="font-semibold text-[.875rem] block text-truncate project-list-title">
                            {approval.task.name}
                        </Link>
                    </Tooltip>
                </div>
            </div>

            <div className="box-body">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="font-semibold mb-1">Requester:</div>
                        <Avatar avatar={approval.requester.avatar} />
                    </div>
                    <div className="text-end">
                        <div className="font-semibold mb-1">Priority :</div>
                        <span className={getBadgeClasses(approval.task.priority)}>{toTitleCase(approval.task.priority)}</span>
                    </div>
                </div>
                <div className="font-semibold mb-1">Description :</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">{getExcerptFromText(approval.task.description, 200)}</p>

                <div className="flex mt-5 items-center justify-between">
                    <div>
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Assigned Date :</span>
                        <span className="font-semibold block">{formatDate(approval.task.started_at)}</span>
                    </div>
                    <div>
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Due Date :</span>
                        <span className="font-semibold block">{formatDate(approval.task.ended_at)}</span>
                    </div>
                    <div className="text-end">
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Submission Date :</span>
                        <span className="font-semibold block">{formatDate(approval.created_at)}</span>
                    </div>
                </div>
            </div>

            <div className="box-footer flex items-center justify-between">
                <div>
                    <button type="button" aria-label="Approve"
                            className="ti-btn ti-btn-sm ti-btn-success me-[0.375rem]"
                            onClick={onApprove}
                    ><i className="bx bxs-like"></i>
                    </button>
                </div>
                <div className="text-end">
                    <button type="button" aria-label="Reject"
                            className="ti-btn ti-btn-sm ti-btn-danger me-[0.375rem]"
                            onClick={onReject}
                    ><i className="bx bxs-dislike"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskApprovalCard;