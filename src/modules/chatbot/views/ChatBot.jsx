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
import { PMS_ROUTES } from "@modules/project-management/routes.js"
import EmployeeCard from "@modules/chatbot/components/EmployeeCard.jsx"
import EmployeeCandidates from "@modules/chatbot/components/EmployeeCandidates.jsx"
import AttendanceSummary from "@modules/chatbot/components/AttendanceSummary.jsx"
import CaloriesChatKitPane from "@modules/chatbot/components/CaloriesChatKitPane.jsx"
import HasPermission from "@components/HasPermission.jsx"
import EmployeeChatKitPane from "@modules/chatbot/components/EmployeeChatKitPane.jsx"
import sanitizeHtml from "@modules/chatbot/utils/sanitizeHtml.js"
import ChatService from "@modules/chatbot/services/ChatService.js";

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
    ask,
    suggestions,
    hrSubtypes,
    setHrSubtypes,
    competitorSites,
    setCompetitorSites,
    competitorChecks,
    setCompetitorChecks,
    tick,
  } = useChatBot()

  const currentUser = useSelector((s) => s.auth.user)
  const psContainerRef = useRef(null)
  const dockRef = useRef(null)
  const [dockH, setDockH] = useState(140)

  const [activeView, setActiveView] = useState("assistant")

  const canSeeFitness = useMemo(() => {
    const email = String(currentUser?.email || "").toLowerCase()
    return email === "faisal.rehman@sapphiretextiles.com.pk"
  }, [currentUser?.email])

  const isHrEmployeePane = useMemo(() => {
    return activeView === "assistant" && modeSelection === "HR" && hrSubtypes?.[0] === "employee"
  }, [activeView, modeSelection, hrSubtypes])

  const exitHrEmployeePane = useCallback(() => {
    setHrSubtypes?.(["policies"])
    setActiveView("assistant")
  }, [setHrSubtypes])

  const hasLoadingBot = useMemo(() => {
    return (messages || []).some((m) => m?.type === "bot" && m?.loading)
  }, [messages])

  useEffect(() => {
    ChatService.resetMemory()
  }, [])

  useEffect(() => {
    if (!dockRef.current) return
    const ro = new ResizeObserver((e) => setDockH(Math.round(e[0].contentRect.height)))
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
      c.scrollTop = c.scrollHeight
    })
  }, [nearBottom])

  useEffect(() => {
    scrollToBottom()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, isWebSearch, tick, scrollToBottom])

  const handleLLMLinkClick = useCallback(
    (e) => {
      const a = e.target.closest("a[data-pms-kind][data-pms-id]")
      if (!a) return
      if (!(hrSubtypes || []).includes("pms")) return
      e.preventDefault()
      const kind = a.getAttribute("data-pms-kind")
      const id = a.getAttribute("data-pms-id")
      let url = null
      if (kind === "project") url = `/module/projects/detail/${id}`
      if (kind === "task") url = PMS_ROUTES.TASK.DETAIL.path.replace(":id", id)
      if (url) window.open(url, "_blank", "noopener,noreferrer")
    },
    [hrSubtypes],
  )

  const handlePickEmployee = useCallback(
    (x) => {
      setModeSelection("HR")
      setHrSubtypes?.(["employee"])
      const q = x.emp_code ? `employee ${x.emp_code}` : `employee ${x.full_name}`
      ask(q)
    },
    [ask, setHrSubtypes, setModeSelection],
  )

  const toggleHrSub = useCallback((s) => setHrSubtypes?.([s]), [setHrSubtypes])
  const hrActive = useCallback((s) => hrSubtypes?.[0] === s, [hrSubtypes])

  const rootClass = isHrEmployeePane
    ? "min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-bodybg dark:to-slate-900"
    : "min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-bodybg dark:to-slate-900 p-2 sm:p-3 mt-2 rounded-2xl"

  if (!isBotActive && activeView === "assistant" && !isHrEmployeePane) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-bodybg dark:to-slate-900">
        <LottieLoader animationData={botLoading} width={100} height={100} speed={0.3} opacity={1} />
        <p className="mb-2 text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">SappSense</p>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-300">AI workspace assistant for faster business decisions</p>
        <ChatInputBox
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          autoResize={(e) => autoResize(e)}
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
          hrSubtypes={hrSubtypes}
          setHrSubtypes={setHrSubtypes}
          suggestions={suggestions}
          ask={ask}
          competitorSites={competitorSites}
          setCompetitorSites={setCompetitorSites}
          competitorChecks={competitorChecks}
          setCompetitorChecks={setCompetitorChecks}
        />
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-700/70 px-4 py-3 bg-white/90 dark:bg-bodybg/90 backdrop-blur overflow-visible">
        <div className="flex items-center gap-2 flex-wrap">
          <LottieLoader animationData={botLoading} width={40} height={40} speed={0.3} opacity={1} />
          <Link to="#" className="font-semibold text-sm text-defaulttextcolor dark:text-defaulttextcolor/70">
            SappSense
          </Link>

            {isHrEmployeePane && (
            <div className="ml-2 flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setModeOpen((o) => !o)}
                  className="inline-flex items-center h-9 px-3 rounded-full border bg-transparent text-xs"
                >
                  {modeSelection}
                  <i className="ri-arrow-down-s-line ml-2"></i>
                </button>

                {modeSelection !== "Select Agent" && (
                  <button
                    onClick={() => {
                      setModeSelection("Select Agent")
                      setModeOpen(false)
                      setHrSubtypes?.(["policies"])
                    }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full border bg-white dark:bg-gray-800 flex items-center justify-center"
                    aria-label="Clear Agent"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                )}

                {modeOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-[60] max-h-60 overflow-auto">
                    <button
                      onClick={() => {
                        setModeSelection("Select Agent")
                        setModeOpen(false)
                        setHrSubtypes?.(["policies"])
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Select Agent
                    </button>

                    <HasPermission permission="auth.chatbot_export_data">
                      <button
                        onClick={() => {
                          setModeSelection("Export Data")
                          setModeOpen(false)
                          setHrSubtypes?.(["policies"])
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export Data
                      </button>
                    </HasPermission>

                    <HasPermission permission="auth.chatbot_sales_force">
                      <button
                        onClick={() => {
                          setModeSelection("Salesforce")
                          setModeOpen(false)
                          setHrSubtypes?.(["policies"])
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Salesforce
                      </button>
                    </HasPermission>

                    <HasPermission permission="auth.chatbot_quality_control">
                      <button
                        onClick={() => {
                          setModeSelection("Quality Control")
                          setModeOpen(false)
                          setHrSubtypes?.(["policies"])
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Quality Control
                      </button>
                    </HasPermission>

                    <HasPermission permission="auth.chatbot_asset_audit">
                      <button
                        onClick={() => {
                          setModeSelection("IT Audit")
                          setModeOpen(false)
                          setHrSubtypes?.(["policies"])
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        IT Audit
                      </button>
                    </HasPermission>

                    <HasPermission permission="auth.chatbot_policies">
                      <button
                        onClick={() => {
                          setModeSelection("HR")
                          setModeOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        HR
                      </button>
                    </HasPermission>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2 flex-wrap">
                {["policies", "pms", "employee"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleHrSub(s)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      hrActive(s)
                        ? "bg-indigo/80 text-white border-indigo"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {canSeeFitness && (
            <HasPermission permission="auth.ai_fitness_coach">
              <div className="ml-4 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setActiveView("assistant")}
                  className={`px-3 py-1 text-xs rounded-full transition ${
                    activeView === "assistant"
                      ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("calories")}
                  className={`px-3 py-1 text-xs rounded-full transition ${
                    activeView === "calories"
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                >
                  Calories Tracker
                </button>
              </div>
            </HasPermission>
          )}

          {isHrEmployeePane && (
            <button
              type="button"
              onClick={exitHrEmployeePane}
              className="ml-3 inline-flex items-center h-8 px-3 rounded-full border text-xs bg-white dark:bg-slate-900"
            >
              Back
            </button>
          )}
        </div>

        {activeView === "assistant" && !isHrEmployeePane && (
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-900 ring-1 ring-slate-300/70 dark:ring-slate-700/80 shadow-sm hover:shadow transition">
            <i className="ri-edit-box-line text-base" />
            <span>New Chat</span>
          </button>
        )}
      </div>

      {activeView === "calories" ? (
        <div className="flex-1 min-h-0">
          <CaloriesChatKitPane />
        </div>
      ) : isHrEmployeePane ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <EmployeeChatKitPane />
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 overflow-hidden">
            <PerfectScrollbar className="h-full" containerRef={(ref) => (psContainerRef.current = ref)}>
              <ul className="px-4 sm:px-8 lg:px-16 py-6 space-y-7" style={{ paddingBottom: dockH + 24 }} onClick={handleLLMLinkClick}>
                {messages.map((m, i) =>
                  m.type === "bot" ? (
                    <li key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LottieLoader
                          animationData={botLoading}
                          width={40}
                          height={40}
                          speed={m.loading ? 1 : 0}
                          opacity={1}
                        />
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                        {!m.loading && (
                          <span className="text-xs text-slate-500">
                            {m.time?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>

                      <div className="ml-8 bg-white dark:bg-slate-800/90 text-gray-900 dark:text-gray-100 rounded-2xl border border-slate-200/80 dark:border-slate-700 px-4 py-3 max-w-4xl shadow-sm">
                        {m.loading && m.mode === "qc" ? (
                          <LiveScanLCD url={qcTarget} shots={2} delayMs={1800} maxWidth={680} />
                        ) : m.loading ? (
                          <div className="space-y-2 text-xs text-gray-500">
                            {m.statuses?.length > 0 ? (
                              <ul className="list-none space-y-1">
                                {m.statuses.map((status, sIdx) => (
                                  <li key={sIdx} className="flex items-center gap-2">
                                    {sIdx < m.statuses.length - 1 ? (
                                      <i className="ri-check-line text-green text-base" />
                                    ) : (
                                      <i className="ri-loader-4-line animate-spin text-sky-700 text-base" />
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
                          <div className={`${m.loading ? "min-h-[148px]" : ""}`}>
                            <div className="flex justify-end mb-1">
                              {!m.chart && /<(table|ol|ul)/i.test(m.html || "") ? <ExportExcelButton html={m.html} /> : null}
                            </div>

                            {m.mode === "qc" && !m.loading ? <QCReport result={m.qc} html={m.html} llm={m.qcLlm} /> : null}
                            {m.chart ? <ChartBox spec={m.chart} ask={ask} /> : null}
                            {m.employee && !m.attendance ? <EmployeeCard userData={m.employee} /> : null}
                            {m.employee_candidates ? (
                              <EmployeeCandidates items={m.employee_candidates} onPick={handlePickEmployee} />
                            ) : null}
                            {m.mode === "hr" && m.attendance ? <AttendanceSummary data={m.attendance} ask={ask} /> : null}

                            {m.html && m.mode !== "qc" ? (
                              <div
                                className={`main-chat-msg mt-2 prose prose-sm dark:prose-invert max-w-none overflow-x-auto ${
                                  m.loading ? "streaming" : ""
                                }`}
                                style={{ overflowAnchor: "none" }}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(m.html) }}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </li>
                  ) : (
                    <li key={i} className="flex justify-end items-start space-x-3">
                      <div className="flex flex-col items-end text-right max-w-lg space-y-1">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-slate-500">
                            {m.time?.toLocaleTimeString?.([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl px-4 py-3 shadow-md shadow-sky-600/20">
                          <p className="text-xs sm:text-sm leading-relaxed">{m.text}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Avatar full_name={currentUser?.full_name} />
                      </div>
                    </li>
                  ),
                )}

                {!hasLoadingBot && isThinking && (
                  <li className="space-y-1">
                    <div className="flex items-center gap-2">
                      <LottieLoader animationData={botLoading} width={40} height={40} speed={1} opacity={1} />
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">SappSense</span>
                    </div>
                    <div className="ml-8 bg-white dark:bg-slate-800/90 text-gray-900 dark:text-gray-100 rounded-2xl border border-slate-200/80 dark:border-slate-700 px-4 py-3 max-w-lg shadow-sm">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          Thinking <TypingIndicator />
                        </span>
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
            hrSubtypes={hrSubtypes}
            setHrSubtypes={setHrSubtypes}
            competitorSites={competitorSites}
            setCompetitorSites={setCompetitorSites}
            competitorChecks={competitorChecks}
            setCompetitorChecks={setCompetitorChecks}
            showHrControlsInDock={activeView === "assistant" && modeSelection === "HR" && !isHrEmployeePane}
          />
        </>
      )}
    </div>
  )
}
