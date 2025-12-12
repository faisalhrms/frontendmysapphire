import React, { useState } from "react"
import { Award } from "lucide-react"
import CertificateModal from "@modules/dashboards/roadmap/components/CertificateModal.jsx";

const CertificateAlerts = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors shadow-sm border-amber-500/40 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300"
        title="View certificates"
      >
        <Award className="h-4 w-4 mr-1.5" />
        <span>Certificates</span>
      </button>

      <CertificateModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default CertificateAlerts
