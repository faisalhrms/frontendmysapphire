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
  const recorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  const voiceModeRef = useRef(null)

  const normalizeHtml = raw => {
    const html = typeof raw === "string" ? raw : raw?.html ?? raw?.answer ?? raw?.response ?? JSON.stringify(raw)
    return html.replace(/<img\s/gi, "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ")
  }

const sendQuery = async (msg, webSearch) => {
  setIsThinking(true)
  setMessages(p => [...p, { type: "user", text: msg, time: new Date() }])
  setMessages(p => [...p, { type: "bot", loading: true, time: new Date() }])
  try {
    const mode = modeSelection === "Export Data" ? "export" : modeSelection.toLowerCase()
    const res = await ChatService.query(msg, webSearch, mode)
    const d = res?.data?.response
    const now = new Date()
    setMessages(p => {
      const base = p.slice(0, -1)
      if (Array.isArray(d)) return [...base, { type: "bot", table: d, time: now }]
      if (d && typeof d === "object" && (d.html || d.chart)) return [...base, { type: "bot", html: d.html || "", chart: d.chart || null, time: now }]
      return [...base, { type: "bot", html: (typeof d === "string" ? d : JSON.stringify(d)), time: now }]
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
          sendQuery(msg, isWebSearch)
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
          sendQuery(text, isWebSearch)
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
    const el = document.getElementById("chat-global-style")
    if (!el) {
      const style = document.createElement("style")
      style.id = "chat-global-style"
      style.innerHTML = `.main-chat-msg img{max-width:100%;height:auto;display:block;margin:.5rem 0;border-radius:.375rem}`
      document.head.appendChild(style)
    }
    return () => {
      try { recognitionRef.current?.stop() } catch {}
      try { recorderRef.current?.stop() } catch {}
      try { mediaStreamRef.current?.getTracks()?.forEach(t => t.stop()) } catch {}
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
    inputRef,
    handleSend,
    handleReset,
    toggleWebSearch,
    startVoice,
    autoResize,
  }
}
