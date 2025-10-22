import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import AgreementPlacementForm from "@modules/customer-hub/mail-app/components/AgreementPlacementForm.jsx"

const AgreementPlacementPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="ti-btn ti-btn-light !mb-0 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div className="max-h-[80vh] overflow-y-auto">
        <AgreementPlacementForm seed={state?.seed || {}} email={state?.email} showHeader />
      </div>
    </div>
  )
}

export default AgreementPlacementPage
