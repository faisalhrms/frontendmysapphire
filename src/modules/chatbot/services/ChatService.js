import api from "@config/axiosConfig.js"
import store from "@redux/store.jsx"

const getCookie = name =>
  document.cookie
    .split("; ")
    .find(v => v.startsWith(name + "="))
    ?.split("=")[1] || ""

function buildHeaders() {
  const state = store.getState()
  const token = state?.auth?.tokens?.access_token
  const baseCommon = api.defaults.headers?.common || {}
  const basePost = api.defaults.headers?.post || {}

  const h = {
    ...baseCommon,
    ...basePost,
    "Content-Type": "application/json",
  }

  if (token) {
    h.Authorization = `Bearer ${token}`
  }

  const csrftoken = getCookie("csrftoken")
  if (csrftoken) {
    h["X-CSRFToken"] = csrftoken
  }

  return h
}

const ChatService = {
  resetMemory: () => api.post("chat/query/reset_memory/"),

  // always use stream: true
  streamQuery: async (msg, webSearch, mode, onChunk) => {
    const url = api.getUri({ url: "chat/query/" })
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      credentials: "include",
      body: JSON.stringify({ query: msg, web_search: webSearch, mode, stream: true })
    })

    if (!res.ok) {
      throw new Error("stream_http_error")
    }
    const ct = res.headers.get("content-type") || ""
    if (ct.startsWith("application/json")) {
      const { response } = await res.json()
      onChunk?.(response)
      return response
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ""
    let final = ""

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })

      let sep
      while ((sep = buf.indexOf("\n\n")) !== -1) {
        const raw = buf.slice(0, sep)
        buf = buf.slice(sep + 2)
        if (!raw || raw[0] === ":") continue

        const line = raw.startsWith("data:")
          ? raw.slice(5).trim()
          : raw.trim()
        if (!line) continue

        let ev
        try { ev = JSON.parse(line) } catch { continue }

        if (ev.type === "text" && typeof ev.data === "string") {
          onChunk?.(ev.data)
          final += ev.data
        } else if (typeof ev.chunk === "string") {
          onChunk?.(ev.chunk)
          final += ev.chunk
        } else if (ev.type === "done" || ev.done === true) {
          return final
        } else if (ev.type === "error") {
          throw new Error(ev.data || "stream_error")
        }
      }
    }


    return final.trim()
  }
}

export default ChatService
