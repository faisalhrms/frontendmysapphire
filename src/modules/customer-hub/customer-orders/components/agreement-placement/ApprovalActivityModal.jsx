import React, { useMemo, useEffect } from "react"
import { X, CheckCircle2, Clock, Edit3, Send, Sparkles } from "lucide-react"
import dayjs from "dayjs"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import api from "@config/axiosConfig.js"

const PAGE_SIZE = 20

const fetchApprovalActivity = async ({ pageParam = 0, queryKey }) => {
  const [, agreementId, showCancelled] = queryKey
  if (!agreementId) return null

  const params = {
    skip: String(pageParam),
    limit: String(PAGE_SIZE),
  }
  if (showCancelled) {
    params.cancelled = "true"
  }

  const res = await api.get(
    `/customer-hub/agreements/${agreementId}/approval-activity/`,
    { params }
  )
  return res.data?.data || res.data
}

const ApprovalActivityModal = ({
  open,
  onClose,
  status: statusProp,
  currentApproverName: approverNameProp,
  agreementId,
  showCancelled = false,
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["agreementApprovalActivity", agreementId, showCancelled],
    queryFn: fetchApprovalActivity,
    enabled: open && !!agreementId,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined
      const currentPage = lastPage.current_page || lastPage.page || 1
      const totalPages = lastPage.total_pages || lastPage.pages || 1
      if (currentPage >= totalPages) return undefined
      return currentPage * PAGE_SIZE
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const derivedStatus = data?.pages?.[0]?.status ?? statusProp
  const derivedApproverName =
    data?.pages?.[0]?.current_approver_name ?? approverNameProp

  const items = useMemo(() => {
    if (!data) return []
    const out = []

    data.pages.forEach((page, idx) => {
      if (!page) return

      if (idx === 0 && Array.isArray(page.actions)) {
        page.actions.forEach((a) => {
          out.push({
            id: `approval-${a.id}`,
            kind: "approval",
            action_type: a.action,
            label: a.action,
            message: a.remarks || "",
            actor: a.approver_name || a.approver || "",
            at: a.created_at,
            meta: a.level ? `Level ${a.level}` : "",
          })
        })
      }

      const rows = page.rows || page.data || []
      rows.forEach((l) => {
        out.push({
          id: `activity-${l.id}`,
          kind: "activity",
          action_type: l.action_type,
          label: l.action_type,
          message: l.message || "",
          actor: l.created_by_name || "",
          at: l.created_at,
          changes: l.changes || null,
        })
      })
    })

    out.sort((a, b) => new Date(b.at) - new Date(a.at))
    return out
  }, [data])

  const renderIcon = (item) => {
    if (item.kind === "approval") {
      if (item.action_type === "approved") {
        return <CheckCircle2 size={16} className="text-emerald-500" />
      }
      if (item.action_type === "rejected") {
        return <X size={16} className="text-rose-500" />
      }
      if (item.action_type === "submitted") {
        return <Send size={16} className="text-sky-500" />
      }
      return <Sparkles size={16} className="text-primary" />
    }
    if (item.kind === "activity") {
      if (item.action_type === "status_changed") {
        return <Clock size={16} className="text-amber-500" />
      }
      if (item.action_type === "created") {
        return <Sparkles size={16} className="text-emerald-500" />
      }
      return <Edit3 size={16} className="text-primary" />
    }
    return <Clock size={16} />
  }

  const renderLabel = (item) => {
    if (item.kind === "activity") {
      if (item.action_type === "created") return "Agreement created"
      if (item.action_type === "updated") return "Agreement updated"
      if (item.action_type === "status_changed") return "Status changed"
      if (item.action_type === "submitted") return "Submitted for approval"
      if (item.action_type === "yarn_revision_submitted") {
        return "Yarn rate revision submitted"
      }
      if (item.action_type === "fabric_revision_submitted") {
        return "Fabric delivery revision submitted"
      }
    }
    return (item.label || "").replace(/_/g, " ")
  }

  const formatTime = (val) => {
    if (!val) return ""
    return dayjs(val).format("DD MMM, YYYY h:mm A")
  }

  const formatKindChip = (kind) => {
    if (kind === "approval") return "Approval"
    if (kind === "activity") return "Form activity"
    return ""
  }

  const formatFieldLabel = (field) => {
    let scope = ""
    let label = field
    if (label.startsWith("payload.")) {
      scope = "Payload"
      label = label.replace("payload.", "")
    }
    label = label.replace(/_/g, " ")
    if (label.length) {
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }
    return { scope, label }
  }

  const formatValue = (v) => {
    if (v === null || v === undefined || v === "") return "–"
    return String(v)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.08rem]">
      <div className="bg-white dark:bg-bodybg rounded-xl shadow-2xl w-full max-w-3xl max-h-[82vh] flex flex-col border border-slate-200/60 dark:border-white/10 overflow-hidden">
        <div className="px-5 py-3.5 border-b dark:border-defaultborder/20 bg-gradient-to-r from-slate-50 via-sky-50 to-emerald-50 dark:from-white/5 dark:via-white/5 dark:to-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[0.9rem] font-semibold flex items-center gap-2">
                <span>Agreement timeline</span>
                <span className="inline-flex items-center rounded-full px-2 py-[2px] text-[0.65rem] font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  {derivedStatus || "-"}
                </span>
              </div>
              <div className="text-[0.72rem] text-[#6b7280] dark:text-white/60 mt-1">
                {derivedApproverName ? (
                  <>
                    Pending at{" "}
                    <span className="font-medium">{derivedApproverName}</span>
                  </>
                ) : (
                  "No active approver"
                )}
              </div>
            </div>
            <button
              type="button"
              className="hs-dropdown-toggle ti-modal-close-btn"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3.5 h-3.5"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading && (
            <div className="h-full grid place-items-center">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10">
                  <Clock size={18} className="text-slate-500 dark:text-white/70" />
                </div>
                <div className="text-sm font-medium">Loading activity…</div>
                <div className="text-xs text-[#6b7280] dark:text-white/60">
                  Fetching approval history and form changes.
                </div>
              </div>
            </div>
          )}

          {!isLoading && isError && (
            <div className="h-full grid place-items-center">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20">
                  <X size={18} className="text-rose-500" />
                </div>
                <div className="text-sm font-medium">Failed to load activity</div>
                <div className="text-xs text-[#6b7280] dark:text-white/60 max-w-xs mx-auto">
                  {error?.message || "An error occurred while loading the approval activity."}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <div className="h-full grid place-items-center">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10">
                  <Clock size={18} className="text-slate-500 dark:text-white/70" />
                </div>
                <div className="text-sm font-medium">No activity recorded yet</div>
                <div className="text-xs text-[#6b7280] dark:text-white/60">
                  Changes and approval actions will appear here as a timeline.
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <>
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li key={item.id} className="relative pl-11">
                    {idx !== items.length - 1 && (
                      <div className="absolute left-4 top-5 bottom-[-10px] w-px bg-slate-200 dark:bg-white/10" />
                    )}
                    <div className="absolute left-1.5 top-3 w-7 h-7 rounded-full bg-white dark:bg-bodybg border border-slate-200 dark:border-white/15 grid place-items-center shadow-sm">
                      {renderIcon(item)}
                    </div>
                    <div className="rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] px-4 py-3.5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">
                              {renderLabel(item)}
                            </div>
                            <span className="inline-flex items-center rounded-full px-2 py-[2px] text-[0.65rem] font-medium bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900">
                              {formatKindChip(item.kind)}
                            </span>
                          </div>
                          {(item.actor || item.meta) && (
                            <div className="mt-1 text-[0.72rem] text-[#6b7280] dark:text-white/60">
                              {item.actor && <span>{item.actor}</span>}
                              {item.actor && item.meta && <span> • </span>}
                              {item.meta && <span>{item.meta}</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-[0.7rem] text-[#9ca3af] dark:text-white/50 mt-0.5 whitespace-nowrap">
                          {formatTime(item.at)}
                        </div>
                      </div>
                      {item.message && (
                        <div className="mt-2 text-[0.8rem] text-[#374151] dark:text-white/80">
                          {item.message}
                        </div>
                      )}
                      {item.kind === "activity" &&
                        item.changes &&
                        Object.keys(item.changes).length > 0 && (
                          <div className="mt-3 rounded-xl border border-dashed border-slate-200 dark:border-white/20 bg-white dark:bg-black/25 px-3 py-2.5">
                            <div className="text-[0.7rem] font-semibold tracking-wide uppercase text-[#6b7280] dark:text-white/60 mb-1.5">
                              Changed fields
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-white/10">
                              {Object.entries(item.changes).map(([field, diff]) => {
                                const { scope, label } = formatFieldLabel(field)
                                return (
                                  <div
                                    key={field}
                                    className="py-1.5 grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.3fr)_16px_minmax(0,1.3fr)] gap-x-3 items-start text-[0.7rem]"
                                  >
                                    <div className="flex items-center gap-1 pr-2">
                                      {scope && (
                                        <span className="inline-flex items-center rounded-full px-1.5 py-[1px] text-[0.6rem] font-medium bg-slate-100 dark:bg-white/15 text-[#4b5563] dark:text-white/70">
                                          {scope}
                                        </span>
                                      )}
                                      <span className="uppercase tracking-wide text-[0.65rem] text-[#9ca3af] dark:text-white/60">
                                        {label}
                                      </span>
                                    </div>
                                    <div className="line-through text-[#9ca3af] dark:text-white/55 break-all">
                                      {formatValue(diff.old)}
                                    </div>
                                    <div className="text-[#9ca3af] dark:text-white/60 text-center">
                                      →
                                    </div>
                                    <div className="font-medium text-[#111827] dark:text-white break-all">
                                      {formatValue(diff.new)}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>

              {hasNextPage && (
                <div
                  ref={sentinelRef}
                  className="py-3 text-center text-[0.7rem] text-slate-400 dark:text-white/50"
                >
                  {isFetchingNextPage
                    ? "Loading more activity..."
                    : "Scroll to load more activity"}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApprovalActivityModal
