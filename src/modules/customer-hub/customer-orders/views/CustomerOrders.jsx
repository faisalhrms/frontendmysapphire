import React, { Fragment, useMemo, useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import dayjs from "dayjs"
import mail from "@assets/images/icon/viewicon.svg"
import Avatar from "@components/Avatar.jsx"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { Inbox, ChevronDown, Mail as MailIcon, FileSignature, Calculator, FileSpreadsheet, ClipboardList, Plus } from "lucide-react"
import InfoAlert from "../../../../InfoAlert.jsx"
import { useCustomerHubMail } from "@modules/customer-hub/customer-orders/hooks/useCustomerHubMail.js"
import { fileKind, resolveCidHtml, sanitizeHtml, truncateWords } from "@modules/customer-hub/customer-orders/services/MailAppUtils.js"
import { AttachmentIcon } from "@modules/customer-hub/customer-orders/components/AttachmentIcon.jsx"
import AgreementPlacementForm from "@modules/customer-hub/customer-orders/components/AgreementPlacementForm.jsx"
import CompactHeader from "@modules/customer-hub/customer-orders/components/CompactHeader.jsx"
import ExtractionGrid from "@modules/customer-hub/customer-orders/components/ExtractionGrid.jsx"
import NavTabs from "@modules/customer-hub/customer-orders/components/NavTabs.jsx"
import AirjetCostingBaseSection from "@modules/customer-hub/customer-orders/components/AirjetCostingBaseSection.jsx"
import AgreementPlacementModal from "@modules/customer-hub/customer-orders/components/AgreementPlacementModal.jsx"
import { datatableAgreements } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import { useAgreementPlacementModal } from "@modules/customer-hub/customer-orders/hooks/useAgreementPlacementModal.js"
import {useSearchHook} from "@hooks/useSearchHook.js";

const ExtractedInfoPanel = ({ active, selectedMessage, latestExtraction, loadExtractions, loading }) => {
  useEffect(() => {
    if (!active) return
    if (!latestExtraction && selectedMessage?.id) loadExtractions(selectedMessage.id)
  }, [active, selectedMessage?.id, latestExtraction, loadExtractions])
  if (!active) return null
  if (loading) return <div className="py-6"><LoadingSpinner /></div>
  if (!latestExtraction) return <div className="text-sm text-[#8c9097]">No extracted fields</div>
  return <ExtractionGrid data={latestExtraction} />
}

const srcLabel = (s) => (s === "api" ? "API" : s ? s.charAt(0).toUpperCase() + s.slice(1) : "")
const statusClass = (s) => {
  if (s === "approved") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
  if (s === "submitted") return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
  if (s === "rejected") return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
  return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
}

const Pill = ({ children, cls = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[.65rem] font-medium ${cls}`}>{children}</span>
)

const CustomerOrders = ({ mailbox: initialMailbox = "beirholm.hub@sapphiretextiles.com.pk" }) => {
  const user = useSelector((s) => s.auth.user)
  const [mailbox, setMailbox] = useState(initialMailbox)
  const [pickerOpen, setPickerOpen] = useState(false)
  const { searchTerm, handleSearchChange } = useSearchHook(1)
  const { mailboxes, threads, selectedKey, selectThread, selectMessageInThread, selectedMessage, expanded, toggleThreadExpand, messagesByThread, formatThreadTime, formatFileSize, extractions, loadExtractions, extractionsLoading, clearExtractions, sentinelRef, hasNextPage, isFetchingNextPage } = useCustomerHubMail(mailbox)
  const [activeTab, setActiveTab] = useState("tab-email")
  const resolvedHtml = useMemo(() => resolveCidHtml(selectedMessage?.raw_html || "", selectedMessage?.attachments || []), [selectedMessage])
  const latestExtraction = useMemo(() => (extractions?.length ? (extractions[0]?.data || null) : null), [extractions])
  const [manualRows, setManualRows] = useState([])
  const [manualLoading, setManualLoading] = useState(false)
  const [selectedManual, setSelectedManual] = useState(null)

  const loadManual = useCallback(async (s = "") => {
    setManualLoading(true)
    try {
      const resp = await datatableAgreements({ skip: 0, limit: 50, s })
      const rows = Array.isArray(resp?.rows) ? resp.rows : []
      setManualRows(rows.filter((r) => r.source === "manual"))
    } finally {
      setManualLoading(false)
    }
  }, [])

  useEffect(() => { loadManual("") }, [loadManual])

  useEffect(() => { loadManual(searchTerm) }, [searchTerm, loadManual])

  const { openModal, closeModal, control, errors, isSubmitting, handleSubmit, onSubmit } = useAgreementPlacementModal((created) => {
    loadManual(searchTerm)
    setSelectedManual(created)
    setActiveTab("tab-agreement")
  })

  useEffect(() => {
    clearExtractions()
    if (selectedMessage?.id) loadExtractions(selectedMessage.id)
  }, [selectedMessage?.id, clearExtractions, loadExtractions])

  useEffect(() => {
    if ((activeTab === "tab-agreement" || activeTab === "tab-costing") && selectedMessage?.id && !latestExtraction && !extractionsLoading) loadExtractions(selectedMessage.id)
  }, [activeTab, selectedMessage?.id, latestExtraction, loadExtractions, extractionsLoading])

  const allRows = useMemo(() => {
    const emails = (threads || []).map((t) => ({ kind: "email", ts: dayjs(t.last_received_at).valueOf(), key: `email:${t.thread_key}`, thread: t }))
    const manuals = (manualRows || []).map((r) => {
      const dt = r.start_date || r?.payload?.order_date || r.created_at
      return { kind: "manual", ts: dayjs(dt).valueOf(), key: `manual:${r.id}`, row: r }
    })
    return [...emails, ...manuals].sort((a, b) => b.ts - a.ts)
  }, [threads, manualRows])

  const qn = (s) => (s || "").toString().toLowerCase()
  const filteredRows = useMemo(() => {
    const needle = qn(searchTerm)
    if (!needle) return allRows
    return allRows.filter((it) => {
      if (it.kind === "manual") {
        const r = it.row
        const hay = [r.agreement_no, r.owner, r.quality, r.design, r.colour, r.color, r.width, r.status, r.source].map(qn).join(" ")
        return hay.includes(needle)
      } else {
        const t = it.thread
        const hay = [t.last_from_name, t.last_from, t.subject].map(qn).join(" ")
        return hay.includes(needle)
      }
    })
  }, [allRows, searchTerm])

  const tabs = useMemo(() => {
    if (selectedManual) return [
      { id: "tab-agreement", label: "Agreement Placement", icon: <FileSignature />, color: "amber" },
      { id: "tab-costing", label: "Airjet Costing", icon: <Calculator />, color: "emerald" },
      { id: "tab-pr", label: "PR Generation", icon: <ClipboardList />, color: "rose" },
    ]
    return [
      { id: "tab-email", label: "Original Email", icon: <MailIcon />, color: "sky" },
      { id: "tab-extracted", label: "Extracted Info", icon: <FileSpreadsheet />, color: "violet" },
      { id: "tab-agreement", label: "Agreement Placement", icon: <FileSignature />, color: "amber" },
      { id: "tab-costing", label: "Airjet Costing", icon: <Calculator />, color: "emerald" },
      { id: "tab-pr", label: "PR Generation", icon: <ClipboardList />, color: "rose" },
    ]
  }, [selectedManual])

  const renderActiveContent = () => {
    if (selectedManual) {
      if (activeTab === "tab-agreement") {
        return (
          <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
            <AgreementPlacementForm
              active
              seed={selectedManual}
              email={null}
              showHeader={false}
            />
          </div>
        )
      }
      if (activeTab === "tab-costing") {
        return (
          <div className="max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-1">
            <AirjetCostingBaseSection seed={{
              email_id: selectedMessage?.id,
              agreement_id: selectedManual?.id,
              quality_code: selectedManual.quality,
              design: selectedManual.design,
              width: selectedManual.width,
              color: selectedManual.colour,
              greige_item_code: selectedManual.greige_item || selectedManual.greige_item_code || selectedManual.item_no || selectedManual.item_code
            }}
            />
          </div>
        )
      }
      if (activeTab === "tab-pr") {
        return (
          <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
            <InfoAlert />
          </div>
        )
      }
      return null
    }
    if (!selectedMessage) return null
    if (activeTab === "tab-email") {
      return (
        <div className="flex flex-col min-h-0 max-h-[65vh] sm:max-h-[70vh]">
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="prose max-w-none dark:prose-invert">
              <div className="text-[.875rem] break-words whitespace-pre-wrap [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:table-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolvedHtml || "") }} />
            </div>
          </div>
          {(selectedMessage?.attachments?.length ?? 0) > 0 && (
            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[.875rem] font-semibold dark:!text-defaulttextcolor/70">
                  <i className="ri-attachment-2 me-1 align-middle" /> Attachments ({selectedMessage.attachments.length})
                </span>
              </div>
              <div className="mt-2 flex items-center flex-wrap">
                {selectedMessage.attachments.map((a) => (
                  <a key={a.id} href={a.url || "#"} target="_blank" rel="noreferrer" className="mail-attachment mb-1 me-2">
                    <div className="w-8 h-8 text-[2rem] me-2">
                      <AttachmentIcon kind={fileKind(a)} />
                    </div>
                    <div className="leading-none">
                      <p className="mb-1 attachment-name truncate dark:border-defaultborder/10">{a.name}</p>
                      <p className="mb-0 text-[.6875rem] text-[#8c9097] dark:text:white/50">{formatFileSize(a.size_bytes)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }
    if (activeTab === "tab-extracted") {
      return (
        <ExtractedInfoPanel
          active
          selectedMessage={selectedMessage}
          latestExtraction={latestExtraction}
          loadExtractions={loadExtractions}
          loading={extractionsLoading}
        />
      )
    }
    if (activeTab === "tab-agreement") {
      return (
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
          <AgreementPlacementForm
            active
            seed={latestExtraction || {}}
            email={{
              id: selectedMessage?.id,
              subject: selectedMessage?.subject,
              from_name: selectedMessage?.from_name,
              from_address: selectedMessage?.from_address,
              received_at: selectedMessage?.received_at,
            }}
            showHeader={false}
          />
        </div>
      )
    }
    if (activeTab === "tab-costing") {
      return (
        <div className="max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-1">
          <AirjetCostingBaseSection seed={{
            email_id: selectedMessage?.id,
            quality_code: latestExtraction?.quality,
            design: latestExtraction?.design,
            width: latestExtraction?.width,
            color:  latestExtraction?.color
          }} />
        </div>
      )
    }
    if (activeTab === "tab-pr") {
      return (
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
          <InfoAlert />
        </div>
      )
    }
    return null
  }

  const threadsInitialLoading = threads === undefined || threads === null
  const sidebarLoading = manualLoading || threadsInitialLoading

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
                              setSelectedManual(null)
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

            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="input-group flex-1">
                  <input onChange={handleSearchChange} type="text" className="form-control !bg-light !border-0 !rounded-s-md" placeholder="Search Order" defaultValue="" />
                  <button aria-label="button" className="ti-btn ti-btn-light !rounded-s-none !mb-0" type="button">
                    <i className="ri-search-line text-[#8c9097] dark:text-white/50" />
                  </button>
                </div>
                <button type="button" onClick={openModal} className="ti-btn ti-btn-outline-primary !py-2 !px-2 !text-[0.78rem] inline-flex items-center gap-2">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto relative">
              {sidebarLoading && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 dark:bg-black/20">
                  <LoadingSpinner />
                </div>
              )}
              <ul className="list-none mb-0 text-defaulttextcolor text-defaultsize">
                {filteredRows.map((item) => {
                  if (item.kind === "email") {
                    const t = item.thread
                    const unread = (t.unread_count || 0) > 0
                    const isOpen = !!expanded[t.thread_key]
                    const hasMultiple = (t.total_count || 0) > 1
                    const isSelected = selectedKey === t.thread_key && !selectedManual
                    const threadMsgs = messagesByThread[t.thread_key] || []
                    return (
                      <li key={item.key} className="border-b dark:border-defaultborder/20">
                        <div className={`flex items-start ${isSelected ? "bg-light dark:bg-black/30" : "hover:bg-light/40 dark:hover:bg-white/5"}`}>
                          {hasMultiple ? (
                            <button
                              className={`shrink-0 mt-3 ms-2 w-5 h-5 grid place-items-center rounded-full transition-all ${isOpen ? "bg-primary/10 text-primary" : "bg-transparent text-[#8c9097] hover:bg-light/70 dark:hover:bg-white/10"}`}
                              onClick={() => {
                                setSelectedManual(null)
                                toggleThreadExpand(t.thread_key)
                              }}
                              aria-label="toggle"
                            >
                              <i className={`ri-arrow-right-s-line text-base transition-transform ${isOpen ? "rotate-90" : ""}`} />
                            </button>
                          ) : (
                            <span className="shrink-0 mt-3 ms-2 w-5 h-5" />
                          )}
                          <button className="w-full text-left p-2" onClick={() => { setSelectedManual(null); selectThread(t.thread_key); setActiveTab("tab-email") }}>
                            <div className="flex items-start">
                              <Avatar full_name={t.last_from_name || t.last_from} size="sm" parentClasses="profile-timeline-avatar me-2" />
                              <div className="flex-grow min-w-0">
                                <div className="mb-1 text-[0.75rem] space-x-2">
                                  <span className="font-medium truncate">{t.last_from_name || t.last_from}</span>
                                  <span className="ltr:float-right rtl:float-left text-[#8c9097] dark:text:white/50 font-normal text-[.6875rem]">{formatThreadTime(t.last_received_at)}</span>
                                </div>
                                <span className={`block ${unread ? "font-semibold text-primary" : "font-normal"}`}>{truncateWords(t.subject, 4)}</span>
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-[.6875rem] text-[#8c9097] dark:text:white/50">Total {t.total_count} • Unread {t.unread_count}</span>
                                  <Pill cls={statusClass("")}>Email</Pill>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                        {isOpen && hasMultiple && (
                          <ul className="ms-12 me-2 mb-2 border-l-2 border-primary/70 dark:border-primary/70 pl-3">
                            {threadMsgs.map((m) => (
                              <li key={m.id}>
                                <button
                                  className={`w-full text-left rounded px-2 py-2 my-1 ${m.id === selectedMessage?.id ? "bg-light dark:bg-white/10" : "hover:bg-light/40 dark:hover:bg-white/5"}`}
                                  onClick={() => { setSelectedManual(null); selectMessageInThread(t.thread_key, m.id) }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`truncate ${m.is_read ? "font-normal" : "font-semibold text-primary"}`}>{truncateWords(m.subject || t.subject, 8)}</span>
                                    <span className="ms-2 shrink-0 text-[.65rem] text-[#8c9097]">{dayjs(m.received_at).format("ddd h:mm A")}</span>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  }
                  const r = item.row
                  const isSelected = selectedManual?.id === r.id
                  const when = r.start_date || r?.payload?.order_date || r.created_at
                  return (
                    <li key={item.key} className="border-b dark:border-defaultborder/20">
                      <button className={`w-full text-left p-2 flex items-start ${isSelected ? "bg-light dark:bg-black/30" : "hover:bg-light/40 dark:hover:bg-white/5"}`} onClick={() => { setSelectedManual(r); setActiveTab("tab-agreement") }}>
                        <span className="shrink-0 mt-3 ms-2 w-5 h-5" />
                        <Avatar full_name={r.owner || "Manual"} size="sm" parentClasses="profile-timeline-avatar me-2" />
                        <div className="flex-grow min-w-0">
                          <div className="mb-1 text-[0.75rem] space-x-2">
                            <span className="font-medium truncate">{r.owner || "Manual"}</span>
                            <span className="ltr:float-right rtl:float-left text-[#8c9097] dark:text-white/50 font-normal text-[.6875rem]">{dayjs(when).format("h:mm A")}</span>
                          </div>
                          <span className="block font-medium">Agreement #{r.agreement_no}</span>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50">{r.quality} • {r.design} • {(r.colour || r.color || "-")} • {r.width}</span>
                            <Pill cls={statusClass(r.status)}>{srcLabel(r.source)}</Pill>
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
            {selectedManual ? (
              <>
                <div className="shrink-0 p-3">
                  <CompactHeader msg={{ owner: selectedManual.owner, created_at: selectedManual.created_at, start_date: selectedManual.start_date, source: selectedManual.source, status: selectedManual.status }} />
                </div>
                <div className="px-6">
                  <NavTabs tabs={tabs} activeId={activeTab} onTabChange={(id) => setActiveTab(id)} />
                  <div className="mt-4">{renderActiveContent()}</div>
                </div>
              </>
            ) : selectedMessage ? (
              <>
                <div className="shrink-0 p-3">
                  <CompactHeader msg={selectedMessage} />
                </div>
                <div className="px-6">
                  <NavTabs tabs={tabs} activeId={activeTab} onTabChange={(id) => setActiveTab(id)} />
                  <div className="mt-4">{renderActiveContent()}</div>
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

      <AgreementPlacementModal
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        closeModal={closeModal}
      />
    </Fragment>
  )
}

export default CustomerOrders
