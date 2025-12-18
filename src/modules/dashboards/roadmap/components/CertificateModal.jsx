import React, { useState } from "react"
import CertificateTable from "@modules/dashboards/roadmap/components/CertificateTable.jsx";

const CertificateModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("expired")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="box w-full max-w-6xl max-h-[80vh] flex flex-col">
        <div className="box-header flex items-center justify-between border-b border-defaultborder dark:border-defaultborder/10">
          <div className="box-title flex items-center gap-2">
            <i className="ri-certificate-line text-[1.25rem]" />
            <span>Certificates Overview</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ti-btn ti-btn-icon ti-btn-light !rounded-full"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-3">
          <div className="inline-flex items-center gap-2 border-b border-defaultborder dark:border-defaultborder/10">
            <button
              type="button"
              onClick={() => setActiveTab("expired")}
              className={
                "px-4 py-2 text-sm border-b-2 " +
                (activeTab === "expired"
                  ? "border-danger text-danger font-medium"
                  : "border-transparent text-[#8c9097]")
              }
            >
              Expired
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("month")}
              className={
                "px-4 py-2 text-sm border-b-2 " +
                (activeTab === "month"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-[#8c9097]")
              }
            >
              Expiring this month
            </button>
          </div>
        </div>

        <div className="box-body flex-1 overflow-auto p-4">
          <CertificateTable bucket={activeTab} />
        </div>
      </div>
    </div>
  )
}

export default CertificateModal
