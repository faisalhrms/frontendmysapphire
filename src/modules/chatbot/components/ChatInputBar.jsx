import React from "react"
import QCPanel from "@modules/chatbot/components/QCPanel.jsx"
import CompetitorPanel from "@modules/chatbot/components/CompetitorPanel.jsx"
import EmployeeChatKitPane from "@modules/chatbot/components/EmployeeChatKitPane.jsx"
import HasPermission from "@components/HasPermission.jsx"

const ChatInputBar = ({
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
  ask,
  suggestions = [],
  hrSubtypes = [],
  setHrSubtypes,
  competitorSites = [],
  setCompetitorSites,
  competitorChecks = [],
  setCompetitorChecks,
}) => {
  const toggleSub = (s) => setHrSubtypes?.([s])
  const active = (s) => hrSubtypes?.[0] === s

  const isQc = modeSelection === "Quality Control"
  const isCompetitor = modeSelection === "Competitor Pricing"
  const isHr = modeSelection === "HR"
  const isHrEmployee = isHr && active("employee")

  const chips = (suggestions.length
    ? suggestions
    : [
        "Top 10 exporters of Bed by value_usd last 12 months bar chart",
        "Top ten institutional exporters of duvet to Europe in 2024 in value (USD)",
      ]
  ).slice(0, 4)

  const showSuggestions =
    (modeSelection === "Export Data" || modeSelection === "IT Audit" || isHr) &&
    chips.length > 0

  if (isHrEmployee) {
    return null
  }

  const pad = isQc || isCompetitor ? "pb-24" : "pb-20"

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/90 backdrop-blur shadow-[0_12px_40px_-20px_rgba(15,23,42,0.55)] px-5 sm:px-6 pt-4 ${pad}`}
    >
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
            placeholder="What do you want to know?"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoResize?.(e)
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="w-full border-none resize-none bg-transparent focus:outline-none min-h-[3.25rem] leading-6 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
          />

          {showSuggestions && (
            <div className="mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {chips.map((s, i) => (
                <button
                  key={i}
                  onClick={() => ask?.(s)}
                  className="shrink-0 text-[11px] px-3 py-1 rounded-full border border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <button
          onClick={toggleWebSearch}
          className={`h-10 w-10 rounded-full flex items-center justify-center border transition ${
            isWebSearch
              ? "bg-blue text-white border-blue shadow-lg shadow-blue/30"
              : "text-info border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          <i className="ri-earth-line text-xl"></i>
        </button>

        {!isHrEmployee && (
          <>
            <div className="relative">
              <button
                onClick={() => setModeOpen((o) => !o)}
                className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm flex items-center gap-1 bg-white/80 dark:bg-slate-900/80"
              >
                {modeSelection}
                <i className="ri-arrow-down-s-line text-lg"></i>
              </button>

              {modeSelection !== "Select Agent" && (
                <button
                  onClick={() => {
                    setModeSelection("Select Agent")
                    setModeOpen(false)
                  }}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800 flex items-center justify-center"
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              )}

              {modeOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white/95 dark:bg-gray-800/95 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-auto backdrop-blur">
                  <button
                    onClick={() => {
                      setModeSelection("Select Agent")
                      setModeOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Select Agent
                  </button>

                  <HasPermission permission="auth.chatbot_export_data">
                    <button
                      onClick={() => {
                        setModeSelection("Export Data")
                        setModeOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export Data
                    </button>
                  </HasPermission>

                  <HasPermission permission="auth.chatbot_sales_force">
                    <button
                      onClick={() => {
                        setModeSelection("Salesforce")
                        setModeOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Salesforce
                    </button>
                  </HasPermission>

                  <HasPermission permission="auth.chatbot_quality_control">
                    <button
                      onClick={() => {
                        setModeSelection("Quality Control")
                        setModeOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Quality Control
                    </button>
                  </HasPermission>


                  <HasPermission permission="auth.chatbot_asset_audit">
                    <button
                      onClick={() => {
                        setModeSelection("IT Audit")
                        setModeOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      IT Audit
                    </button>
                  </HasPermission>

                  <HasPermission permission="auth.chatbot_policies">
                    <button
                      onClick={() => {
                        setModeSelection("HR")
                        setModeOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      HR
                    </button>
                  </HasPermission>
                </div>
              )}
            </div>

            {isHr && (
              <div className="flex items-center gap-2 ml-2">
                {["policies", "pms", "employee"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSub(s)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      active(s)
                        ? "bg-indigo text-white border-indigo shadow-sm"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={startVoice}
            className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
              listening
                ? "ring ring-red bg-outline-danger"
                : "bg-outline-success shadow-lg shadow-emerald-500/25 hover:brightness-110"
            }`}
          >
          <i className={`ri-voiceprint-fill text-xl ${listening ? "text-red animate-pulse" : ""}`}></i>
        </button>

        <button
          onClick={handleSend}
          className="h-10 w-10 rounded-full bg-outline-primary text-white flex items-center justify-center shadow-lg shadow-blue/30 hover:brightness-110 transition"
        >
          <i className="ri-arrow-up-line text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export default ChatInputBar
