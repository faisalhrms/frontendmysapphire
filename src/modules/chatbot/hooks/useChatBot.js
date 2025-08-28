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

  const pickMimeType = () => {
    if (window.MediaRecorder?.isTypeSupported?.("audio/webm;codecs=opus")) return "audio/webm;codecs=opus"
    if (window.MediaRecorder?.isTypeSupported?.("audio/webm")) return "audio/webm"
    if (window.MediaRecorder?.isTypeSupported?.("audio/ogg;codecs=opus")) return "audio/ogg;codecs=opus"
    if (window.MediaRecorder?.isTypeSupported?.("audio/mp4")) return "audio/mp4"
    if (window.MediaRecorder?.isTypeSupported?.("audio/aac")) return "audio/aac"
    return ""
  }

  const stopSpeechRecognition = () => { try { recognitionRef.current?.stop() } catch {} }
  const stopRecording = () => {
    try { recorderRef.current?.stop() } catch {}
    try { mediaStreamRef.current?.getTracks()?.forEach(t => t.stop()) } catch {}
    recorderRef.current = null
    mediaStreamRef.current = null
  }

  const doTranscribe = async blob => {
    const fd = new FormData()
    const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("aac") ? "aac" : "webm"
    fd.append("file", blob, `voice.${ext}`)
    fd.append("mime", blob.type || "application/octet-stream")
    let res
    try {
      if (typeof ChatService.transcribe === "function") res = await ChatService.transcribe(fd)
      else res = await fetch("/api/transcribe", { method: "POST", body: fd })
    } catch {
      return ""
    }
    try {
      const data = res?.data ?? (await res.json?.())
      return data?.text ?? data?.transcript ?? data?.result ?? ""
    } catch {
      return ""
    }
  }

  const startSpeechRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return false
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
          startStream(msg)
        }
        finalTranscriptRef.current = ""
        setInput("")
        if (inputRef.current) inputRef.current.style.height = "30px"
      }
      rec.onerror = () => setListening(false)
      recognitionRef.current = rec
    }
    finalTranscriptRef.current = ""
    setInput("")
    if (inputRef.current) inputRef.current.style.height = "30px"
    recognitionRef.current.start()
    return true
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return false
    const mime = pickMimeType()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      mediaStreamRef.current = stream
      chunksRef.current = []
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      rec.ondataavailable = e => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstart = () => setListening(true)
      rec.onstop = async () => {
        setListening(false)
        const blob = new Blob(chunksRef.current, { type: mime || "application/octet-stream" })
        chunksRef.current = []
        const text = (await doTranscribe(blob))?.trim()
        if (text) {
          if (!isBotActive) handleStartChat()
          startStream(text)
        } else {
          setMessages(p => [...p, { type: "bot", text: "Voice transcription failed", time: new Date() }])
        }
      }
      recorderRef.current = rec
      rec.start()
      return true
    } catch {
      return false
    }
  }

  const startVoice = async () => {
    if (listening) {
      if (voiceModeRef.current === "speech") stopSpeechRecognition()
      else if (voiceModeRef.current === "record") stopRecording()
      return
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isSafari) {
      if (await startRecording()) { voiceModeRef.current = "record"; return }
      setMessages(p => [...p, { type: "bot", text: "Voice input not supported. Use Chrome or give microphone access over HTTPS.", time: new Date() }])
      return
    }
    if (startSpeechRecognition()) { voiceModeRef.current = "speech"; return }
    if (await startRecording()) { voiceModeRef.current = "record"; return }
    setMessages(p => [...p, { type: "bot", text: "Voice input not supported. Use Chrome or give microphone access over HTTPS.", time: new Date() }])
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
    startVoice,
    autoResize,
    tick
  }
}
