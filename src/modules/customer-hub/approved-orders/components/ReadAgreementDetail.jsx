import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import { getAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import AgreementPlacementReadOnly
    from "@modules/customer-hub/approved-orders/components/AgreementPlacementReadOnly.jsx";

const ReadAgreementDetail = () => {
  const location = useLocation()
  const params = useParams()
  const idFromState = location.state?.id
  const idFromParams = params?.id
  const id = idFromState || idFromParams

  const [agreement, setAgreement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError("Missing agreement id")
      setLoading(false)
      return
    }
    let active = true
    const run = async () => {
      try {
        const data = await getAgreement(id)
        if (!active) return
        setAgreement(data)
      } catch (e) {
        if (!active) return
        setError("Failed to load agreement")
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [id])

  if (!id) return <div className="p-4">Invalid agreement</div>
  if (loading) return <div className="p-4">Loading agreement...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!agreement) return <div className="p-4">Agreement not found</div>

  return (
    <div className="px-4">
      <PageHeader
        currentpage={`Agreement ${agreement.agreement_no || ""}`}
        activepage="Agreement Placements read"
        mainpage="Agreement Placements List"
      />
      <div className="max-w-6xl mx-auto">
        <AgreementPlacementReadOnly agreement={agreement} />
      </div>
    </div>
  )
}

export default ReadAgreementDetail
