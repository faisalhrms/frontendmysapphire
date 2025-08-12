import { useState, useRef, useEffect, useMemo } from "react"
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
  const [streamTick, setStreamTick] = useState(0)
  const [dockH, setDockH] = useState(112)

  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const lastBotIdRef = useRef(null)
  const previewTimerRef = useRef(null)
  const accRef = useRef("")
  const mountedRef = useRef(false)
  const dockRef = useRef(null)
  const psRef = useRef(null)
  const endRef = useRef(null)

  const normalizeHtml = raw => {
    const html = typeof raw === "string" ? raw : raw?.html ?? raw?.answer ?? raw?.response ?? ""
    return html.replace(/<img\s/gi, "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ")
  }

  const htmlPreview = raw => {
    if (!raw) return ""
    const safe = raw.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]*$/, "")
    const div = document.createElement("div")
    div.innerHTML = safe
    const txt = div.textContent || ""
    return txt.trim()
  }

  const flushPreview = () => {
    if (!mountedRef.current) return
    const id = lastBotIdRef.current
    if (!id) return
    const preview = htmlPreview(accRef.current)
    setMessages(prev => {
      const arr = [...prev]
      const idx = arr.findIndex(x => x.id === id)
      if (idx !== -1) {
        const m = arr[idx]
        arr[idx] = { ...m, loading: true, preview: true, text: preview || "…", time: m.time }
      }
      return arr
    })
    setStreamTick(t => t + 1)
  }

  const scheduleFlush = () => {
    if (previewTimerRef.current) return
    previewTimerRef.current = setTimeout(() => {
      previewTimerRef.current = null
      flushPreview()
    }, 100)
  }

  const sendQuery = async (msg, webSearch) => {
    setIsThinking(true)
    const now = new Date()
    const botId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
    setMessages(p => [...p, { type: "user", text: msg, time: now }])
    setMessages(p => [...p, { id: botId, type: "bot", loading: true, preview: true, text: "", time: new Date() }])
    lastBotIdRef.current = botId
    accRef.current = ""
    try {
      const mode = modeSelection === "Export Data" ? "export" : modeSelection.toLowerCase()
      const onChunk = chunk => { accRef.current += chunk; scheduleFlush() }
      const final = await ChatService.streamQuery(msg, webSearch, mode, onChunk)
      if (!mountedRef.current) return
      setMessages(prev => {
        const arr = [...prev]
        const idx = arr.findIndex(x => x.id === botId)
        if (idx !== -1) {
          const m = arr[idx]
          if (/<[a-z][\s\S]*>/i.test(final)) {
            arr[idx] = { ...m, loading: false, preview: false, html: normalizeHtml(final), text: undefined }
          } else {
            arr[idx] = { ...m, loading: false, preview: false, text: final || htmlPreview(accRef.current) }
          }
        }
        return arr
      })
    } catch {
      if (!mountedRef.current) return
      setMessages(p => [...p.slice(0, -1), { type: "bot", text: "Network error", time: new Date() }])
    } finally {
      if (!mountedRef.current) return
      setIsThinking(false)
      accRef.current = ""
      if (previewTimerRef.current) { clearTimeout(previewTimerRef.current); previewTimerRef.current = null }
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
    if (isThinking) return
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
    mountedRef.current = true
    const el = document.getElementById("chat-global-style")
    if (!el) {
      const style = document.createElement("style")
      style.id = "chat-global-style"
      style.innerHTML = `.main-chat-msg img{max-width:100%;height:auto;display:block;margin:.5rem 0;border-radius:.375rem}`
      document.head.appendChild(style)
    }
    const onResize = () => setDockH(dockRef.current ? dockRef.current.offsetHeight : 112)
    onResize()
    const ro = new ResizeObserver(onResize)
    if (dockRef.current) ro.observe(dockRef.current)
    return () => {
      mountedRef.current = false
      recognitionRef.current?.stop()
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
      ro.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const scrollToBottom = smooth => {
    const c = psRef.current
    if (c) c.scrollTop = c.scrollHeight
    if (endRef.current) endRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" })
  }

  useEffect(() => {
    scrollToBottom(false)
  }, [])

  useEffect(() => {
    scrollToBottom(true)
  }, [messages.length, isThinking, isWebSearch, streamTick])

  const hasLoadingBot = useMemo(() => messages.some(m => m.type === "bot" && m.loading), [messages])

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
    autoResize,
    streamTick,
    hasLoadingBot,
    dockRef,
    dockH,
    psRef,
    endRef
  }
}
