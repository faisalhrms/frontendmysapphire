import React from 'react'
import SRAttachment from "@modules/sr-management/component/SRAttachment.jsx";

const EmailAttachmentModal = ({ show, onClose, attachments, selectedIds, toggleId, handleUpdateAttachments }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h6 className="text-base font-semibold">Manage Attachments</h6>
          <button onClick={onClose}>
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <div className="p-4">
          <SRAttachment
            attachments={attachments}
            selectable
            selectedIds={selectedIds}
            onToggleSelect={toggleId}
            onUpdateAttachments={handleUpdateAttachments}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="ti-btn ti-btn-secondary-full m-2">
            Save Selected Files
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailAttachmentModal
