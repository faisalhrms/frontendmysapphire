import api from "@config/axiosConfig.js"
import store from "@redux/store.jsx"

const abs = (path) => {
  const base = (api.defaults.baseURL || "").replace(/\/$/, "")
  return `${base}/${path.replace(/^\//, "")}`
}
const authHeaders = () => {
  const token = store.getState()?.auth?.tokens?.access_token
  const h = { "Content-Type": "application/json" }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}
const buildPayload = (msg, webSearch, mode, qcTarget, qcChecks, qcRender, hrSubtypes) => {
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
  return payload
}
const ChatService = {
  resetMemory: () => api.post("chat/query/reset_memory/"),
  query: (msg, webSearch, mode, qcTarget, qcChecks, qcRender, hrSubtypes) =>
    api.post("chat/query/", buildPayload(msg, webSearch, mode, qcTarget, qcChecks, qcRender, hrSubtypes)),
  stream: ({ msg, webSearch, mode, qcTarget, qcChecks, qcRender, hrSubtypes, onEvent }) => {
    const ctrl = new AbortController()
    const run = async () => {
      try {
        const res = await fetch(abs("chat/query/stream/"), {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(buildPayload(msg, webSearch, mode, qcTarget, qcChecks, qcRender, hrSubtypes)),
          signal: ctrl.signal,
          credentials: "include"
        })
        if (!res.ok || !res.body) {
          let text = ""
          try { text = await res.text() } catch {}
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
          let idx
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const chunk = buf.slice(0, idx).trim()
            buf = buf.slice(idx + 2)
            if (chunk.startsWith("data:")) {
              const s = chunk.slice(5).trim()
              try { onEvent(JSON.parse(s)) } catch {}
            }
            await new Promise(requestAnimationFrame)
          }
        }
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
