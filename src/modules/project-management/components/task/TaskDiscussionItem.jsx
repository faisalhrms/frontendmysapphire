import {Link} from 'react-router-dom';
import "@assets/css/custom/project-discussion.css";
import React from "react";
import Avatar from "@components/Avatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {generateFile} from "@helpers/media.js";

const TaskDiscussionItem = ({task, userId}) => {
    return (
        <>
            <li>
                <div>
                    <Avatar avatar={task.user.avatar} parentClasses='profile-timeline-avatar'/>
                    <p className="mb-2">
                        {
                            userId === task.user.id ? <b>You</b> : <b>{task.user.full_name}</b>
                        }
                        <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">{formatDate(discussion.created_at, 'MMM dd, yyyy - HH:mm')}</span>
                    </p>
                    <p className="text-[#8c9097] dark:text-white/50 mb-0">
                        {task.message}
                    </p>
                    {
                        task.attachments.length > 0 &&
                        (
                            <p className="profile-activity-media mb-0 flex">
                                {
                                    task.attachments.map(attachment => (
                                        <Link
                                            key={`${task.id}-${attachment.id}`}
                                            to={attachment.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span dangerouslySetInnerHTML={{__html: generateFile(attachment)}}/>
                                        </Link>
                                    ))
                                }
                            </p>
                        )
                    }
                </div>
            </li>
        </>
    );
};

export default TaskDiscussionItem;
