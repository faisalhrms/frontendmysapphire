import {Download, Eye, FileText} from "lucide-react";
import React from "react";

const BoqAttachmentItem = ({attachment}) => {
    const isImage = attachment.file_type === 'image';
    const fileSizeKB = (attachment.file_size / 1024).toFixed(1);

    return (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-gray-50/50 transition-all duration-200 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isImage ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
            }`}>
                <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                    {attachment.file_name}.{attachment.file_extension}
                </div>
                <div className="text-xs text-gray-500">
                    {fileSizeKB} KB • {attachment.file_type}
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => window.open(attachment.file_url, '_blank')}
                    className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                    title="View"
                >
                    <Eye size={14} />
                </button>
                <button
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = attachment.file_url;
                        link.download = `${attachment.file_name}.${attachment.file_extension}`;
                        link.click();
                    }}
                    className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Download"
                >
                    <Download size={14} />
                </button>
            </div>
        </div>
    );
}

export default BoqAttachmentItem;