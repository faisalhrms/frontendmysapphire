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
    const subs =
      Array.isArray(hrSubtypes) && hrSubtypes.length ? hrSubtypes : ["policies"]
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

        // buffer of partial text between reads
        let buf = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buf += decoder.decode(value, { stream: true })
          // normalize CRLF → LF
          buf = buf.replace(/\r\n/g, "\n")

          let nl
          // process complete lines; keep remainder in buf
          while ((nl = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, nl)
            buf = buf.slice(nl + 1)

            const trimmed = line.trim()
            if (!trimmed) continue
            if (!trimmed.startsWith("data:")) continue

            const payload = trimmed.slice(5).trim()
            if (!payload) continue

            try {
              const ev = JSON.parse(payload)
              onEvent(ev)
            } catch {
              // ignore malformed events
            }
          }
        }

        // handle trailing line with no newline at end
        buf = buf.replace(/\r\n/g, "\n").trim()
        if (buf.startsWith("data:")) {
          const payload = buf.slice(5).trim()
          if (payload) {
            try {
              const ev = JSON.parse(payload)
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
