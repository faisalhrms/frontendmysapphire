import { useState, useRef, useEffect, useCallback } from "react"
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

  const defaultChecks = [
    "status_code","title","meta_description","h1",
    "canonical","viewport","html_lang",
    "open_graph","twitter_card",
    "robots","sitemap",
    "images_alt_ratio",
    "ecommerce","ecom_schema","ecom_add_to_cart","ecom_prices","ecom_plp","ecom_cart","ecom_search",
    "security_headers",
    "broken_links"
  ]

  const [qcTarget, setQcTarget] = useState("https://pk.sapphireonline.pk")
  const [qcChecks, setQcChecks] = useState(defaultChecks)
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

  const autoResize = useCallback((eOrEl) => {
    const el = eOrEl?.target || eOrEl
    if (!el) return
    el.style.height = "0px"
    el.style.height = el.scrollHeight + "px"
  }, [])

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

  const ensureRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current
    if (typeof window === "undefined") return null
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return null
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = "en-US"
    rec.onresult = (e) => {
      let interim = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += chunk + " "
        } else {
          interim += chunk
        }
      }
      const next = (finalTranscriptRef.current + interim).trim()
      setInput(next)
      if (inputRef.current) autoResize(inputRef.current)
    }
    rec.onend = () => { setListening(false) }
    recognitionRef.current = rec
    return rec
  }

  const stopSpeechRecognition = useCallback(() => {
    try { recognitionRef.current?.stop() } catch {}
    setListening(false)
  }, [])

  const startVoice = useCallback(() => {
    const rec = ensureRecognition()
    if (!rec) return
    if (listening) {
      stopSpeechRecognition()
      return
    }
    finalTranscriptRef.current = input
    setListening(true)
    try { rec.start() } catch {}
  }, [ensureRecognition, input, listening, stopSpeechRecognition])

  const startStream = (msg) => {
    setIsThinking(true)
    setMessages(prev => {
      const now = new Date()
      const mode =
        modeSelection === "Export Data" ? "export" :
        modeSelection === "Salesforce" ? "salesforce" :
        modeSelection === "Quality Control" ? "qc" : ""
      const next = [
        ...prev,
        { type: "user", text: msg, time: now },
        { type: "bot", loading: true, time: new Date(), html: "", chart: null, latestStatus: isWebSearch ? "Searching the web " : "Thinking ", error: null, mode }
      ]
      botIdxRef.current = next.length - 1
      return next
    })

    const mode =
      modeSelection === "Export Data" ? "export" :
      modeSelection === "Salesforce" ? "salesforce" :
      modeSelection === "Quality Control" ? "qc" : ""

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

        } else if (ev.type === "qc_result") {
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], qc: ev.result }
            return c
          })

        } else if (ev.type === "qc_llm") {
          setMessages(prev => {
            const c = [...prev]; if (!c[i]) return prev
            c[i] = { ...c[i], qcLlm: ev.html }
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
    stopSpeechRecognition()
    setIsBotActive(false)
    setMessages([])
    setInput("")
    setIsWebSearch(false)
    setModeSelection("Select Source")
    setQcTarget("https://pk.sapphireonline.pk")
    setQcChecks(defaultChecks)
    setQcRender(true)
    botIdxRef.current = -1
    if (inputRef.current) autoResize(inputRef.current)
  }

  const handleSend = () => {
    const msg = input.trim() || (modeSelection === "Quality Control" ? "Run QC" : "")
    if (!msg) return
    if (!isBotActive) handleStartChat()
    setInput("")
    if (inputRef.current) { inputRef.current.style.height = "auto" }
    startStream(msg)
  }

  const toggleWebSearch = () => setIsWebSearch(p => !p)

  const stopRecording = () => {
    try { recorderRef.current?.stop() } catch {}
    try { mediaStreamRef.current?.getTracks()?.forEach(t => t.stop()) } catch {}
  }

  useEffect(() => {
    return () => {
      try { stopSpeechRecognition() } catch {}
      try { stopRecording() } catch {}
      try { streamCtrlRef.current?.abort() } catch {}
    }
  }, [stopSpeechRecognition])

  useEffect(() => {
    if (inputRef.current) autoResize(inputRef.current)
  }, [autoResize, isBotActive, modeSelection])

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
    startVoice,
    stopSpeechRecognition,
    autoResize,
    tick
  }
}
