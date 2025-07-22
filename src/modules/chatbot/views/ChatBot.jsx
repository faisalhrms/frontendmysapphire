import React, {useState, useEffect, useRef} from "react"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import api from "@config/axiosConfig.js"

const suggestionsDefault = [
  "What are the total exports of bed linen in the last twelve months?",
  "What are the total exports of bed linen to Europe in the institutional segment in the last twelve months?",
  "Who are the top importers of Faisal Spinning Mills in Europe in the last twelve months? ",
  "Who are the top ten exporters of bed linen in the last twelve months? ",
  "What is the product-wise split of exports of bed linen to Europe in the last twelve months?",
]

const markdownToHtml = md => {
  md = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  const lines = md.split("\n")
  let html = ""
  for (let i = 0; i < lines.length;) {
    if (/\|.*\|/.test(lines[i])) {
      const header = lines[i].trim().split("|").filter(Boolean)
      html += "<table><thead><tr>"
      header.forEach(h => (html += `<th>${h.trim()}</th>`))
      html += "</tr></thead><tbody>"
      i += 2
      while (i < lines.length && /\|.*\|/.test(lines[i])) {
        const row = lines[i].trim().split("|").filter(Boolean)
        html += "<tr>"
        row.forEach(cell => (html += `<td>${cell.trim()}</td>`))
        html += "</tr>"
        i++
      }
      html += "</tbody></table>"
    } else {
      html += `<p>${lines[i]}</p>`
      i++
    }
  }
  return html
}

const speak = text => {
  const synth = window.speechSynthesis
  const utter = new SpeechSynthesisUtterance(text)
  synth.speak(utter)
}

const ChatBot = () => {
  const currentUser = useSelector(state => state.auth.user)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState(suggestionsDefault)
  const [listening, setListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const recognitionRef = useRef(null)

  const handleInit = () => {
    setMessages(p => [
      ...p,
      {type: "bot", html: markdownToHtml("How can I assist you with the export data?"), time: new Date()}
    ])
    speak("How can I assist you with the export data?")
    setSuggestions(suggestionsDefault)
  }

  const sendQuery = async msg => {
    setIsThinking(true)
    setMessages(p => [...p, {type: "user", text: msg, time: new Date()}])
    try {
      const res = await api.post("chat/query/", {query: msg})
      const d = res.data.response
      const now = new Date()
      if (Array.isArray(d)) {
        setMessages(p => [...p, {type: "bot", table: d, time: now}])
      } else if (d && typeof d === "object" && d.answer) {
        setMessages(p => [...p, {type: "bot", html: d.answer, time: now}])
      } else {
        setMessages(p => [...p, {type: "bot", html: markdownToHtml(String(d)), time: now}])
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
    sendQuery(msg)
  }

const startVoice = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return
  if (!recognitionRef.current) {
    const rec = new SR()
    rec.lang = "en-US"
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = e => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("")
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        sendQuery(transcript.trim())
        recognitionRef.current.stop()
      }
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
  }
  if (!listening) {
    recognitionRef.current.start()
    setListening(true)
  }
}



  useEffect(() => {
    handleInit()
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  return (
    <div className="main-chart-wrapper p-2 gap-4 lg:flex">
      <div className="main-chat-area border dark:border-defaultborder/10 ml-6">
        <div className="sm:flex items-center p-2 border-b dark:border-defaultborder/10">
          <div className="flex items-center leading-none ml-4">
            <div className="flex-grow">
              <p className="mb-1 font-semibold text-[.875rem]">
                <Link
                  to="#"
                  className="chatnameperson responsive-userinfo-open !text-defaulttextcolor dark:text-defaulttextcolor/70"
                >
                  Sapphire Sense AI Assistant
                </Link>
              </p>
              <p className="text-[#8c9097] dark:text-white/50 mb-0 chatpersonstatus !text-defaultsize">
                online
              </p>
            </div>
          </div>
          <div className="flex ms-auto">
            <button
              type="button"
              onClick={() => setMessages([])}
              className="ti-btn ti-btn-icon ti-btn-outline-light dark:border-defaultborder/10 !text-[0.95rem] !ms-2 font-semibold"
            >
              <i className="ri-refresh-line dark:text-defaulttextcolor/70"></i>
            </button>
          </div>
        </div>
        <PerfectScrollbar className="chat-content" id="main-chat-content">
          <ul className="list-none p-2">
            {messages.map((m, i) =>
              m.type === "bot" ? (
                <li className="chat-item-start mb-2" key={i}>
                  <div className="chat-list-inner flex items-start">
                    <div className="ms-3">
                      <span className="chatting-user-info flex items-center mb-1">
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
                        {m.html && <div dangerouslySetInnerHTML={{__html: m.html}} />}
                        {m.text && <p className="mb-0">{m.text}</p>}
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="chat-item-end mb-2 flex justify-end" key={i}>
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
              <li className="chat-item-start mb-2">
                <div className="chat-list-inner flex items-start">
                  <div className="ms-3">
                    <span className="chatting-user-info flex items-center mb-1">
                      <span className="chatnameperson">SappSense</span>
                      <span className="msg-sent-time ms-2 text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                      </span>
                    </span>
                    <div className="main-chat-msg">
                      <span className="text-gray-500 animate-pulse">Analyzing...</span>
                    </div>
                  </div>
                </div>
              </li>
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
          <button onClick={startVoice} className="ti-btn ti-btn-icon !mx-2 ti-btn-success">
            <i className="ri-voiceprint-fill"></i>
          </button>
          <button onClick={handleSend} className="ti-btn bg-primary text-white ti-btn-icon ti-btn-send">
            <i className="ri-send-plane-2-line"></i>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-bodybg border dark:border-defaultborder/10 rounded-md">
        <h4 className="text-center font-semibold text-sm py-2 border-b dark:border-defaultborder/10">
          Suggested
        </h4>
        <div className="p-3 flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendQuery(s)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatBot
