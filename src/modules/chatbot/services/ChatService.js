import api from "@config/axiosConfig.js"
import store from "@redux/store.jsx"

const abs = path => {
  const base = (api.defaults.baseURL || "").replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const baseAuthHeaders = () => {
  const token = store.getState()?.auth?.tokens?.access_token
  const h = {
    "Content-Type": "application/json"
  }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

const buildPayload = (
  msg,
  webSearch,
  mode,
  qcTarget,
  qcChecks,
  qcRender,
  hrSubtypes,
  competitorSites,
  competitorChecks
) => {
  const payload = { query: msg, web_search: webSearch, mode }

  if ((mode || "").toLowerCase() === "qc") {
    payload.qc_target = qcTarget || "https://pk.sapphireonline.pk"
    payload.qc_checks = Array.isArray(qcChecks) ? qcChecks : []
    payload.qc_model = "gpt-5-mini"
    payload.qc_render = !!qcRender
  }

  if ((mode || "").toLowerCase() === "hr") {
    const subs = Array.isArray(hrSubtypes) && hrSubtypes.length ? hrSubtypes : ["policies"]
    payload.hr_subtypes = subs
  }

  if ((mode || "").toLowerCase() === "competitors") {
    if (Array.isArray(competitorSites)) {
      payload.competitor_sites = competitorSites
    }
    if (Array.isArray(competitorChecks)) {
      payload.competitor_checks = competitorChecks
    }
  }

  return payload
}

const ChatService = {
  resetMemory: () => api.post("chat/query/reset_memory/"),

  query: (
    msg,
    webSearch,
    mode,
    qcTarget,
    qcChecks,
    qcRender,
    hrSubtypes,
    competitorSites,
    competitorChecks
  ) =>
    api.post(
      "chat/query/",
      buildPayload(
        msg,
        webSearch,
        mode,
        qcTarget,
        qcChecks,
        qcRender,
        hrSubtypes,
        competitorSites,
        competitorChecks
      ),
      { headers: baseAuthHeaders() }
    ),

  stream: ({
    msg,
    webSearch,
    mode,
    qcTarget,
    qcChecks,
    qcRender,
    hrSubtypes,
    competitorSites,
    competitorChecks,
    onEvent
  }) => {
    const ctrl = new AbortController()

    const run = async () => {
      try {
        const headers = {
          ...baseAuthHeaders(),
          Accept: "text/event-stream"
        }

        const res = await fetch(abs("chat/query/stream/"), {
          method: "POST",
          headers,
          body: JSON.stringify(
            buildPayload(
              msg,
              webSearch,
              mode,
              qcTarget,
              qcChecks,
              qcRender,
              hrSubtypes,
              competitorSites,
              competitorChecks
            )
          ),
          signal: ctrl.signal,
          credentials: "include",
          cache: "no-store"
        })

        if (!res.ok || !res.body) {
          let text = ""
          try {
            text = await res.text()
          } catch {}
          onEvent({ type: "error", message: text || `HTTP ${res.status}` })
          onEvent({ type: "done" })
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buf += decoder.decode(value, { stream: true })
          // normalize CRLF → LF so we can reliably split on "\n\n"
          buf = buf.replace(/\r\n/g, "\n")

          let idx
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const rawChunk = buf.slice(0, idx).trim()
            buf = buf.slice(idx + 2)

            if (!rawChunk.startsWith("data:")) continue
            const s = rawChunk.slice(5).trim()
            if (!s) continue

            try {
              const ev = JSON.parse(s)
              onEvent(ev)
            } catch {
            }
          }
        }

        buf = buf.replace(/\r\n/g, "\n").trim()
        if (buf.startsWith("data:")) {
          const s = buf.slice(5).trim()
          if (s) {
            try {
              const ev = JSON.parse(s)
              onEvent(ev)
            } catch {}
          }
        }

        onEvent({ type: "done" })
      } catch (err) {
        onEvent({ type: "error", message: String(err || "Network error") })
        onEvent({ type: "done" })
      }
    }

    run()
    return ctrl
  }
}

export default ChatService
