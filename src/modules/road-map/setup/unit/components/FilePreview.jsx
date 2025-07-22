import React from 'react';
import { generateFile } from "@helpers/media.js";

const FilePreview = ({ attachments, onDelete }) => (
  <div className="flex space-x-4">
    {attachments.map(att => (
      <div key={att.id} className="relative group inline-block">
        <span dangerouslySetInnerHTML={{ __html: generateFile(att) }} />
        <button
          type="button"
          onClick={() => onDelete(att.id)}
          className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 ti-btn-danger-full rounded-lg ti-btn-wave edit text-white"
          aria-label="Delete"
        >
          <i className="bx bx-trash"></i>
        </button>
      </div>
    ))}
  </div>
);

export default FilePreview;
