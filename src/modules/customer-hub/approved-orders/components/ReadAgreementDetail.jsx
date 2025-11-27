import React, { useEffect, useState } from "react"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import {
  getAgreement,
  getAgreementMentionUsers,
} from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import AgreementPlacementReadOnly from "@modules/customer-hub/approved-orders/components/AgreementPlacementReadOnly.jsx"
import Discussion from "@components/Discussion.jsx"

const ReadAgreementDetail = () => {
  const location = useLocation()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const idFromState = location.state?.id
  const idFromParams = params?.id
  const id = idFromState || idFromParams

  const showCancelled = searchParams.get("cancelled") === "true"

  const [agreement, setAgreement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mentionUsers, setMentionUsers] = useState([])

  useEffect(() => {
    if (!id) {
      setError("Missing agreement id")
      setLoading(false)
      return
    }

    let active = true

    const run = async () => {
      try {
        const data = await getAgreement(id, { showCancelled })
        if (!active) return
        setAgreement(data)

        const users = await getAgreementMentionUsers(id, { showCancelled })
        if (active) setMentionUsers(users || [])
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
  }, [id, showCancelled])

  if (!id) return <div className="p-4">Invalid agreement</div>
  if (loading) return <div className="p-4">Loading agreement...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!agreement) return <div className="p-4">Agreement not found</div>

  const qs = showCancelled ? "?cancelled=true" : ""

  return (
    <div className="px-4">
      <PageHeader
        currentpage={`Agreement ${agreement.agreement_no || ""}`}
        activepage="Agreement Placements read"
        mainpage="Agreement Placements List"
      />
      <div className="max-w-6xl mx-auto">
        <AgreementPlacementReadOnly agreement={agreement} showCancelled={showCancelled} />
        <Discussion
          title="Agreement Placement Discussions"
          storeEndPoint={`/customer-hub/agreements/${agreement?.id}/discussion/${qs}`}
          getEndPoint={`/customer-hub/agreements/${agreement?.id}/discussions/${qs}`}
          users={mentionUsers}
        />
      </div>
    </div>
  )
}

export default ReadAgreementDetail
