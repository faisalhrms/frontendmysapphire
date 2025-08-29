// ChatInputDock.jsx
import React from "react"
import ChatInputBar from "@modules/chatbot/components/ChatInputBar.jsx"

function ChatInputDockInner(props, ref) {
  return (
    <div ref={ref} className="relative z-10">
      <div className="w-full border-t dark:border-gray-700 bg-white/90 dark:bg-bodybg/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <ChatInputBar {...props} />
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(ChatInputDockInner)
