import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import ExtractionGrid from "@modules/customer-hub/customer-orders/components/ExtractionGrid.jsx"
import {useEmailExtractions} from "@modules/customer-hub/customer-orders/hooks/useEmailExtraction.js";

const EmailExtractionPanel = ({ email }) => {
  const { extractions, isLoading } = useEmailExtractions(email?.id, email?.mailbox_email)
  const latest = Array.isArray(extractions) && extractions.length ? (extractions[0]?.data || null) : null
  if (!email?.id) return null
  if (isLoading) return <div className="py-6"><LoadingSpinner /></div>
  if (!latest) return <div className="text-sm text-[#8c9097]">No extracted fields</div>
  return <ExtractionGrid data={latest} />
}

export default EmailExtractionPanel
