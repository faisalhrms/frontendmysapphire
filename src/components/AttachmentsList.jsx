import React from 'react';
import { generateFile } from "@helpers/media.js";

const AttachmentsList = ({ attachments, onDelete }) => (
    <>
        {attachments.map(attachment => (
            <div className="xl:col-span-2 col-span-12" id={attachment.id} key={attachment.id}>
                <div className="gallery-img">
                    <div className="active gallery-img-body text-center border dark:border-defaultborder/10">
                        <span dangerouslySetInnerHTML={{ __html: generateFile(attachment) }} />
                        <div className="actions">
                            <button
                                aria-label="Delete attachment"
                                className="ti-btn ti-btn-icon ti-btn-danger-full ti-btn-wave edit"
                                type="button"
                                onClick={() => onDelete(attachment.id)}
                            >
                                <i className="bx bx-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </>
);

export default AttachmentsList;
