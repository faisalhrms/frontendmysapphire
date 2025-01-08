import {Link} from 'react-router-dom';
import "@assets/css/custom/project-discussion.css";
import React from "react";
import Avatar from "@components/Avatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import videoIcon from "@assets/images/icon/007-video-file.png";
import zipIcon from "@assets/images/icon/005-zip-2.png";
import pdfIcon from "@assets/images/icon/002-pdf-file-format-symbol.png";
import wordIcon from "@assets/images/icon/010-word.png";
import excelIcon from "@assets/images/icon/011-excel-file.png";
import powerpointIcon from "@assets/images/icon/powerpoint.png";
import fileIcon from "@assets/images/icon/008-file.png";


const generateIcon = (attachment) => {
    const { extension, file, file_name } = attachment;
    let imgStyle = "height: 40px; width: 40px;";

    if (extension === ".png" || extension === ".jpg" || extension === ".jpeg" || extension === ".gif") {
        return `<img style="object-fit: contain;" src="${file}" alt="${file_name}">`;
    }

    if (extension === ".mp4" || extension === ".avi" || extension === ".mov") {
        return `<img src="${videoIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".zip" || extension === ".rar") {
        return `<img src="${zipIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".pdf") {
        return `<img src="${pdfIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".doc" || extension === ".docx") {
        return `<img src="${wordIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".xls" || extension === ".xlsx") {
        return `<img src="${excelIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".ppt" || extension === ".pptx") {
        return `<img src="${powerpointIcon}" alt="${file_name}" style="${imgStyle}">`;
    }

    if (extension === ".mp3" || extension === ".wav" || extension === ".ogg") {
        return `
            <audio controls style="width: 60px; margin-top: 10px;">
                <source src="${file}" type="audio/${extension.slice(1)}">
                Your browser does not support the audio tag.
            </audio>
        `;
    }

    return `<img src="${fileIcon}" alt="${file_name}" style="${imgStyle}">`;
};

const SRDiscussionItem = ({ discussion, userId, control, errors }) => {
    if (!discussion || !control) {
        console.error("Missing required props in SRDiscussionItem:", { discussion, control });
        return null;
    }

    const defaultMessage = typeof discussion.message === "string" ? discussion.message : "";

    return (
        <li>
            <div>
                <Avatar avatar={discussion.user?.avatar} parentClasses="profile-timeline-avatar" />
                <p className="mb-2">
                    {userId === discussion.user?.id ? <b>You</b> : <b>{discussion.user?.full_name || discussion.sender}</b>}
                    <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                        {formatDate(discussion.created_at, "MMM dd, yyyy - HH:mm")}
                    </span>
                </p>
                {control && (
                    <FormRichTextarea
                        name={`message_${discussion.id}`}
                        control={control}
                        errors={errors}
                        readOnly
                        editorOptions={{
                            height: 200,
                            buttonList: [
                            ],
                        }}
                        defaultValue={defaultMessage}
                    />
                )}
                {discussion.attachments?.length > 0 && (
                    <p className="profile-activity-media mb-0 flex">
                        {discussion.attachments.map((attachment) => (
                            <Link
                                key={`${discussion.id}-${attachment.id}`}
                                to={attachment.file}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span dangerouslySetInnerHTML={{ __html: generateIcon(attachment) }} />
                            </Link>
                        ))}
                    </p>
                )}
            </div>
        </li>
    );
};

export default SRDiscussionItem;
