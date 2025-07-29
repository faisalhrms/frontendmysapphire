import Tooltip from "@components/Tooltip.jsx";
import {formatDate} from "@helpers/dateTime.js";
import React from "react";

const TaskDeadLineItem = ({task}) => {
    return (
        <span className='flex items-center justify-center'>
            {
                task.completion_timeline !== null
                    ?
                            <span className="me-6 text-success text-[1rem]">
                                <Tooltip
                                    id={`task-tooltip-${task.id}-info`}
                                    tooltipContent={`${task.completion_timeline > 0 ? `Done ${Math.abs(task.completion_timeline)} days after deadline` : 'Done on time'} `}
                                >
                                    {task.completion_timeline > 0 ?
                                        <i className="ri-information-line cursor-pointer"></i> :
                                        <i className="ri-check-double-line cursor-pointer"></i>}
                                </Tooltip>
                            </span>
                                            :
                                            (task.is_overdue ?
                                                <span className="me-6 text-danger text-[1rem]">
                                                    <Tooltip
                                                        id={`task-tooltip-${task.id}-overdue`}
                                                        tooltipContent={`Task is overdue by ${Math.abs(task.days_left)} days`}
                                                    >
                                                        <i className="ri-information-line cursor-pointer"></i>
                                                    </Tooltip>
                                                </span>
                                                :
                                                <span className="me-6 text-secondary text-[1rem]">
                                                    <Tooltip
                                                        id={`task-tooltip-${task.id}-days_left`}
                                                        tooltipContent={`${Math.abs(task.days_left)} days left`}
                                                    >
                                                        <i className="ri-information-line cursor-pointer"></i>
                                                    </Tooltip>
                                                </span>
                                            )}
            <span className={task.completed_at ? 'line-through' : (task.is_overdue ? 'line-through text-danger' : '')}>
                {formatDate(task.ended_at)}
            </span>
        </span>
    )
}

export default TaskDeadLineItem;