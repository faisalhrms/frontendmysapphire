import React, { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Target, RefreshCw, Activity, BarChart3 } from "lucide-react"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import EmptyState from "@components/EmptyState.jsx"
import { useGlobalApprovalDetail } from "@modules/approvals/global/hooks/useGlobalApprovalDetail.js"
import ApprovalRequesterDetail from "@modules/approvals/global/components/ApprovalRequesterDetail.jsx"
import ApprovalActionTimelineGrid from "@modules/approvals/global/components/ApprovalActionTimelineGrid.jsx"
import ApprovalActionTimeLineTable from "@modules/approvals/global/components/ApprovalActionTimeLineTable.jsx"
import { getAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import AgreementPlacementForm from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementForm.jsx"

const AgreementApprovalDetail = () => {
  const { id } = useParams()
  const { data, isLoading, refetch, isRefetching, isError, error } = useGlobalApprovalDetail(id)
  const [viewType, setViewType] = useState("grid")
  const [agreement, setAgreement] = useState(null)
  const [loadingAgreement, setLoadingAgreement] = useState(true)
  const formRef = useRef(null)

  const agreementId = useMemo(() => data?.object_id || null, [data])

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!agreementId) return
      setLoadingAgreement(true)
      try {
        const ag = await getAgreement(agreementId)
        if (active) setAgreement(ag)
      } finally {
        if (active) setLoadingAgreement(false)
      }
    }
    run()
    return () => { active = false }
  }, [agreementId])

  const actions = data?.actions || []
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
        children={
          <div className="flex items-center space-x-2">
            <button onClick={() => refetch()} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 group" disabled={isRefetching}>
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <ApprovalRequesterDetail data={data} refetch={refetch} />
          <div className="col-span-12 lg:col-span-8">
            {loadingAgreement ? (
              <LoadingSpinner />
            ) : agreement ? (
              <AgreementPlacementForm ref={formRef} active seed={agreement} showHeader hideSubmit />
            ) : (
              <EmptyState heading="Agreement not found" description="" />
            )}
          </div>
          <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-gray-700/50">
                <div className="text-sm font-semibold">Action History</div>
                <div className="flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
                  <button className={`w-8 h-8 rounded-md ${viewType === "grid" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-gray-400"}`} onClick={() => setViewType("grid")}>
                    <BarChart3 className="w-4 h-4 mx-auto" />
                  </button>
                  <button className={`w-8 h-8 rounded-md ${viewType === "list" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-gray-400"}`} onClick={() => setViewType("list")}>
                    <Activity className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {viewType === "grid" ? <ApprovalActionTimelineGrid actions={actions} /> : <ApprovalActionTimeLineTable actions={actions} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AgreementApprovalDetail
