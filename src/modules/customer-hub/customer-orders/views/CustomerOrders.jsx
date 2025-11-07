import React, { Fragment, useMemo, useState, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import dayjs from "dayjs"
import mail from "@assets/images/icon/viewicon.svg"
import Avatar from "@components/Avatar.jsx"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { Inbox, Plus, Edit3, FileSignature, Calculator, ClipboardList, ChevronDown } from "lucide-react"
import NavTabs from "@modules/customer-hub/customer-orders/components/NavTabs.jsx"
import AirjetCostingBaseSection from "@modules/customer-hub/customer-orders/components/airjet-costing/AirjetCostingBaseSection.jsx"
import AgreementPlacementModal from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementModal.jsx"
import CompactHeader from "@modules/customer-hub/customer-orders/components/CompactHeader.jsx"
import AgreementEmailPanel from "@modules/customer-hub/customer-orders/components/tabs/AgreementEmailPanel.jsx"
import EmailExtractionPanel from "@modules/customer-hub/customer-orders/components/tabs/EmailExtractionPanel.jsx"
import { useAgreementPlacementModal } from "@modules/customer-hub/customer-orders/hooks/agreement-placement/useAgreementPlacementModal.js"
import { useSearchHook } from "@hooks/useSearchHook.js"
import { useAgreementsFeed } from "@modules/customer-hub/customer-orders/hooks/useAgreementsFeed.js"
import { useMailboxes } from "@modules/customer-hub/customer-orders/hooks/useMailboxes.js"
import AgreementPlacementForm from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementForm.jsx"
import { getAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import { useQueryClient } from "@tanstack/react-query"
import PrGenerationSection
    from "@modules/customer-hub/customer-orders/components/pr-generation/PrGenerationSection.jsx";

const srcLabel = (s) => (s === "api" ? "API" : s ? s.charAt(0).toUpperCase() + s.slice(1) : "")
const statusLabel = (s) => (s ? String(s).split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "")
const statusClass = (s) => {
  if (s === "approved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
  if (s === "submitted" || s === "under_approval") return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
  if (s === "rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
  return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
}
const sourceClass = (s) => {
  const v = String(s || "").toLowerCase()
  if (v === "manual") return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
  if (v === "email") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
  if (v === "api") return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300"
  return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
}
const Pill = ({ children, cls = "" }) => <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[.65rem] font-medium ${cls}`}>{children}</span>

const CustomerOrders = () => {
  const user = useSelector((s) => s.auth.user)
  const queryClient = useQueryClient()
  const LIST_LIMIT = 30
  const { searchTerm, handleSearchChange } = useSearchHook(1)
  const { mailboxes, initialMailbox } = useMailboxes()
  const [mailbox, setMailbox] = useState(initialMailbox || "beirholm.hub@sapphiretextiles.com.pk")
  const [pickerOpen, setPickerOpen] = useState(false)
  const { rows, sentinelRef, hasNextPage, isFetchingNextPage, isLoading } = useAgreementsFeed({ s: searchTerm, mailbox, limit: LIST_LIMIT })
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState("tab-agreement")
  const hasEmail = !!selected?.email?.id

  const tabs = useMemo(() => {
    const base = [
      { id: "tab-agreement", label: "Agreement Placement", icon: <FileSignature />, color: "amber" },
      { id: "tab-costing", label: "Airjet Costing", icon: <Calculator />, color: "emerald" },
      { id: "tab-pr", label: "PR Generation", icon: <ClipboardList />, color: "rose" }
    ]
    return hasEmail ? [{ id: "tab-email", label: "Original Email" }, { id: "tab-extracted", label: "Extracted Info" }, ...base] : base
  }, [hasEmail])

  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab) && tabs.length) setActiveTab(tabs[0].id)
  }, [tabs])

  const { openModal, openForEdit, closeModal, control, errors, isSubmitting, handleSubmit, onSubmit, isEdit } =
    useAgreementPlacementModal((created) => {
      setSelected(created)
      setActiveTab("tab-agreement")
      queryClient.setQueryData(["agreementsFeed", searchTerm, mailbox, LIST_LIMIT], (old) => {
        if (!old) return old
        const pages = Array.isArray(old.pages) ? [...old.pages] : []
        if (pages.length) {
          const first = { ...(pages[0] || {}) }
          const exists = (first.rows || []).some(r => r.id === created?.id)
          first.rows = exists ? first.rows.map(r => (r.id === created.id ? created : r)) : [created, ...(first.rows || [])]
          pages[0] = first
          return { ...old, pages }
        }
        if (old.rows) {
          const exists = (old.rows || []).some(r => r.id === created?.id)
          return { ...old, rows: exists ? old.rows.map(r => (r.id === created.id ? created : r)) : [created, ...(old.rows || [])] }
        }
        return old
      })
      queryClient.invalidateQueries({ queryKey: ["agreementsFeed"] })
    })

  const loadAgreement = useCallback(async (id, optimistic) => {
    if (optimistic) setSelected(optimistic)
    const full = await getAgreement(id)
    setSelected(full)
  }, [])

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="main-mail-container !p-2 gap-x-2 flex h-[calc(100vh-2rem)] min-h-0 overflow-hidden">
          <div className="total-mails border dark:border-defaultborder/10 flex lg:flex flex-col w-full lg:w-[320px] lg:min-w-[300px] min-h-0">
            <div className="!p-2 flex items-center justify-between border-b dark:border-defaultborder/10 !bg-blue relative">
              <div className="flex items-center gap-2">
                <Inbox size={18} className="text-white ml-2" />
                <h6 className="font-semibold mb-0 text-[1rem] text-white">All Orders</h6>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button className="flex items-center gap-2 text-white px-2 py-1 rounded-full hover:bg-white/10" onClick={() => setPickerOpen((o) => !o)}>
                    <Avatar full_name={mailbox} size="sm" parentClasses="me-1" />
                    <ChevronDown size={16} />
                  </button>
                  {pickerOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-bodybg border dark:border-defaultborder/20 rounded shadow z-50">
                      <div className="p-2 text-xs opacity-70">Switch mailbox</div>
                      <ul className="max-h-80 overflow-y-auto">
                        {[...new Set([mailbox, ...(mailboxes || [])])].filter(Boolean).map((m) => (
                          <li key={m}>
                            <button
                              className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-light/60 dark:hover:bg-white/10 ${m === mailbox ? "bg-light/50 dark:bg-white/5" : ""}`}
                              onClick={() => {
                                setMailbox(m)
                                setPickerOpen(false)
                                setSelected(null)
                              }}
                            >
                              <Avatar full_name={m} size="sm" parentClasses="me-1" />
                              <span className="truncate">{m}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="input-group flex-1">
                  <input onChange={handleSearchChange} type="text" className="form-control !bg-light !border-0 !rounded-s-md" placeholder="Search Order" defaultValue=""/>
                  <button aria-label="button" className="ti-btn ti-btn-light !rounded-s-none !mb-0" type="button">
                    <i className="ri-search-line text-[#8c9097] dark:text-white/50"/>
                  </button>
                </div>
                <button type="button" onClick={openModal} className="ti-btn ti-btn-outline-primary !py-2 !px-2 !text-[0.78rem] inline-flex items-center gap-2">
                  <Plus size={14}/>
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 dark:bg-black/20">
                  <LoadingSpinner />
                </div>
              )}
              <ul className="list-none mb-0 text-defaulttextcolor text-defaultsize">
                {rows.map((r) => {
                  const isSelected = selected?.id === r.id
                  const when = r.start_date || r.created_at
                  return (
                    <li key={`agr:${r.id}`} className="border-b dark:border-defaultborder/20">
                      <button
                        className={`w-full text-left p-2 flex items-start ${isSelected ? "bg-light dark:bg-black/30" : "hover:bg-light/40 dark:hover:bg-white/5"}`}
                        onClick={() => { loadAgreement(r.id, r) }}
                      >
                        <span className="shrink-0 mt-3 ms-2 w-5 h-5" />
                        <Avatar full_name={r.owner || r.source || "Agreement"} size="sm" parentClasses="profile-timeline-avatar me-2" />
                        <div className="flex-grow min-w-0">
                          <div className="mb-1 text-[0.75rem] space-x-2">
                            <span className="font-medium truncate">{r.owner || "-"}</span>
                            <span className="ltr:float-right rtl:float-left text-[#8c9097] dark:text-white/50 font-normal text-[.6875rem]">{dayjs(when).format("h:mm A")}</span>
                          </div>
                          <span className="block font-medium">Agreement #{r.agreement_no}</span>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50">{r.quality} • {r.design} • {(r.colour || "-")} • {r.width}</span>
                            <div className="flex items-center gap-1">
                              <Pill cls={statusClass(r.status)}>{srcLabel(r.source)}</Pill>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div ref={sentinelRef} className="py-3 text-center text-xs text-[#8c9097]">
                {isFetchingNextPage ? <div className="flex justify-center"><LoadingSpinner /></div> : hasNextPage ? "Scroll to load more" : "No more list"}
              </div>
            </div>
          </div>
          <div className="dark:bg-bodybg h-[calc(100vh-6rem)] overflow-hidden rounded-md bg-white border dark:border-defaultborder/10 text-defaulttextcolor text-defaultsize flex-1 flex flex-col min-h-0">
            {selected ? (
              <>
                <div className="shrink-0 p-3">
                  <CompactHeader msg={selected} />
                </div>
                <div className="px-6">
                  <div className="flex items-center justify-between">
                    <NavTabs tabs={tabs} activeId={activeTab} onTabChange={(id) => setActiveTab(id)} />
                    {activeTab === "tab-agreement" && selected && (
                      <button type="button" onClick={() => openForEdit(selected)} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] inline-flex items-center gap-2">
                        <Edit3 size={14} /> Edit
                      </button>
                    )}
                  </div>
                  <div className="mt-4">
                    {activeTab === "tab-email" && hasEmail && <AgreementEmailPanel agreement={selected} />}
                    {activeTab === "tab-extracted" && hasEmail && <EmailExtractionPanel email={selected.email} />}
                    {activeTab === "tab-agreement" && (
                      <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
                        <AgreementPlacementForm
                          key={`${selected?.id || "new"}:${selected?.updated_at || ""}`}
                          seed={selected}
                          email={selected?.email}
                          onAfterPersist={(entity) => { setSelected(entity) }}
                          approvalActivity={selected?.actions}
                          status={selected?.status}
                          currentApproverName={selected?.current_approver_name}
                          disabledSubmit={selected?.status === "under_approval" || selected?.status === "approved"}
                        />
                      </div>
                    )}
                    {activeTab === "tab-costing" && (
                      <div className="max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-1">
                        <AirjetCostingBaseSection seed={selected} />
                      </div>
                    )}
                    {activeTab === "tab-pr" && (
                      <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
                        <PrGenerationSection seed={selected} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 h-full min_h-[420px] flex flex-col items-center justify-center text-center">
                <img src={mail} alt="" className="w-24 h-24 mb-4" />
                <p className="text-[#8c9097] dark:text:white/50">Select item to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AgreementPlacementModal control={control} errors={errors} isSubmitting={isSubmitting} handleSubmit={handleSubmit} onSubmit={onSubmit} closeModal={closeModal} isEdit={isEdit} />
    </Fragment>
  )
}

export default CustomerOrders
