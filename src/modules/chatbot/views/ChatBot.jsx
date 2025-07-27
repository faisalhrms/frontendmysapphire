import React, {useState, useEffect, useRef} from "react"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import api from "@config/axiosConfig.js"
import LottieLoader from "@components/LottieLoader.jsx"
import botAnimation from "@assets/jsons/loading-bot.json"
import botLoading from "@assets/jsons/bot.json"

const suggestionsDefault = [
  "What are the total exports of bed linen in the last twelve months?",
  "What are the total exports of bed linen to Europe in the institutional segment in the last twelve months?",
  "Who are the top importers of Faisal Spinning Mills in Europe in the last twelve months?",
  "Who are the top ten exporters of bed linen in the last twelve months?",
  "What is the product-wise split of exports of bed linen to Europe in the last twelve months?",
]

const ensureHtml = d => {
  if (typeof d === "string") return d
  if (d && typeof d === "object") {
    if (d.html) return d.html
    if (d.answer) return d.answer
    if (d.response) return d.response
    return JSON.stringify(d)
  }
  return String(d ?? "")
}

const normalizeHtml = raw => {
  const html = ensureHtml(raw)
  return html.replace(/<img\s/gi, "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ")
}

const ChatBot = () => {
  const currentUser = useSelector(state => state.auth.user)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState(suggestionsDefault)
  const [listening, setListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isBotActive, setIsBotActive] = useState(false)
  const [isWebSearch, setIsWebSearch] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")

  const handleInit = () => {
    setIsBotActive(true)
    setMessages([{type: "bot", html: "<p>How can I assist you?</p>", time: new Date()}])
    setSuggestions(suggestionsDefault)
  }

  const handleReset = () => {
    handleInit()
  }

  const sendQuery = async (msg, webSearch = false) => {
    setIsThinking(true)
    setMessages(p => [...p, {type: "user", text: msg, time: new Date()}])
    try {
      const res = await api.post("chat/query/", {query: msg, web_search: webSearch})
      const d = res.data.response
      const now = new Date()
      if (Array.isArray(d)) {
        setMessages(p => [...p, {type: "bot", table: d, time: now}])
      } else {
        const html = normalizeHtml(d)
        setMessages(p => [...p, {type: "bot", html, time: now}])
      }
    } catch {
      setMessages(p => [...p, {type: "bot", text: "Network error", time: new Date()}])
    } finally {
      setIsThinking(false)
    }
  }

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    setInput("")
    sendQuery(msg, isWebSearch)
  }

  const toggleWebSearch = () => {
    setIsWebSearch(prev => !prev)
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (!recognitionRef.current) {
      const rec = new SR()
      rec.lang = "en-US"
      rec.interimResults = true
      rec.continuous = false
      rec.onstart = () => setListening(true)
      rec.onresult = e => {
        let interim = ""
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalTranscriptRef.current += e.results[i][0].transcript
          else interim += e.results[i][0].transcript
        }
        setInput(finalTranscriptRef.current + interim)
        if (e.results[e.results.length - 1].isFinal) rec.stop()
      }
      rec.onend = () => {
        setListening(false)
        const msg = finalTranscriptRef.current.trim()
        if (msg) sendQuery(msg, isWebSearch)
        finalTranscriptRef.current = ""
        setInput("")
      }
      rec.onerror = () => setListening(false)
      recognitionRef.current = rec
    }
    if (!listening) {
      finalTranscriptRef.current = ""
      setInput("")
      recognitionRef.current.start()
    }
  }

  useEffect(() => {
    handleInit()
  }, [])

  useEffect(() => {
    const el = document.getElementById("chat-global-style")
    if (!el) {
      const style = document.createElement("style")
      style.id = "chat-global-style"
      style.innerHTML = `.main-chat-msg img{max-width:100%;height:auto;display:block;margin:.5rem 0;border-radius:.375rem}`
      document.head.appendChild(style)
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  return (
    <div className="main-chart-wrapper p-2 gap-4 lg:flex">
      <div className="main-chat-area border dark:border-defaultborder/10 ml-6">
        <div className="sm:flex items-center p-2 border-b dark:border-defaultborder/10">
          <div className="flex items-center leading-none ml-4">
            <div className="flex-grow flex items-center">
              {isBotActive && <LottieLoader animationData={botLoading} width={60} height={60} opacity={1} speed={0.3}/>}
              <p className="mb-1 font-semibold text-[.875rem]">
                <Link to="#" className="chatnameperson responsive-userinfo-open !text-defaulttextcolor dark:text-defaulttextcolor/70">
                  SappSense
                </Link>
              </p>
            </div>
          </div>
          <div className="flex ms-auto">
            <button onClick={handleReset} className="ti-btn ti-btn-icon ti-btn-outline-light dark:border-defaultborder/10 !text-[0.95rem] !ms-2 font-semibold">
              <i className="ri-refresh-line dark:text-defaulttextcolor/70"></i>
            </button>
          </div>
        </div>
        <PerfectScrollbar className="chat-content" id="main-chat-content">
          <ul className="list-none p-2">
            {messages.map((m, i) =>
              m.type === "bot" ? (
                <li key={i} className="chat-item-start mb-2">
                  <div className="chat-list-inner flex items-start">
                    <div className="ms-3">
                      <span className="chatting-user-info flex items-center mb-1">
                        {isBotActive && <LottieLoader animationData={botAnimation} width={30} height={30} opacity={1} speed={0}/>}
                        <span className="chatnameperson">SappSense</span>
                        <span className="msg-sent-time ms-2 text-xs text-gray-500">
                          {m.time.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                        </span>
                      </span>
                      <div className="main-chat-msg">
                        {m.table && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="border px-2 py-1">#</th>
                                  {Object.keys(m.table[0]).map(h => (
                                    <th key={h} className="border px-2 py-1">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {m.table.map((row, idx) => (
                                  <tr key={idx}>
                                    <td className="border px-2 py-1">{idx + 1}</td>
                                    {Object.keys(row).map(k => (
                                      <td key={k} className="border px-2 py-1">{row[k]}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {m.html && <div className="main-chat-msg" dangerouslySetInnerHTML={{__html: m.html}} />}
                        {m.text && <p className="mb-0">{m.text}</p>}
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={i} className="chat-item-end mb-2 flex justify-end">
                  <div className="chat-list-inner flex items-end">
                    <div className="me-3 text-right">
                      <span className="chatting-user-info block mb-1">
                        <span className="msg-sent-time inline-flex items-center text-xs text-gray-500">
                          <i className="ri-check-double-line mr-1"></i>
                          {m.time.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                        </span> You
                      </span>
                      <div className="main-chat-msg">
                        <p className="mb-0">{m.text}</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            )}
            {isThinking && (
              isWebSearch ? (
                <li className="chat-item-start mb-2" key="web-search-loading">
                  <div className="chat-list-inner flex items-start">
                    <div className="ms-3">
                      <span className="chatting-user-info flex items-center mb-1">
                        <LottieLoader animationData={botAnimation} width={50} height={50} opacity={1} speed={1}/>
                        <span className="text-gray-500">Searching the web</span>
                        <i className="ri-earth-line animate-spin text-sky-800 ml-2"></i>
                      </span>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="chat-item-start mb-2" key="thinking">
                  <div className="chat-list-inner flex items-start">
                    <div className="ms-3">
                      <span className="chatting-user-info flex items-center mb-1">
                        <LottieLoader animationData={botAnimation} width={50} height={50} opacity={1} speed={1}/>
                        <span className="text-gray-500 animate-pulse">Thinking...</span>
                      </span>
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
        </PerfectScrollbar>
        <div className="chat-footer flex items-center p-2 border-t dark:border-defaultborder/10">
          <input
            className="form-control w-full !rounded-md"
            placeholder="Type your message here..."
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button onClick={toggleWebSearch} title="Web Search" className={`ti-btn ti-btn-icon !mx-2 ${isWebSearch ? "bg-blue text-white" : "ti-btn-info"}`}>
            <i className="ri-earth-line"></i>
          </button>
          <button onClick={startVoice} className={`ti-btn ti-btn-icon !mx-2 ti-btn-success ${listening ? "ring-2 ring-red-500 bg-red-100" : ""}`}>
            <i className={`ri-voiceprint-fill ${listening ? "animate-ping text-red-500 text-2xl" : ""}`}></i>
          </button>
          <button onClick={handleSend} className="ti-btn bg-primary text-white ti-btn-icon ti-btn-send">
            <i className="ri-send-plane-2-line"></i>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-bodybg border dark:border-defaultborder/10 rounded-md">
        <h4 className="text-center font-semibold text-sm py-2 border-b dark:border-defaultborder/10">Suggested</h4>
        <div className="p-3 flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendQuery(s, false)} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-left">
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatBot
