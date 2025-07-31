import { useState, useRef, useEffect } from "react"
import ChatService from "@modules/chatbot/services/ChatService.js"

export default function useChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isBotActive, setIsBotActive] = useState(false)
  const [isWebSearch, setIsWebSearch] = useState(false)
  const [modeSelection, setModeSelection] = useState("Export Data")
  const [modeOpen, setModeOpen] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const inputRef = useRef(null)

  const normalizeHtml = raw => {
    const html = typeof raw === "string" ? raw : raw?.html ?? raw?.answer ?? raw?.response ?? JSON.stringify(raw)
    return html.replace(/<img\s/gi, "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ")
  }

  const sendQuery = async (msg, webSearch) => {
    setIsThinking(true)
    setMessages(p => [...p, { type: "user", text: msg, time: new Date() }])
    setMessages(p => [...p, { type: "bot", loading: true, time: new Date() }])
    try {
      const res = await ChatService.query(msg, webSearch)
      const d = res.data.response
      const now = new Date()
      setMessages(p => {
        const base = p.slice(0, -1)
        if (Array.isArray(d)) return [...base, { type: "bot", table: d, time: now }]
        return [...base, { type: "bot", html: normalizeHtml(d), time: now }]
      })
    } catch {
      setMessages(p => [...p.slice(0, -1), { type: "bot", text: "Network error", time: new Date() }])
    } finally {
      setIsThinking(false)
    }
  }

  const handleStartChat = () => {
    setIsBotActive(true)
    setMessages([])
  }

  const handleReset = async () => {
    try { await ChatService.resetMemory() } catch {}
    setIsBotActive(false)
    setMessages([])
    setInput("")
    setIsWebSearch(false)
  }

  const handleSend = () => {
    const msg = input.trim()
    if (!msg) return
    if (!isBotActive) handleStartChat()
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"
    sendQuery(msg, isWebSearch)
  }

  const autoResize = e => {
    const el = e.target
    el.style.height = "30px"
    el.style.height = el.scrollHeight + "px"
    setInput(el.value)
  }

  const toggleWebSearch = () => setIsWebSearch(p => !p)

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
        const text = finalTranscriptRef.current + interim
        setInput(text)
        if (inputRef.current) {
          const el = inputRef.current
          el.style.height = "30px"
          el.style.height = el.scrollHeight + "px"
        }
        if (e.results[e.results.length - 1].isFinal) rec.stop()
      }
      rec.onend = () => {
        setListening(false)
        const msg = (finalTranscriptRef.current || input).trim()
        if (msg) {
          if (!isBotActive) handleStartChat()
          sendQuery(msg, isWebSearch)
        }
        finalTranscriptRef.current = ""
        setInput("")
        if (inputRef.current) inputRef.current.style.height = "30px"
      }
      rec.onerror = () => setListening(false)
      recognitionRef.current = rec
    }
    if (!listening) {
      finalTranscriptRef.current = ""
      setInput("")
      if (inputRef.current) inputRef.current.style.height = "30px"
      recognitionRef.current.start()
    }
  }


  useEffect(() => {
    const el = document.getElementById("chat-global-style")
    if (!el) {
      const style = document.createElement("style")
      style.id = "chat-global-style"
      style.innerHTML = `.main-chat-msg img{max-width:100%;height:auto;display:block;margin:.5rem 0;border-radius:.375rem}`
      document.head.appendChild(style)
    }
    return () => recognitionRef.current?.stop()
  }, [])

  return {
    messages,
    input,
    setInput,
    listening,
    isThinking,
    isBotActive,
    isWebSearch,
    modeSelection,
    modeOpen,
    setModeSelection,
    setModeOpen,
    inputRef,
    handleSend,
    handleReset,
    toggleWebSearch,
    startVoice,
    autoResize
  }
}
