import { useState, useRef, useEffect } from "react"
import ChatService from "@modules/chatbot/services/ChatService.js"

export default function useChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isBotActive, setIsBotActive] = useState(false)
  const [isWebSearch, setIsWebSearch] = useState(false)
  const [modeSelection, setModeSelection] = useState("Select Source")
  const [modeOpen, setModeOpen] = useState(false)
  const [qcTarget, setQcTarget] = useState("https://pk.sapphireonline.pk")
  const [qcChecks, setQcChecks] = useState(["status_code","title","meta_description","h1","images_alt_ratio","jsonld","viewport","html_lang","ecommerce","ecom_schema","ecom_add_to_cart","ecom_prices","ecom_plp","ecom_cart"])
  const [qcRender, setQcRender] = useState(true)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const inputRef = useRef(null)
  const recorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  const voiceModeRef = useRef(null)
  const streamCtrlRef = useRef(null)
  const botIdxRef = useRef(-1)
  const [tick, setTick] = useState(0)

  const normalizeHtml = raw => {
    const html = typeof raw === "string" ? raw : raw?.html ?? raw?.answer ?? raw?.response ?? JSON.stringify(raw)
    return html.replace(/<img\s/gi, "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ")
  }
  const normalizeStatus = l => {
    const s = String(l || "").toLowerCase()
    if (s === "thinking") return "Thinking "
    if (s === "searching") return "Searching the web "
    if (s.startsWith("running ")) return `Calling ${l.slice(8)}`
    return l
  }

  const startStream = (msg) => {
    setIsThinking(true)
    setMessages(prev => {
      const now = new Date()
      const mode = modeSelection === "Export Data" ? "export" : modeSelection === "Salesforce" ? "salesforce" : modeSelection === "Quality Control" ? "qc" : ""
      const next = [...prev, { type: "user", text: msg, time: now }, { type: "bot", loading: true, time: new Date(), html: "", chart: null, latestStatus: isWebSearch ? "Searching the web " : "Thinking ", error: null, mode }]
      botIdxRef.current = next.length - 1
      return next
    })
    const mode = modeSelection === "Export Data" ? "export" : modeSelection === "Salesforce" ? "salesforce" : modeSelection === "Quality Control" ? "qc" : ""
    streamCtrlRef.current = ChatService.stream({
      msg,
      webSearch: isWebSearch,
      mode,
      qcTarget,
      qcChecks,
      qcRender,
      onEvent: ev => {
        const i = botIdxRef.current
        if (i < 0) return
        if (ev.type === "status") {
          const text = normalizeStatus(ev.label)
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], latestStatus: text }
            return c
          })
        } else if (ev.type === "delta") {
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], html: (c[i].html || "") + ev.text }
            return c
          })
          setTick(t => t + 1)
        } else if (ev.type === "chart") {
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], chart: ev.spec }
            return c
          })
        } else if (ev.type === "final") {
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], html: normalizeHtml(ev.html), latestStatus: null }
            return c
          })
        } else if (ev.type === "error") {
          setIsThinking(false)
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], loading: false, latestStatus: null, error: ev.message || "Something went wrong" }
            return c
          })
        } else if (ev.type === "done") {
          setIsThinking(false)
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], loading: false }
            return c
          })
        }
      }
    })
  }

  const handleStartChat = () => {
    setIsBotActive(true)
    setMessages([])
  }

  const handleReset = async () => {
    try { await ChatService.resetMemory() } catch {}
    try { streamCtrlRef.current?.abort() } catch {}
    setIsBotActive(false)
    setMessages([])
    setInput("")
    setIsWebSearch(false)
    setModeSelection("Select Source")
    setQcTarget("https://pk.sapphireonline.pk")
    setQcChecks(["status_code","title","meta_description","h1","images_alt_ratio","jsonld","viewport","html_lang","ecommerce","ecom_schema","ecom_add_to_cart","ecom_prices","ecom_plp","ecom_cart"])
    setQcRender(true)
    botIdxRef.current = -1
  }

  const handleSend = () => {
    const msg = input.trim() || (modeSelection === "Quality Control" ? "Run QC" : "")
    if (!msg) return
    if (!isBotActive) handleStartChat()
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "auto"
    startStream(msg)
  }

  const autoResize = e => {
    const el = e.target
    el.style.height = "30px"
    el.style.height = el.scrollHeight + "px"
    setInput(el.value)
  }

  const toggleWebSearch = () => setIsWebSearch(p => !p)

  const stopSpeechRecognition = () => { try { recognitionRef.current?.stop() } catch {} }
  const stopRecording = () => {
    try { recorderRef.current?.stop() } catch {}
    try { mediaStreamRef.current?.getTracks()?.forEach(t => t.stop()) } catch {}
  }

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop() } catch {}
      try { stopRecording() } catch {}
      try { streamCtrlRef.current?.abort() } catch {}
    }
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
    qcTarget,
    setQcTarget,
    qcChecks,
    setQcChecks,
    qcRender,
    setQcRender,
    inputRef,
    handleSend,
    handleReset,
    toggleWebSearch,
    tick
  }
}
