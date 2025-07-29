import React from "react"
import ChatInputBar from "@modules/chatbot/components/ChatInputBar.jsx";

export default function ChatInputDock(props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="px-4 pb-5 pt-2 bg-gradient-to-t from-white/90 to-transparent dark:from-bodybg/90">
        <div className="pointer-events-auto">
          <ChatInputBar {...props} />
        </div>
      </div>
    </div>
  )
}
