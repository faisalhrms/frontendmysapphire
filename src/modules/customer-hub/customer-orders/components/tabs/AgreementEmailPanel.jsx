import React, { useMemo, useState } from "react"
import dayjs from "dayjs"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { useAgreementThread } from "@modules/customer-hub/customer-orders/hooks/useAgreementThread.js"
import { sanitizeHtml, resolveCidHtml, fileKind } from "@modules/customer-hub/customer-orders/services/MailAppUtils.js"
import { AttachmentIcon } from "@modules/customer-hub/customer-orders/components/AttachmentIcon.jsx"
import {useAgreementEmail} from "@modules/customer-hub/customer-orders/hooks/useAgreementEmail.js";

const MessageItem = ({ m, active, onClick }) => (
  <button onClick={onClick} className={`w-full text-left rounded px-2 py-2 my-1 ${active ? "bg-light dark:bg-white/10" : "hover:bg-light/40 dark:hover:bg-white/5"}`}>
    <div className="flex items-center justify-between">
      <span className={`truncate ${m.is_read ? "font-normal" : "font-semibold text-primary"}`}>{m.subject || "-"}</span>
      <span className="ms-2 shrink-0 text-[.65rem] text-[#8c9097]">{dayjs(m.received_at).format("ddd h:mm A")}</span>
    </div>
  </button>
)

const AgreementEmailPanel = ({ agreement }) => {
  const emailId = agreement?.email?.id || null
  const { email, isLoading: emailLoading } = useAgreementEmail({ emailId })
  const { messages, isLoading: threadLoading } = useAgreementThread(email)
  const [activeId, setActiveId] = useState(null)
  const active = useMemo(() => {
    if (!messages?.length) return email || null
    const pick = messages.find(x => x.id === activeId) || messages[0]
    return pick || null
  }, [messages, activeId, email])
  const resolvedHtml = useMemo(() => resolveCidHtml(active?.raw_html || "", active?.attachments || []), [active])

  if (!emailId) return null

  return (
    <div className="flex flex-col min-h-0 max-h-[65vh] sm:max-h-[70vh]">
      {threadLoading ? (
        <div className="py-6"><LoadingSpinner /></div>
      ) : Array.isArray(messages) && messages.length > 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-0">
          <div className="sm:col-span-1 min-h-0 max-h-[65vh] overflow-y-auto pr-1">
            {messages.map(m => <MessageItem key={m.id} m={m} active={active?.id === m.id} onClick={() => setActiveId(m.id)} />)}
          </div>
          <div className="sm:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pr-1">
              {emailLoading ? (
                <div className="py-6"><LoadingSpinner /></div>
              ) : active ? (
                <div className="prose max-w-none dark:prose-invert">
                  <div className="text-[.875rem] break-words whitespace-pre-wrap [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:table-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolvedHtml || "") }} />
                </div>
              ) : (
                <div className="text-sm text-[#8c9097]">No email content</div>
              )}
            </div>
            {(active?.attachments?.length ?? 0) > 0 && (
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[.875rem] font-semibold dark:!text-defaulttextcolor/70">
                    <i className="ri-attachment-2 me-1 align-middle" /> Attachments ({active.attachments.length})
                  </span>
                </div>
                <div className="mt-2 flex items-center flex-wrap">
                  {active.attachments.map(a => (
                    <a key={a.id} href={a.url || "#"} target="_blank" rel="noreferrer" className="mail-attachment mb-1 me-2">
                      <div className="w-8 h-8 text-[2rem] me-2"><AttachmentIcon kind={fileKind(a)} /></div>
                      <div className="leading-none"><p className="mb-1 attachment-name truncate dark:border-defaultborder/10">{a.name}</p></div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-1">
            {emailLoading ? (
              <div className="py-6"><LoadingSpinner /></div>
            ) : email ? (
              <div className="prose max-w-none dark:prose-invert">
                <div className="text-[.875rem] break-words whitespace-pre-wrap [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:table-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolveCidHtml(email.raw_html || "", email.attachments || [])) }} />
              </div>
            ) : (
              <div className="text-sm text-[#8c9097]">No email content</div>
            )}
          </div>
          {(email?.attachments?.length ?? 0) > 0 && (
            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[.875rem] font-semibold dark:!text-defaulttextcolor/70">
                  <i className="ri-attachment-2 me-1 align-middle" /> Attachments ({email.attachments.length})
                </span>
              </div>
              <div className="mt-2 flex items-center flex-wrap">
                {email.attachments.map(a => (
                  <a key={a.id} href={a.url || "#"} target="_blank" rel="noreferrer" className="mail-attachment mb-1 me-2">
                    <div className="w-8 h-8 text-[2rem] me-2"><AttachmentIcon kind={fileKind(a)} /></div>
                    <div className="leading-none"><p className="mb-1 attachment-name truncate dark:border-defaultborder/10">{a.name}</p></div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgreementEmailPanel
