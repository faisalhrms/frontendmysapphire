import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@components/Avatar.jsx";
import Tooltip from "@components/Tooltip.jsx";
import { formatDate } from "@helpers/dateTime.js";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import videoIcon from "@assets/images/icon/007-video-file.png";
import zipIcon from "@assets/images/icon/005-zip-2.png";
import pdfIcon from "@assets/images/icon/002-pdf-file-format-symbol.png";
import wordIcon from "@assets/images/icon/010-word.png";
import excelIcon from "@assets/images/icon/011-excel-file.png";
import powerpointIcon from "@assets/images/icon/powerpoint.png";
import fileIcon from "@assets/images/icon/008-file.png";

const generateIcon = attachment => {
  const { extension, file, file_name } = attachment;
  const imgStyle = "height:60px;width:60px;";
  if ([".png", ".jpg", ".jpeg", ".gif"].includes(extension)) return `<img style="object-fit:contain;" src="${file}" alt="${file_name}">`;
  if ([".mp4", ".avi", ".mov"].includes(extension)) return `<img src="${videoIcon}" alt="${file_name}" style="${imgStyle}">`;
  if ([".zip", ".rar"].includes(extension)) return `<img src="${zipIcon}" alt="${file_name}" style="${imgStyle}">`;
  if (extension === ".pdf") return `<img src="${pdfIcon}" alt="${file_name}" style="${imgStyle}">`;
  if ([".doc", ".docx"].includes(extension)) return `<img src="${wordIcon}" alt="${file_name}" style="${imgStyle}">`;
  if ([".xls", ".xlsx"].includes(extension)) return `<img src="${excelIcon}" alt="${file_name}" style="${imgStyle}">`;
  if ([".ppt", ".pptx"].includes(extension)) return `<img src="${powerpointIcon}" alt="${file_name}" style="${imgStyle}">`;
  if ([".mp3", ".wav", ".ogg"].includes(extension)) {
    return `<audio controls style="width:60px;margin-top:10px;"><source src="${file}" type="audio/${extension.slice(1)}"></audio>`;
  }
  return `<img src="${fileIcon}" alt="${file_name}" style="${imgStyle}">`;
};

const SRDiscussionItem = ({ discussion, userId, control, errors }) => {
  if (!discussion || !control) return null;
  const senderName = userId === discussion.user?.id ? "You" : discussion.user?.full_name || discussion.sender;
  const defaultMessage = typeof discussion.message === "string" ? discussion.message : "";

  return (
    <li className="mb-3">
      <div className="flex items-start space-x-2">
        <Avatar avatar={discussion.user?.avatar} parentClasses="profile-timeline-avatar" />
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">{senderName}</span>
            <span className="text-[0.625rem] text-gray-500">
              {formatDate(discussion.created_at, "MMM dd, yyyy - HH:mm")}
            </span>
          </div>

          {discussion.to_email?.length > 0 && (
            <div className="flex flex-wrap items-center mb-1">
              <span className="font-medium text-[0.65rem] mr-1">To:</span>
              {discussion.to_email.map((item, i) => {
                const label = typeof item === "object" ? item.name : item;
                const email = typeof item === "object" ? item.email : item;
                return (
                  <Tooltip
                    key={i}
                    id={`to-tooltip-${discussion.id}-${i}`}
                    text={label}
                    tooltipContent={email}
                  >
                    <span className="bg-blue-50 text-blue-800 text-[0.6rem] px-1 py-0.5 rounded mr-1 mb-1">
                      {label}
                    </span>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {discussion.cc_email?.length > 0 && (
            <div className="flex flex-wrap items-center mb-2">
              <span className="font-medium text-[0.65rem] mr-1">Cc:</span>
              {discussion.cc_email.map((item, i) => {
                const label = typeof item === "object" ? item.name : item;
                const email = typeof item === "object" ? item.email : item;
                return (
                  <Tooltip
                    key={i}
                    id={`cc-tooltip-${discussion.id}-${i}`}
                    text={label}
                    tooltipContent={email}
                  >
                    <span className="bg-gray-50 text-blue-800 text-[0.6rem] px-1 py-0.5 rounded mr-1 mb-1">
                      {label}
                    </span>
                  </Tooltip>
                );
              })}
            </div>
          )}

          <div className="border border-gray-200 rounded-md p-2 bg-white shadow-sm mb-2 text-sm leading-relaxed">
            <FormRichTextarea
              name={`message_${discussion.id}`}
              control={control}
              errors={errors}
              readOnly
              editorOptions={{
                height: 'auto',
                buttonList: [],
                defaultStyle: "font-family:Calibri,sans-serif;font-size:0.85rem;"
              }}
              defaultValue={defaultMessage}
            />
          </div>

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
      </div>
    </li>
  );
};

export default SRDiscussionItem;
