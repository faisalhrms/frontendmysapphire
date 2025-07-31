import React from "react"
import ChatInputBar from "@modules/chatbot/components/ChatInputBar.jsx"

export default function ChatInputDock(props) {
  return (
    <div className="fixed bottom-0 right-0 left-0 lg:left-64 z-40 pointer-events-none">
      <div className="flex justify-center px-4 pb-5 pt-2 bg-gradient-to-t from-white/90 to-transparent dark:from-bodybg/90">
        <div className="pointer-events-auto w-full max-w-5xl mx-auto">
          <ChatInputBar {...props} />
        </div>
      </div>
    </div>
  )
}
