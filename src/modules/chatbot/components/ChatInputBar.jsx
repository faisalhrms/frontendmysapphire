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
  <div className="relative w-full max-w-5xl mx-auto bg-white dark:bg-bodybg rounded-full shadow-2xl ring-1 ring-gray-300 flex items-center gap-4 px-6 py-4 min-h-[5rem]">
    <button
      onClick={toggleWebSearch}
      className={`h-10 w-10 rounded-full flex items-center justify-center border shrink-0 ${isWebSearch ? "bg-blue text-white" : "text-info"}`}
    >
      <i className="ri-earth-line text-xl"></i>
    </button>

    <div className="relative shrink-0">
      <button
        onClick={() => setModeOpen(o => !o)}
        className="h-10 px-5 rounded-full border text-sm flex items-center gap-1 bg-transparent"
      >
        {modeSelection}
        <i className="ri-arrow-down-s-line text-lg"></i>
      </button>
      {modeOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-gray-800 border rounded-xl shadow-xl z-50 max-h-60 overflow-auto">
          <button
            onClick={() => { setModeSelection("Export Data"); setModeOpen(false) }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export Data
          </button>
          <button
            onClick={() => { setModeSelection("Sales Force"); setModeOpen(false) }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Sales Force
          </button>
        </div>
      )}
    </div>

    <textarea
      ref={inputRef}
      rows={1}
      placeholder="What do you want to know?"
      value={input}
      onChange={e => { autoResize(e) }}
      onInput={e => { e.persist(); autoResize(e) }}
      onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
      className="flex-1 form-control border-none resize-none bg-transparent focus:outline-none min-h-[3.5rem] max-h-48 leading-6"
    />

    <button
      onClick={startVoice}
      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${listening ? "ring ring-red bg-outline-danger" : "bg-outline-success"}`}
    >
      <i className={`ri-voiceprint-fill text-xl ${listening ? "text-red animate-pulse" : ""}`}></i>
    </button>

    <button
      onClick={handleSend}
      className="h-10 w-10 rounded-full bg-outline-primary text-white flex items-center justify-center shrink-0"
    >
      <i className="ri-arrow-up-line text-xl"></i>
    </button>
  </div>
)

export default ChatInputBar
