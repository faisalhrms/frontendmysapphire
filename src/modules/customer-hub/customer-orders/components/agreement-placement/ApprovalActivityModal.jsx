import React, { useMemo } from "react"
import ApprovalActionTimelineGrid from "@modules/approvals/global/components/ApprovalActionTimelineGrid.jsx"

const ApprovalActivityModal = ({ open, onClose, actions = [] }) => {
  const list = useMemo(() => (actions || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at)), [actions])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div className="w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden border dark:border-white/10 bg-white dark:bg-bodybg flex flex-col">
          <div className="p-5 flex-1 overflow-y-auto">
            <ApprovalActionTimelineGrid actions={list} />
          </div>
          <div className="px-5 py-3 border-t dark:border-white/10 bg-light/40 dark:bg-white/5 flex justify-end">
            <button onClick={onClose} className="ti-btn ti-btn-primary !mb-0">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalActivityModal
