import React from "react"
import QCPanel from "@modules/chatbot/components/QCPanel.jsx"
import CompetitorPanel from "@modules/chatbot/components/CompetitorPanel.jsx"
import HasPermission from "@components/HasPermission.jsx"

const ChatInputBox = ({
  input,
  setInput,
  inputRef,
  autoResize,
  handleSend,
  toggleWebSearch,
  isWebSearch,
  startVoice,
  listening,
  modeSelection,
  modeOpen,
  setModeSelection,
  setModeOpen,
  qcTarget,
  setQcTarget,
  qcChecks,
  setQcChecks,
  qcRender,
  setQcRender,
  hrSubtypes = [],
  setHrSubtypes,
  suggestions = [],
  ask,
  competitorSites = [],
  setCompetitorSites,
  competitorChecks = [],
  setCompetitorChecks
}) => {
  const isQc = modeSelection === "Quality Control"
  const isCompetitor = modeSelection === "Competitor Pricing"
  const padClass = isQc || isCompetitor ? "pb-20" : "pb-16"
  const toggleSub = s => setHrSubtypes?.([s])
  const active = s => hrSubtypes?.[0] === s
  const chips = (suggestions.length ? suggestions : [
    "Top 10 exporters of Bed by value_usd last 12 months bar chart",
    "Top ten institutional exporters of duvet to Europe in 2024 in value (USD)"
  ]).slice(0, 4)
  const showSuggestions =
    (modeSelection === "Export Data" || modeSelection === "IT Audit" || modeSelection === "HR") &&
    chips.length > 0

  return (
    <div className="relative w-full max-w-4xl bg-white dark:bg-bodybg rounded-xl overflow-visible shadow-xl ring-2 ring-gray-300">
      <div className={`rounded-t-xl p-2 ${padClass}`}>
        {isQc ? (
          <QCPanel
            qcTarget={qcTarget}
            setQcTarget={setQcTarget}
            qcChecks={qcChecks}
            setQcChecks={setQcChecks}
            qcRender={qcRender}
            setQcRender={setQcRender}
          />
        ) : isCompetitor ? (
          <CompetitorPanel
            competitorSites={competitorSites}
            setCompetitorSites={setCompetitorSites}
            competitorChecks={competitorChecks}
            setCompetitorChecks={setCompetitorChecks}
          />
        ) : (
          <>
            <textarea
              ref={inputRef}
              rows={1}
              className="min-h[7rem] w-full border-none resize-none p-4 text-sm bg-transparent focus:outline-none"
              placeholder="What do you want to know?"
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(e) }}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            {showSuggestions && (
              <div className="px-4 pb-2 flex items-center gap-2 flex-wrap">
                {chips.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => ask?.(s)}
                    className="mt-1 shrink-0 text-[11px] px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-white dark:bg-bodybg flex items-center rounded-b-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWebSearch}
            className={`h-9 w-9 rounded-full border flex items-center justify-center ${isWebSearch ? "bg-blue text-white" : "text-info"}`}
          >
            <i className="ri-earth-line text-lg"></i>
          </button>
          <div className="relative">
            <button
              onClick={() => setModeOpen(o => !o)}
              className="inline-flex items-center h-9 px-3 rounded-full border bg-transparent text-xs"
            >
              {modeSelection}
              <i className="ri-arrow-down-s-line ml-2"></i>
            </button>
            {modeSelection !== "Select Source" && (
              <button
                onClick={() => { setModeSelection("Select Source"); setModeOpen(false) }}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full border bg-white dark:bg-gray-800 flex items-center justify-center"
                aria-label="Clear source"
              >
                <i className="ri-close-line text-[10px]"></i>
              </button>
            )}
            {modeOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-20 text-sm">
                <button onClick={() => { setModeSelection("Select Source"); setModeOpen(false) }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Select Source</button>
                <HasPermission permission='auth.chatbot_export_data'>
                  <button onClick={() => { setModeSelection("Export Data"); setModeOpen(false) }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Export Data</button>
                </HasPermission>
                <HasPermission permission='auth.chatbot_sales_force'>
                  <button onClick={() => { setModeSelection("Salesforce"); setModeOpen(false) }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Salesforce</button>
                </HasPermission>
                <HasPermission permission='auth.chatbot_quality_control'>
                  <button onClick={() => { setModeSelection("Quality Control"); setModeOpen(false) }} className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Quality Control</button>
                </HasPermission>
                <HasPermission permission='auth.chatbot_competitors'>
                  <button
                    onClick={() => {
                      setModeSelection("Competitor Pricing")
                      setModeOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Competitor Pricing
                  </button>
                </HasPermission>
                <HasPermission permission='auth.chatbot_asset_audit'>
                  <button onClick={() => { setModeSelection("IT Audit"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">IT Audit</button>
                </HasPermission>
                <HasPermission permission='auth.chatbot_policies'>
                  <button onClick={() => { setModeSelection("HR"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">HR</button>
                </HasPermission>
              </div>
            )}
          </div>
          {modeSelection === "HR" && (
            <div className="flex items-center gap-2 ml-2">
              {["policies","pms","pas","employee"].map(s => (
                <button
                  key={s}
                  onClick={() => toggleSub(s)}
                  className={`px-3 py-1 rounded-full text-xs border ${active(s) ? "bg-indigo/80 text-white border-indigo" : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200"}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={startVoice} className={`h-9 w-9 rounded-full flex items-center justify-center ${listening ? "ring ring-red bg-outline-danger" : "bg-outline-success ti-btn-icon"}`}>
            <i className={`ri-voiceprint-fill text-lg ${listening ? "text-red animate-pulse" : ""}`}></i>
          </button>
          <button onClick={handleSend} className="h-9 w-9 rounded-full bg-outline-primary text-white ti-btn-icon flex items-center justify-center">
            <i className="ri-arrow-up-line text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox
