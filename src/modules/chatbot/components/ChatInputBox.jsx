import React from "react"

const ChatInputBox = ({
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
}) => {
  return (
    <div className="relative w-full max-w-4xl bg-white dark:bg-bodybg rounded-xl overflow-visible shadow-xl ring-2 ring-gray-300">
      <div className="overflow-hidden rounded-t-xl p-3">
        <textarea
          ref={inputRef}
          rows={1}
          className="min-h-[10rem] form-control w-full border-none resize-none p-6 pt-4 pb-20 text-lg bg-transparent focus:outline-none"
          placeholder="What do you want to know?"
          value={input}
          onChange={e => {autoResize(e)}}
          onInput={e => {e.persist(); autoResize(e)}}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-white dark:bg-bodybg flex items-center rounded-b-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWebSearch}
            className={`h-10 w-10 rounded-full border flex items-center justify-center ${isWebSearch ? "bg-blue text-white" : "text-info"}`}
          >
            <i className="ri-earth-line text-xl"></i>
          </button>
          <div className="relative">
            <button
              onClick={() => setModeOpen(o => !o)}
              className="inline-flex items-center h-10 px-4 rounded-full border bg-transparent text-sm text-muted"
            >
              {modeSelection}
              <i className="ri-arrow-down-s-line ml-2"></i>
            </button>
            {modeOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-20">
                <button
                  onClick={() => {setModeSelection("Export Data"); setModeOpen(false)}}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export Data
                </button>
                <button
                  onClick={() => {setModeSelection("Salesforce"); setModeOpen(false)}}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Salesforce
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={startVoice}
            className={`h-10 w-10 rounded-full flex items-center justify-center ${listening ? "ring ring-red bg-outline-danger" : "bg-outline-success ti-btn-icon"}`}
          >
            <i className={`ri-voiceprint-fill text-xl ${listening ? "text-red animate-pulse" : ""}`}></i>
          </button>
          <button
            onClick={handleSend}
            className="h-10 w-10 rounded-full bg-outline-primary text-white ti-btn-icon flex items-center justify-center"
          >
            <i className="ri-arrow-up-line text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox
