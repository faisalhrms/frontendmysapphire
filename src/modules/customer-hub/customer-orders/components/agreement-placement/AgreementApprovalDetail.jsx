import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Target, RefreshCw } from "lucide-react"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import EmptyState from "@components/EmptyState.jsx"
import { useGlobalApprovalDetail } from "@modules/approvals/global/hooks/useGlobalApprovalDetail.js"
import ApprovalRequesterDetail from "@modules/approvals/global/components/ApprovalRequesterDetail.jsx"
import {
  getAgreement,
  getAgreementMentionUsers
} from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import AgreementPlacementForm from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementForm.jsx"
import Discussion from "@components/Discussion.jsx"

const AgreementApprovalDetail = () => {
  const { id } = useParams()
  const { data, isLoading, refetch, isRefetching, isError, error } = useGlobalApprovalDetail(id)
  const [viewType, setViewType] = useState("grid")
  const [agreement, setAgreement] = useState(null)
  const [loadingAgreement, setLoadingAgreement] = useState(true)
  const [mentionUsers, setMentionUsers] = useState([])

  const agreementId = useMemo(() => data?.object_id || null, [data])

  const loadAgreement = useCallback(
    async (idToLoad) => {
      if (!idToLoad) return
      const [ag, users] = await Promise.all([
        getAgreement(idToLoad),
        getAgreementMentionUsers(idToLoad)
      ])
      setAgreement(ag)
      setMentionUsers(users || [])
    },
    []
  )

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!agreementId) {
        setAgreement(null)
        setMentionUsers([])
        setLoadingAgreement(false)
        return
      }
      setLoadingAgreement(true)
      try {
        const [ag, users] = await Promise.all([
          getAgreement(agreementId),
          getAgreementMentionUsers(agreementId)
        ])
        if (!active) return
        setAgreement(ag)
        setMentionUsers(users || [])
      } finally {
        if (active) setLoadingAgreement(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [agreementId])

  const handleRefetch = useCallback(
    async () => {
      if (!agreementId) return
      setLoadingAgreement(true)
      try {
        await loadAgreement(agreementId)
        await refetch()
      } finally {
        setLoadingAgreement(false)
      }
    },
    [agreementId, loadAgreement, refetch]
  )

  const approvalType = data?.approval_type?.label || "Approval"
  const approvalDesc = data?.approval_type?.description || ""

  if (isLoading) return <LoadingSpinner />
  if (isError) return <EmptyState heading="Error" description={error?.message} />

  return (
    <>
      <IconPageHeader
        heading={approvalType}
        description={approvalDesc}
        icon={Target}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefetch}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            disabled={isRefetching || loadingAgreement}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching || loadingAgreement ? "animate-spin" : ""}`} />
          </button>
        </div>
      </IconPageHeader>

      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <ApprovalRequesterDetail data={data} refetch={refetch} />

          <div className="col-span-12 lg:col-span-8">
            {loadingAgreement ? (
              <LoadingSpinner />
            ) : agreement ? (
              <AgreementPlacementForm
                active
                seed={agreement}
                showHeader
                hideSubmit
                status={agreement?.status}
                refetch={handleRefetch}
              />
            ) : (
              <EmptyState heading="Agreement not found" description="" />
            )}
          </div>

          <div className="col-span-12">
            <Discussion
              title="Agreement Discussions"
              storeEndPoint={`/customer-hub/agreements/${agreementId}/discussion/`}
              getEndPoint={`/customer-hub/agreements/${agreementId}/discussions/`}
              users={mentionUsers}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AgreementApprovalDetail
