import React, { Fragment, useMemo, useState } from "react"
import dayjs from "dayjs"
import mail from "@assets/images/icon/mail.svg"
import { useCustomerHubMail } from "@modules/customer-hub/mail-app/hooks/useMailData.js"
import { fileKind, resolveCidHtml, sanitizeHtml, truncateWords } from "@modules/customer-hub/mail-app/services/MailAppUtils.js"
import { AttachmentIcon } from "@modules/customer-hub/mail-app/components/AttachmentIcon.jsx"
import Avatar from "@components/Avatar.jsx"
import { Inbox, ChevronDown, Mail as MailIcon, FileSignature,Calculator,FileSpreadsheet } from "lucide-react"
import ExtractionGrid from "@modules/customer-hub/mail-app/components/ExtractionGrid.jsx"
import AgreementPlacementForm from "@modules/customer-hub/mail-app/components/AgreementPlacementForm.jsx"
import CompactHeader from "@modules/customer-hub/mail-app/components/CompactHeader.jsx"
import IconTabs from "@components/IconTabs.jsx"
import InfoAlert from "../../../../../InfoAlert.jsx";

const MailApp = ({ mailbox: initialMailbox = "beirholm.hub@sapphiretextiles.com.pk" }) => {
  const [mailbox, setMailbox] = useState(initialMailbox)
  const [pickerOpen, setPickerOpen] = useState(false)
  const { mailboxes, threads, selectedKey, selectThread, selectMessageInThread, selectedMessage, expanded, toggleThreadExpand, messagesByThread, formatThreadTime, formatFileSize, extractions, sentinelRef, hasNextPage, isFetchingNextPage } = useCustomerHubMail(mailbox)

  const resolvedHtml = useMemo(() => resolveCidHtml(selectedMessage?.raw_html || "", selectedMessage?.attachments || []), [selectedMessage])
  const latestExtraction = useMemo(() => (extractions?.length ? extractions[0]?.data || null : null), [extractions])

  const tabs = [
    {
      id: "tab-email",
      label: "Original Email",
      icon: <MailIcon size={16} />,
      content: (
        <div className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <div className="text-[.875rem] [&_img]:max-w-full [&_img]:h-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolvedHtml || "") }} />
          </div>
          {(selectedMessage?.attachments?.length ?? 0) > 0 && (
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[.875rem] font-semibold dark:!text-defaulttextcolor/70">
                  <i className="ri-attachment-2 me-1 align-middle" /> Attachments ({selectedMessage.attachments.length})
                </span>
              </div>
              <div className="mt-2 flex items-center flex-wrap">
                {selectedMessage.attachments.map((a) => (
                  <a key={a.id} href={a.url || "#"} target="_blank" rel="noreferrer" className="mail-attachment mb-1 me-2">
                    <div className="attachment-icon">
                      <AttachmentIcon kind={fileKind(a)} />
                    </div>
                    <div className="leading-none">
                      <p className="mb-1 attachment-name truncate dark:border-defaultborder/10">{a.name}</p>
                      <p className="mb-0 text-[.6875rem] text-[#8c9097] dark:text-white/50">{formatFileSize(a.size_bytes)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "tab-extracted",
      label: "Extracted Info",
      icon: <FileSpreadsheet size={16} />,
      content: latestExtraction ? <ExtractionGrid data={latestExtraction} /> : <div className="text-sm text-[#8c9097]">No extracted fields</div>,
    },
    {
      id: "tab-agreement",
      label: "Agreement Placement",
      icon: <FileSignature size={16} />,
      content: (
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
          <AgreementPlacementForm
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
      ),
    },
    {
      id: "tab-costing",
      label: "Airjet Costing",
      icon: <Calculator size={16} />,
      content: (
        <div className="max-h-[60vh] sm:max-h-[65vh] overflow-y-auto pr-1">
            <InfoAlert/>
        </div>
      ),
    }
  ]

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="main-mail-container !p-2 gap-x-2 flex h-[calc(100vh-2rem)] min-h-0 overflow-hidden">
          <div className="total-mails border dark:border-defaultborder/10 flex lg:flex flex-col w-full lg:w-[350px] lg:min-w-[300px] min-h-0">
            <div className="!p-4 flex items-center justify-between border-b dark:border-defaultborder/10 !bg-blue relative">
              <div className="flex items-center gap-2">
                <Inbox size={18} className="text-white" />
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
              <div className="input-group">
                <input type="text" className="form-control !bg-light !border-0 !rounded-s-md" placeholder="Search Email" />
                <button aria-label="button" className="ti-btn ti-btn-light !rounded-s-none !mb-0" type="button">
                  <i className="ri-search-line text-[#8c9097] dark:text-white/50" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <ul className="list-none mb-0 text-defaulttextcolor text-defaultsize">
                {threads.map((t) => {
                  const unread = (t.unread_count || 0) > 0
                  const isOpen = !!expanded[t.thread_key]
                  const hasMultiple = (t.total_count || 0) > 1
                  const isSelected = selectedKey === t.thread_key
                  const threadMsgs = messagesByThread[t.thread_key] || []
                  return (
                    <li key={t.thread_key} className="border-b dark:border-defaultborder/20">
                      <div className={`flex items-start ${isSelected ? "bg-light dark:bg-black/30" : "hover:bg-light/40 dark:hover:bg-white/5"}`}>
                        {hasMultiple ? (
                          <button
                            className={`shrink-0 mt-3 ms-2 me-1 w-7 h-7 grid place-items-center rounded-full transition-all ${isOpen ? "bg-primary/10 text-primary" : "bg-transparent text-[#8c9097] hover:bg-light/70 dark:hover:bg-white/10"}`}
                            onClick={() => toggleThreadExpand(t.thread_key)}
                            aria-label="toggle"
                          >
                            <i className={`ri-arrow-right-s-line text-base transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          </button>
                        ) : (
                          <span className="shrink-0 mt-3 ms-2 me-2 w-7 h-7" />
                        )}
                        <button className="w-full text-left p-2" onClick={() => selectThread(t.thread_key)}>
                          <div className="flex items-start">
                            <Avatar full_name={t.last_from_name || t.last_from} size="sm" parentClasses="profile-timeline-avatar me-2" />
                            <div className="flex-grow min-w-0">
                              <div className="mb-1 text-[0.75rem] space-x-2">
                                <span className="font-medium truncate">{t.last_from_name || t.last_from}</span>
                                <span className="ltr:float-right rtl:float-left text-[#8c9097] dark:text-white/50 font-normal text-[.6875rem]">{formatThreadTime(t.last_received_at)}</span>
                              </div>
                              <span className={`block ${unread ? "font-semibold text-primary" : "font-normal"}`}>{truncateWords(t.subject, 4)}</span>
                              <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50">Total {t.total_count} • Unread {t.unread_count}</span>
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
                                onClick={() => selectMessageInThread(t.thread_key, m.id)}
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
                })}
              </ul>
              <div ref={sentinelRef} className="py-3 text-center text-xs text-[#8c9097]">
                {isFetchingNextPage ? "Loading..." : hasNextPage ? "Scroll to load more" : "No more threads"}
              </div>
            </div>
          </div>

          <div className="dark:bg-bodybg h-[calc(100vh-6rem)] overflow-hidden rounded-md bg-white border dark:border-defaultborder/10 text-defaulttextcolor text-defaultsize flex-1 flex flex-col min-h-0">
            {selectedMessage ? (
              <>
                <div className="shrink-0 p-6">
                  <CompactHeader msg={selectedMessage} />
                </div>
                <div className="px-6">
                  <IconTabs tabs={tabs} />
                </div>
              </>
            ) : (
              <div className="p-6 h-full min-h-[420px] flex flex-col items-center justify-center text-center">
                <img src={mail} alt="" className="w-24 h-24 mb-4" />
                <p className="text-[#8c9097] dark:text-white/50">Select item to read message</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default MailApp
