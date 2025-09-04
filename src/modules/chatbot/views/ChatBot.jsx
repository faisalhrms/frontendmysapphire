import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import LottieLoader from "@components/LottieLoader.jsx"
import botLoading from "@assets/jsons/bot.json"
import ChatInputDock from "@modules/chatbot/components/ChatInputDock.jsx"
import ChatInputBox from "@modules/chatbot/components/ChatInputBox.jsx"
import useChatBot from "@modules/chatbot/hooks/useChatBot.js"
import Avatar from "@components/Avatar.jsx"
import ChartBox from "@modules/chatbot/components/ChartBox.jsx"
import TypingIndicator from "@modules/chatbot/components/TypingIndicator.jsx"
import LiveScanLCD from "@modules/chatbot/components/LiveScan.jsx"
import QCReport from "@modules/chatbot/components/QCReport.jsx"
import ExportExcelButton from "@modules/chatbot/components/ExportExcelButton.jsx"

export default function ChatBot() {
  const {
    messages,
    input,
    setInput,
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
    qcTarget,
    setQcTarget,
    qcChecks,
    setQcChecks,
    qcRender,
    setQcRender,
    tick,
    ask,
    suggestions
  } = useChatBot()

  const currentUser = useSelector(s => s.auth.user)
  const psContainerRef = useRef(null)
  const dockRef = useRef(null)
  const [dockH, setDockH] = useState(140)
  const hasLoadingBot = useMemo(() => messages.some(m => m.type === "bot" && m.loading), [messages])

  useEffect(() => {
    if (!dockRef.current) return
    const ro = new ResizeObserver(e => setDockH(Math.round(e[0].contentRect.height)))
    ro.observe(dockRef.current)
    return () => ro.disconnect()
  }, [])

  const nearBottom = useCallback(() => {
    const c = psContainerRef.current
    if (!c) return false
    return c.scrollHeight - c.scrollTop - c.clientHeight < dockH + 120
  }, [dockH])

  const rafScroll = useRef(0)
  const scrollToBottom = useCallback(() => {
    const c = psContainerRef.current
    if (!c) return
    if (!nearBottom()) return
    cancelAnimationFrame(rafScroll.current)
    rafScroll.current = requestAnimationFrame(() => {
      c.scrollTo({ top: c.scrollHeight, behavior: "smooth" })
    })
  }, [nearBottom])

  useEffect(() => { scrollToBottom() }, [])
  useEffect(() => { scrollToBottom() }, [messages.length])
  useEffect(() => { scrollToBottom() }, [tick, isThinking, isWebSearch])

  if (!isBotActive) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white dark:bg-bodybg">
        <LottieLoader animationData={botLoading} width={100} height={100} speed={0.3} opacity={1} />
        <p className="mb-6 text-xl font-semibold">SappSense</p>
        <ChatInputBox
          input={input}
          setInput={setInput}
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
          qcTarget={qcTarget}
          setQcTarget={setQcTarget}
          qcChecks={qcChecks}
          setQcChecks={setQcChecks}
          qcRender={qcRender}
          setQcRender={setQcRender}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-bodybg">
      <div className="flex items-center justify-between border-b dark:border-defaultborder/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <LottieLoader animationData={botLoading} width={50} height={50} speed={0.3} opacity={1}/>
          <Link to="#" className="font-semibold text-sm text-defaulttextcolor dark:text-defaulttextcolor/70">SappSense</Link>
        </div>
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-1 rounded-full ring-1 ring-black/5">
          <i className="ri-edit-box-line text-base"></i>
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <PerfectScrollbar className="h-full" containerRef={ref => (psContainerRef.current = ref)} style={{scrollBehavior:"smooth"}}>
          <ul className="px-16 py-4 space-y-6" style={{paddingBottom: dockH + 24}}>
            {messages.map((m, i) => (
              m.type === "bot"
                ? (
                  <li key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <LottieLoader animationData={botLoading} width={40} height={40} speed={m.loading ? 1 : 0} opacity={1} />
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                      {!m.loading && <span className="text-xs text-gray-500">{m.time?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" })}</span>}
                    </div>
                    <div className="ml-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 max-w-4xl">
                      {m.loading && m.mode === "qc" ? (
                        <LiveScanLCD url={qcTarget} shots={2} delayMs={1800} maxWidth={680} />
                      ) : m.loading ? (
                        <div className="space-y-2 text-xs text-gray-500">
                          {m.statuses?.length > 0 ? (
                            <ul className="list-none space-y-1">
                              {m.statuses.map((status, sIdx) => (
                                <li key={sIdx} className="flex items-center gap-2">
                                  {sIdx < m.statuses.length - 1 ? (
                                    <i className="ri-check-line text-green text-base"></i>
                                  ) : (
                                    <i className="ri-loader-4-line animate-spin text-sky-700 text-base"></i>
                                  )}
                                  <span>{status}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="flex items-center gap-2">
                              {m.latestStatus || (isWebSearch ? "Searching the web " : "Thinking ")} <TypingIndicator />
                            </div>
                          )}
                        </div>
                      ) : null}
                      {m.error ? (
                        <div className="text-xs text-red-600 mt-1">{m.error}</div>
                      ) : (
                        <>
                          <div className="flex justify-end mb-1">
                            {!m.chart && /<(table|ol|ul)/i.test(m.html || "") ? <ExportExcelButton html={m.html} /> : null}
                          </div>
                          {m.mode === "qc" && !m.loading ? <QCReport result={m.qc} html={m.html} llm={m.qcLlm} /> : null}
                          {m.chart ? <ChartBox spec={m.chart} ask={ask} /> : null}
                          {m.html && m.mode !== "qc"
                            ? <div className={`main-chat-msg mt-2 prose prose-sm dark:prose-invert max-w-none ${m.loading ? "streaming" : ""}`} dangerouslySetInnerHTML={{ __html: m.html }} />
                            : null}
                        </>
                      )}
                    </div>
                  </li>
                )
                : (
                  <li key={i} className="flex justify-end items-start space-x-3">
                    <div className="flex flex-col items-end text-right max-w-lg space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-gray-500">{m.time?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" })}</span>
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
            {!hasLoadingBot && isThinking && (
              <li className="space-y-1">
                <div className="flex items-center gap-2">
                  <LottieLoader animationData={botLoading} width={40} height={40} speed={1} opacity={1} />
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                </div>
                <div className="ml-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 max-w-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Thinking <TypingIndicator /></span>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </PerfectScrollbar>
      </div>

      <ChatInputDock
        ref={dockRef}
        input={input}
        setInput={setInput}
        inputRef={inputRef}
        handleSend={handleSend}
        toggleWebSearch={toggleWebSearch}
        isWebSearch={isWebSearch}
        startVoice={startVoice}
        listening={listening}
        modeSelection={modeSelection}
        modeOpen={modeOpen}
        setModeSelection={setModeSelection}
        setModeOpen={setModeOpen}
        qcTarget={qcTarget}
        setQcTarget={setQcTarget}
        qcChecks={qcChecks}
        setQcChecks={setQcChecks}
        qcRender={qcRender}
        setQcRender={setQcRender}
        autoResize={autoResize}
        ask={ask}
        suggestions={suggestions}
      />
    </div>
  )
}
