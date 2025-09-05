import React from "react"
import QCPanel from "@modules/chatbot/components/QCPanel.jsx"
import HasPermission from "@components/HasPermission.jsx";

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
  suggestions = []
}) => {
  const chips = (suggestions.length ? suggestions : [
    "Top 10 exporters of Bed by value_usd last 12 months bar chart",
    "Top ten institutional exporters of duvet to Europe in 2024 in value (USD)",
  ]).slice(0, 4)

  const pad = modeSelection === "Quality Control" ? "pb-24" : "pb-20"
  return (
    <div className={`relative w-full max-w-5xl mx-auto bg-white dark:bg-bodybg rounded-xl shadow-xl ring-1 ring-black/5 border border-gray-200 px-6 pt-4 ${pad}`}>
      {modeSelection !== "Quality Control" ? (
        <>
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="What do you want to know?"
            value={input}
            onChange={e => { setInput(e.target.value); if (typeof autoResize === "function") autoResize(e) }}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="w-full form-control border-none resize-none bg-transparent focus:outline-none min-h-[3.25rem] leading-6"
          />
            {modeSelection === "Export Data" && (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {chips.map((s, i) => (
              <button key={i} onClick={() => ask?.(s)} className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                {s}
              </button>
            ))}
          </div>
           )}
        </>
      ) : (
        <QCPanel
          qcTarget={qcTarget}
          setQcTarget={setQcTarget}
          qcChecks={qcChecks}
          setQcChecks={setQcChecks}
          qcRender={qcRender}
          setQcRender={setQcRender}
        />
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <button
          onClick={toggleWebSearch}
          className={`h-10 w-10 rounded-full flex items-center justify-center border ${isWebSearch ? "bg-blue text-white" : "text-info"}`}
        >
          <i className="ri-earth-line text-xl"></i>
        </button>
        <div className="relative">
          <button
            onClick={() => setModeOpen(o => !o)}
            className="h-10 px-4 rounded-lg border text-sm flex items-center gap-1 bg-transparent"
          >
            {modeSelection}
            <i className="ri-arrow-down-s-line text-lg"></i>
          </button>
          {modeSelection !== "Select Source" && (
            <button
              onClick={() => { setModeSelection("Select Source"); setModeOpen(false) }}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full border bg-white dark:bg-gray-800 flex items-center justify-center"
              aria-label="Clear source"
            >
              <i className="ri-close-line text-xs"></i>
            </button>
          )}
          {modeOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-50 max-h-60 overflow-auto">
              <button onClick={() => { setModeSelection("Select Source"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Select Source</button>
              <HasPermission permission='auth.chatbot_export_data'>
              <button onClick={() => { setModeSelection("Export Data"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Export Data</button>
              </HasPermission>
              <HasPermission permission='auth.chatbot_sales_force'>
              <button onClick={() => { setModeSelection("Salesforce"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Salesforce</button>
              </HasPermission>
              <HasPermission permission='auth.chatbot_quality_control'>
              <button onClick={() => { setModeSelection("Quality Control"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Quality Control</button>
              </HasPermission>
              <HasPermission permission='auth.chatbot_policies'>
              <button onClick={() => { setModeSelection("Policies"); setModeOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Policies</button>
              </HasPermission>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={startVoice}
          className={`h-10 w-10 rounded-full flex items-center justify-center ${listening ? "ring ring-red bg-outline-danger" : "bg-outline-success"}`}
        >
          <i className={`ri-voiceprint-fill text-xl ${listening ? "text-red animate-pulse" : ""}`}></i>
        </button>
        <button
          onClick={handleSend}
          className="h-10 w-10 rounded-full bg-outline-primary text-white flex items-center justify-center"
        >
          <i className="ri-arrow-up-line text-xl"></i>
        </button>
      </div>
    </div>
  )
}

export default ChatInputBar
