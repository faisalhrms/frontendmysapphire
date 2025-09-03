import React from "react"
import ChatInputBar from "@modules/chatbot/components/ChatInputBar.jsx"

function ChatInputDockInner(props, ref) {
  return (
    <div ref={ref} className="sticky bottom-0 z-20">
      <div className="w-full bg-white/95 dark:bg-bodybg/95 backdrop-blur border-t dark:border-defaultborder/20 px-4 py-3">
        <div className="w-full max-w-5xl mx-auto">
          <ChatInputBar {...props} />
        </div>
      </div>
    </div>
  )
}

export default React.forwardRef(ChatInputDockInner)
