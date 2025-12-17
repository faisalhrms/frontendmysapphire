import api from "@config/axiosConfig.js"
import store from "@redux/store.jsx"
import { logout } from "@modules/auth/redux/authSlice.js"

const abs = path => {
  const base = (api.defaults.baseURL || "").replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}

const buildAuthHeaders = () => {
  const state = store.getState()
  const token = state?.auth?.tokens?.access_token

  const headers = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else {
    window.location.href = "/"
  }

  return headers
}

const handleAuthStatus = status => {
  if (status === 401) {
    store.dispatch(logout())
    window.location.href = "/"
    throw new Error("Unauthorized. Redirecting to login.")
  }

  if (status === 403) {
    window.location.href = "/error/403"
    throw new Error("Permission Denied.")
  }

  if (status === 419) {
    window.location.href = `${import.meta.env.BASE_URL}change-password`
    throw new Error("Password Expired.")
  }
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
  competitorChecks,
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
    competitorChecks,
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
        competitorChecks,
      ),
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
    onEvent,
  }) => {
    const ctrl = new AbortController()

    const run = async () => {
      try {
        const headers = {
          ...buildAuthHeaders(),
          Accept: "text/event-stream",
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
              competitorChecks,
            ),
          ),
          signal: ctrl.signal,
          credentials: "include",
          cache: "no-store",
        })

        if (!res.ok) {
          handleAuthStatus(res.status)

          let text = ""
          try {
            text = await res.text()
          } catch {
          }
          onEvent({ type: "error", message: text || `HTTP ${res.status}` })
          onEvent({ type: "done" })
          return
        }

        if (!res.body) {
          onEvent({
            type: "error",
            message: "Streaming not supported by the browser/response.",
          })
          onEvent({ type: "done" })
          return
        }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let buffer = ""

      const emitSseBlock = (block) => {
        const lines = block.split(/\r?\n/)
        const dataLines = []

        for (const line of lines) {
          if (!line) continue
          if (line.startsWith(":")) continue
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart())
        }

        if (!dataLines.length) return
        const data = dataLines.join("\n")

        try {
          onEvent(JSON.parse(data))
        } catch (e) {
          console.error("Failed to parse SSE data:", data, e)
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        while (true) {
          const idx = buffer.search(/\r?\n\r?\n/)
          if (idx === -1) break

          const delimMatch = buffer.slice(idx).match(/^\r?\n\r?\n/)
          const delimLen = delimMatch ? delimMatch[0].length : 2

          const block = buffer.slice(0, idx)
          buffer = buffer.slice(idx + delimLen)

          emitSseBlock(block)
        }
      }

      onEvent({ type: "done" })


      } catch (err) {
        if (err.name !== 'AbortError') {
          onEvent({ type: "error", message: String(err || "Network error") })
        }
        onEvent({ type: "done" })
      }
    }

    run()
    return ctrl
  },
}

export default ChatService