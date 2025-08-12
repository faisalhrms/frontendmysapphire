import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import LottieLoader from "@components/LottieLoader.jsx"
import botLoading from "@assets/jsons/bot.json"
import ChatInputDock from "@modules/chatbot/components/ChatInputDock.jsx"
import ChatInputBox from "@modules/chatbot/components/ChatInputBox.jsx"
import useChatBot from "@modules/chatbot/hooks/useChatBot.js"
import Avatar from "@components/Avatar.jsx";

export default function ChatBot() {
  const {
    messages,
    input,
    listening,
    isThinking,
    isBotActive,
    isWebSearch,
    modeSelection,
    modeOpen,
    inputRef,
    handleSend,
    handleReset,
    toggleWebSearch,
    startVoice,
    autoResize,
    setModeSelection,
    setModeOpen,
    streamTick
  } = useChatBot()

  const currentUser = useSelector(s => s.auth.user)
  const dockRef = useRef(null)
  const [dockH, setDockH] = useState(112)
  const psContainerRef = useRef(null)
  const endRef = useRef(null)

  useLayoutEffect(() => {
    const setH = () => setDockH(dockRef.current ? dockRef.current.offsetHeight : 112)
    setH()
    const ro = new ResizeObserver(setH)
    if (dockRef.current) ro.observe(dockRef.current)
    window.addEventListener("resize", setH)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", setH)
    }
  }, [])

 const scrollToBottom = (smooth = true) => {
   const c = psContainerRef.current
   if (!c) return
   const nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 120
   if (nearBottom) {
     c.scrollTo({ top: c.scrollHeight, behavior: smooth ? "smooth" : "auto" })
   }
 }

  useEffect(() => {
    scrollToBottom(false)
  }, [])

useEffect(() => {
  scrollToBottom(true)
}, [messages.length])

useEffect(() => {
  scrollToBottom(false)
}, [streamTick])

  const hasLoadingBot = useMemo(() => messages.some(m => m.type === "bot" && m.loading), [messages])

  if (!isBotActive) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white dark:bg-bodybg">
        <LottieLoader animationData={botLoading} width={100} height={100} speed={0.3} opacity={1} />
        <p className="mb-6 text-xl font-semibold">SappSense</p>
        <ChatInputBox
          input={input}
          inputRef={inputRef}
          autoResize={e => { autoResize(e) }}
          handleSend={handleSend}
          toggleWebSearch={toggleWebSearch}
          isWebSearch={isWebSearch}
          startVoice={startVoice}
          listening={listening}
          modeSelection={modeSelection}
          modeOpen={modeOpen}
          setModeSelection={setModeSelection}
          setModeOpen={setModeOpen}
        />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-bodybg">
      <div className="flex items-center justify-between border-b dark:border-defaultborder/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <LottieLoader animationData={botLoading} width={50} height={50} speed={0.3} opacity={1}/>
          <Link to="#" className="font-semibold text-sm text-defaulttextcolor dark:text-defaulttextcolor/70">SappSense</Link>
        </div>
        <button onClick={handleReset} className="ti-btn ti-btn-icon ti-btn-outline-light dark:border-defaultborder/10">
          <i className="ri-refresh-line dark:text-defaulttextcolor/70"></i>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <PerfectScrollbar className="h-full" containerRef={ref => (psContainerRef.current = ref)}>
          <ul className="px-16 py-4 space-y-6" style={{ paddingBottom: dockH + 16 }}>
            {messages.map((m, i) => (
              m.type === "bot" ? (
                <li key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    {m.loading ? (
                      <LottieLoader animationData={botLoading} width={40} height={40} speed={1} opacity={1} />
                    ) : (
                      <LottieLoader animationData={botLoading} width={40} height={40} speed={0} opacity={1} />
                    )}
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                    <span className="text-xs text-gray-500">
                      {m.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                <div className="ml-8 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 w-full max-w-lg main-chat-msg prose dark:prose-invert">                    {m.html
                      ? <div dangerouslySetInnerHTML={{ __html: m.html }} />
                      : <div className="whitespace-pre-line break-words">
                          <span>{m.text || (m.loading ? "Thinking…" : "")}</span>
                          {m.loading && <span className="animate-pulse">▌</span>}
                        </div>}
                  </div>
                </li>
              ) : (
                <li key={i} className="flex justify-end items-start space-x-3">
                  <div className="flex flex-col items-end text-right max-w-lg space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs text-gray-500">
                        {m.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="bg-sky-100 dark:bg-blue text-blue dark:text-white rounded-lg px-4 py-3">
                      <p className="text-xs">{m.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Avatar full_name={currentUser?.full_name} />
                  </div>
                </li>
              )
            ))}
            {!hasLoadingBot && isThinking && !isWebSearch && (
              <li className="space-y-1">
                <div className="flex items-center gap-2">
                  <LottieLoader animationData={botLoading} width={40} height={40} speed={1} opacity={1} />
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                </div>
                <div className="ml-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 max-w-lg">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </li>
            )}
            <li ref={endRef} />
          </ul>
        </PerfectScrollbar>
      </div>

      <ChatInputDock
        ref={dockRef}
        input={input}
        inputRef={inputRef}
        autoResize={e => { autoResize(e) }}
        handleSend={handleSend}
        toggleWebSearch={toggleWebSearch}
        isWebSearch={isWebSearch}
        startVoice={startVoice}
        listening={listening}
        modeSelection={modeSelection}
        modeOpen={modeOpen}
        setModeSelection={setModeSelection}
        setModeOpen={setModeOpen}
      />
    </div>
  )
}
