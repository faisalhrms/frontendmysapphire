import { useState, useRef, useEffect, useCallback } from "react"
import ChatService from "@modules/chatbot/services/ChatService.js"

const defaultExportSuggestions = [
  "Top 10 exporters of Bed by value_usd last 12 months bar chart",
  "Top ten institutional exporters of duvet to Europe in 2024 in value (USD)",
  "Yearly classification-wise split of bed linen exports in value USD",
]

const defaultAssetSuggestions = [
  "Count of devices without antivirus by location in a table",
  "Devices without VPN or corporate email configured grouped by device_type",
  "Top 10 locations by laptops missing antivirus",
  "List devices assigned to a specific user with ram_gb and hard_disk_gb",
]

const defaultHrPoliciesSuggestions = [
  "Give me fuel allowance of grade 11 and above",
  "What's travel policy of sapphire retail",
  "What's user account logout policy in days",
  "In case any it incident occur, to whome it should be reported?",
  "Is a G11 manager eligible for a laptop under the policy?",
]

const defaultHrPasSuggestions = [
  "Objectives status summary for my team this year",
  "List employees whose objectives are still pending submission this year",
  "Top 5 KRAs by total weightage for my team this year",
  "Objectives currently awaiting my approval in the workflow",
]

const defaultHrPmsSuggestions = [
  "List my open PMS tasks due this week",
  "Projects where I am project manager with delayed tasks",
  "PMS tasks assigned to me without due dates",
  "Tasks in my queue grouped by project",
]

const defaultHrEmployeeSuggestions = [
  "Show profile details of employee 2081",
  "Find employee by email faisal.rehman@sapphiretextiles.com.pk",
  "Who is the line manager of employee 2081",
  "Search employees in marketing department",
]

const defaultCompetitorSuggestions = [
  "Compare unstitched 3-piece suits under PKR 6000 across Sapphire, Khaadi and Nishat",
  "List top 20 ready to wear kurtas with prices from Sapphire, Khaadi and Nishat",
  "Which brand has the cheapest ready to wear kurtas under PKR 4000?",
  "Show unstitched lawn articles with prices side by side for all three brands",
]

const defaultCompetitorSites = [
  { id: 1, url: "https://pk.sapphireonline.pk", enabled: true },
  { id: 2, url: "https://pk.khaadi.com", enabled: true },
  { id: 3, url: "https://nishatlinen.com", enabled: true },
]

const defaultCompetitorChecks = [
  "unstiched",
  "ready_to_wear",
  "side_by_side",
  "per_site_snapshot",
]

export default function useChatBot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isBotActive, setIsBotActive] = useState(false)
  const [isWebSearch, setIsWebSearch] = useState(false)
  const [modeSelection, setModeSelection] = useState("Select Agent")
  const [modeOpen, setModeOpen] = useState(false)
  const [hrSubtypes, setHrSubtypes] = useState(["policies"])

  const defaultChecks = [
    "status_code",
    "title",
    "meta_description",
    "h1",
    "canonical",
    "viewport",
    "html_lang",
    "open_graph",
    "twitter_card",
    "robots",
    "sitemap",
    "images_alt_ratio",
    "ecommerce",
    "ecom_schema",
    "ecom_add_to_cart",
    "ecom_prices",
    "ecom_plp",
    "ecom_cart",
    "ecom_search",
    "security_headers",
    "broken_links",
  ]

  const [suggestions, setSuggestions] = useState(defaultExportSuggestions)
  const [qcTarget, setQcTarget] = useState("https://pk.sapphireonline.pk")
  const [qcChecks, setQcChecks] = useState(defaultChecks)
  const [qcRender, setQcRender] = useState(true)
  const [competitorSites, setCompetitorSites] = useState(defaultCompetitorSites)
  const [competitorChecks, setCompetitorChecks] =
    useState(defaultCompetitorChecks)

  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const inputRef = useRef(null)
  const recorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  const streamCtrlRef = useRef(null)
  const botIdxRef = useRef(-1)

  // streaming HTML buffer
  const pendingHtmlRef = useRef("")
  const flushTimerRef = useRef(0)
  const lastFlushTsRef = useRef(0)
  const rafTickRef = useRef(0)
  const [tick, setTick] = useState(0)
  const FLUSH_MIN_MS = 90

  const autoResize = useCallback((eOrEl, maxHeight = 240) => {
    const el = eOrEl?.target || eOrEl
    if (!el) return
    el.style.height = "0px"
    const newH = Math.min(el.scrollHeight, maxHeight)
    el.style.height = newH + "px"
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [])

  useEffect(() => {
    const sub = (hrSubtypes && hrSubtypes[0]) || "policies"
    let items = defaultExportSuggestions
    if (modeSelection === "IT Audit") {
      items = defaultAssetSuggestions
    } else if (modeSelection === "HR") {
      if (sub === "policies") items = defaultHrPoliciesSuggestions
      else if (sub === "pas") items = defaultHrPasSuggestions
      else if (sub === "pms") items = defaultHrPmsSuggestions
      else if (sub === "employee") items = defaultHrEmployeeSuggestions
      else items = defaultHrPoliciesSuggestions
    } else if (modeSelection === "Export Data") {
      items = defaultExportSuggestions
    } else if (modeSelection === "Competitor Pricing") {
      items = defaultCompetitorSuggestions
    }
    setSuggestions(items)
  }, [modeSelection, hrSubtypes])

  const normalizeHtml = raw => {
    const html =
      typeof raw === "string"
        ? raw
        : raw?.html ?? raw?.answer ?? raw?.response ?? JSON.stringify(raw)
    return html.replace(
      /<img\s/gi,
      "<img loading='lazy' referrerpolicy='no-referrer' style='max-width:100%;height:auto;border-radius:8px;display:block;margin:.5rem 0;' ",
    )
  }

  const normalizeStatus = l => {
    const s = String(l || "").trim()
    if (!s) return ""
    let capitalized = s.charAt(0).toUpperCase() + s.slice(1)
    const doneKeywords = ["ready", "complete", "all set"]
    if (doneKeywords.some(k => capitalized.toLowerCase().includes(k)))
      return capitalized
    if (capitalized.toLowerCase() === "searching")
      return "Searching the web"
    return capitalized
  }

  const pickMimeType = () => {
    if (window.MediaRecorder?.isTypeSupported?.("audio/webm;codecs=opus"))
      return "audio/webm;codecs=opus"
    if (window.MediaRecorder?.isTypeSupported?.("audio/webm"))
      return "audio/webm"
    if (window.MediaRecorder?.isTypeSupported?.("audio/ogg;codecs=opus"))
      return "audio/ogg;codecs=opus"
    if (window.MediaRecorder?.isTypeSupported?.("audio/mp4"))
      return "audio/mp4"
    if (window.MediaRecorder?.isTypeSupported?.("audio/aac"))
      return "audio/aac"
    return ""
  }

  const stopSpeechRecognition = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {}
    setListening(false)
  }, [])

  const stopRecording = () => {
    try {
      recorderRef.current?.stop()
    } catch {}
    try {
      mediaStreamRef.current?.getTracks()?.forEach(t => t.stop())
    } catch {}
    recorderRef.current = null
    mediaStreamRef.current = null
  }

  const doTranscribe = async blob => {
    const fd = new FormData()
    const ext = blob.type.includes("mp4")
      ? "m4a"
      : blob.type.includes("aac")
        ? "aac"
        : "webm"
    fd.append("file", blob, `voice.${ext}`)
    fd.append("mime", blob.type || "application/octet-stream")
    let res
    try {
      if (typeof ChatService.transcribe === "function")
        res = await ChatService.transcribe(fd)
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
          if (e.results[i].isFinal)
            finalTranscriptRef.current += e.results[i][0].transcript
          else interim += e.results[i][0].transcript
        }
        const text = (finalTranscriptRef.current + interim).trim()
        setInput(text)
        if (inputRef.current) {
          const el = inputRef.current
          el.style.height = "30px"
          el.style.height = el.scrollHeight + "px"
        }
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
    try {
      recognitionRef.current.start()
    } catch {}
    return true
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)
      return false
    const mime = pickMimeType()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      mediaStreamRef.current = stream
      chunksRef.current = []
      const rec = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined,
      )
      rec.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstart = () => setListening(true)
      rec.onstop = async () => {
        setListening(false)
        const blob = new Blob(chunksRef.current, {
          type: mime || "application/octet-stream",
        })
        chunksRef.current = []
        const text = (await doTranscribe(blob))?.trim()
        if (text) {
          if (!isBotActive) handleStartChat()
          startStream(text)
        } else {
          setMessages(p => [
            ...p,
            {
              type: "bot",
              text: "Voice transcription failed",
              time: new Date(),
            },
          ])
        }
      }
      recorderRef.current = rec
      rec.start()
      return true
    } catch {
      return false
    }
  }

  const splitPendingHtml = (html) => {
    const lastOpen = html.lastIndexOf("<")
    const lastClose = html.lastIndexOf(">")
    if (lastOpen > lastClose) {
      return { flushText: html.slice(0, lastOpen), remainder: html.slice(lastOpen) }
    }
    return { flushText: html, remainder: "" }
  }

  const flushPending = (i, { force = false } = {}) => {
    const p = pendingHtmlRef.current
    if (!p) return
    const { flushText, remainder } = force ? { flushText: p, remainder: "" } : splitPendingHtml(p)
    if (!flushText) {
      pendingHtmlRef.current = remainder || p
      return
    }
    pendingHtmlRef.current = remainder
    lastFlushTsRef.current = performance.now()

    setMessages(prev => {
      const c = [...prev]
      if (!c[i]) return prev
      c[i] = { ...c[i], html: (c[i].html || "") + flushText }
      return c
    })

    if (!rafTickRef.current) {
      rafTickRef.current = requestAnimationFrame(() => {
        setTick(t => t + 1)
        rafTickRef.current = 0
      })
    }
  }

  const scheduleFlush = i => {
    if (flushTimerRef.current) return
    const now = performance.now()
    const delay = Math.max(0, FLUSH_MIN_MS - (now - lastFlushTsRef.current))

    flushTimerRef.current = window.setTimeout(() => {
      flushTimerRef.current = 0
      flushPending(i)
    }, delay)
  }

  const onDeltaChunk = (i, text) => {
    pendingHtmlRef.current += text
    scheduleFlush(i)
  }

  const flushAll = i => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = 0
    }
    flushPending(i, { force: true })
  }

  const startStream = msg => {
    setIsThinking(true)

    try {
      streamCtrlRef.current?.abort()
    } catch {}

    setMessages(prev => {
      const now = new Date()
      const mode =
        modeSelection === "Export Data"
          ? "export"
          : modeSelection === "Salesforce"
            ? "salesforce"
            : modeSelection === "Quality Control"
              ? "qc"
              : modeSelection === "HR"
                ? "hr"
                : modeSelection === "IT Audit"
                  ? "assets"
                  : modeSelection === "Competitor Pricing"
                    ? "competitors"
                    : ""

      const next = [
        ...prev,
        { type: "user", text: msg, time: now },
        {
          type: "bot",
          loading: true,
          time: new Date(),
          html: "",
          chart: null,
          latestStatus: null,
          error: null,
          mode,
          statuses: [],
          qc: null,
          qcLlm: null,
          employee: null,
          employee_candidates: null,
          attendance: null,
        },
      ]
      botIdxRef.current = next.length - 1
      return next
    })

    const mode =
      modeSelection === "Export Data"
        ? "export"
        : modeSelection === "Salesforce"
          ? "salesforce"
          : modeSelection === "Quality Control"
            ? "qc"
            : modeSelection === "HR"
              ? "hr"
              : modeSelection === "IT Audit"
                ? "assets"
                : modeSelection === "Competitor Pricing"
                  ? "competitors"
                  : ""

    const enabledCompetitorSites = (competitorSites || [])
      .filter(
        s => s && s.enabled && typeof s.url === "string" && s.url.trim(),
      )
      .map(s => s.url.trim())

    const safeCompetitorChecks = Array.isArray(competitorChecks)
      ? competitorChecks
      : []

    // reset streaming buffer
    pendingHtmlRef.current = ""
    lastFlushTsRef.current = 0
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = 0
    }

    streamCtrlRef.current = ChatService.stream({
      msg,
      webSearch: isWebSearch,
      mode,
      qcTarget,
      qcChecks,
      qcRender,
      hrSubtypes,
      competitorSites: enabledCompetitorSites,
      competitorChecks: safeCompetitorChecks,
      onEvent: ev => {
        const i = botIdxRef.current
        if (i < 0) return

        if (ev.type === "status") {
          const text = normalizeStatus(ev.label)
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              statuses: [...(c[i].statuses || []), text],
              latestStatus: text,
            }
            return c
          })
        } else if (ev.type === "delta") {
          const chunk = ev.text || ""
          if (!chunk) return
          onDeltaChunk(i, chunk)
        } else if (ev.type === "chart") {
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = { ...c[i], chart: ev.spec }
            return c
          })
        } else if (ev.type === "qc_result") {
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = { ...c[i], qc: ev.result }
            return c
          })
        } else if (ev.type === "qc_llm") {
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = { ...c[i], qcLlm: ev.html }
            return c
          })
        } else if (ev.type === "employee") {
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              employee: ev.data,
              employee_candidates: null,
            }
            return c
          })
        } else if (ev.type === "employee_candidates") {
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              employee_candidates: ev.items,
              employee: null,
            }
            return c
          })
        } else if (ev.type === "attendance") {
          // store raw payload and force mode to 'hr'
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              mode: c[i].mode || "hr",
              attendance: ev.data,
            }
            return c
          })
        } else if (ev.type === "final") {
          flushAll(i)
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              html: normalizeHtml(ev.html),
              latestStatus: null,
            }
            return c
          })
        } else if (ev.type === "suggestions") {
          const items = Array.isArray(ev.items)
            ? ev.items.slice(0, 4)
            : []
          if (items.length) setSuggestions(items)
        } else if (ev.type === "error") {
          flushAll(i)
          setIsThinking(false)
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = {
              ...c[i],
              loading: false,
              latestStatus: null,
              error: ev.message || "Something went wrong",
            }
            return c
          })
        } else if (ev.type === "done") {
          flushAll(i)
          setIsThinking(false)
          setMessages(prev => {
            const c = [...prev]
            if (!c[i]) return prev
            c[i] = { ...c[i], loading: false }
            return c
          })
        }
      },
    })
  }

  const handleStartChat = () => {
    setIsBotActive(true)
    setMessages([])
  }

  const ask = msg => {
    if (!msg) return
    if (!isBotActive) handleStartChat()
    startStream(msg)
  }

  const handleReset = async () => {
    try {
      await ChatService.resetMemory()
    } catch {}
    try {
      streamCtrlRef.current?.abort()
    } catch {}
    stopSpeechRecognition()
    stopRecording()
    setIsBotActive(false)
    setMessages([])
    setInput("")
    setIsWebSearch(false)
    setModeSelection("Select Agent")
    setQcTarget("https://pk.sapphireonline.pk")
    setQcChecks(defaultChecks)
    setQcRender(true)
    setHrSubtypes(["policies"])
    setCompetitorSites(defaultCompetitorSites)
    setCompetitorChecks(defaultCompetitorChecks)
    botIdxRef.current = -1
    pendingHtmlRef.current = ""
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = 0
    }
    if (inputRef.current) autoResize(inputRef.current)
  }

  const handleSend = () => {
    const msg =
      input.trim() ||
      (modeSelection === "Quality Control"
        ? "Run QC"
        : modeSelection === "Competitor Pricing"
          ? "Run competitor pricing comparison"
          : "")
    if (!msg) return
    if (!isBotActive) handleStartChat()
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
    startStream(msg)
  }

  const toggleWebSearch = () => setIsWebSearch(p => !p)

  useEffect(() => {
    return () => {
      try {
        stopSpeechRecognition()
      } catch {}
      try {
        stopRecording()
      } catch {}
      try {
        streamCtrlRef.current?.abort()
      } catch {}
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current)
        flushTimerRef.current = 0
      }
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
    competitorSites,
    setCompetitorSites,
    competitorChecks,
    setCompetitorChecks,
    inputRef,
    handleSend,
    handleReset,
    toggleWebSearch,
    startVoice: startSpeechRecognition,
    stopSpeechRecognition,
    autoResize,
    ask,
    suggestions,
    hrSubtypes,
    setHrSubtypes,
    tick,
  }
}
