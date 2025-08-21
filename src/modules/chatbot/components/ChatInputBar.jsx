import React from "react"

const ChatInputBar = ({
  input,
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
  setModeOpen
}) => (
  <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-bodybg rounded-xl shadow-xl ring-1 ring-black/5 border border-gray-200 px-6 pt-4 pb-16">
    <textarea
      ref={inputRef}
      rows={1}
      placeholder="What do you want to know?"
      value={input}
      onChange={e => { autoResize(e) }}
      onInput={e => { e.persist(); autoResize(e) }}
      onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
      className="w-full form-control border-none resize-none bg-transparent focus:outline-none min-h-[3.25rem] max-h-48 leading-6"
    />
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
            <button
              onClick={() => { setModeSelection("Select Source"); setModeOpen(false) }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Select Source
            </button>
            <button
              onClick={() => { setModeSelection("Export Data"); setModeOpen(false) }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Export Data
            </button>
            <button
              onClick={() => { setModeSelection("Salesforce"); setModeOpen(false) }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Salesforce
            </button>
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

export default ChatInputBar
