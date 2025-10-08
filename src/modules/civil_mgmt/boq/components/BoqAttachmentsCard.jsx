import {Paperclip} from "lucide-react";
import React from "react";
import BoqAttachmentItem from "@modules/civil_mgmt/boq/components/BoqAttachmentItem.jsx";

const BoqAttachmentsCard = ({attachments, heading = "Attachments"}) => {
    return (
        attachments && attachments.length > 0 && (
            <div className="box">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 box-header justify-between dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center gap-2">
                        <Paperclip size={16} className="text-gray-600"/>
                        <h6>{heading}</h6>
                        <div
                            className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            {attachments.length}
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {attachments.map((attachment) => (
                            <BoqAttachmentItem key={attachment.id} attachment={attachment}/>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}

export default BoqAttachmentsCard;