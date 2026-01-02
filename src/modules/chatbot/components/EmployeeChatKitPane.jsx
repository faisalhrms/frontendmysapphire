import React, { useCallback, useMemo, useRef, useEffect } from "react"
import { ChatKit, useChatKit } from "@openai/chatkit-react"
import api from "@config/axiosConfig.js"
import {
  createEmployeeChatSession,
  attendanceQueryTool,
  attendanceResolveTool,
  employeeSearchTool,
  employeeGetTool,
  employeeQueryTool,
  chatkitWidgetActionTool,
} from "@modules/chatbot/services/EmployeeChatKitService.js"

function parseExpiresAt(v) {
  if (!v) return 0
  if (typeof v === "number") return v
  const ms = Date.parse(String(v))
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : 0
}

function normalizeUrl(url) {
  if (!url) return null
  return String(url)
}

async function downloadWithAxios(url, filename) {
  const res = await api.get(url, { responseType: "blob" })

  const contentType =
    res?.headers?.["content-type"] ||
    "application/octet-stream"

  const blob = new Blob([res.data], { type: contentType })
  const href = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = href
  a.download = filename || "download"
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(href)
}

export default function EmployeeChatKitPane({ onReady: onChatReady }) {
  const chatkitRef = useRef(null)

  const sessionRef = useRef({
    secret: null,
    expiresAt: 0,
    pending: null,
  })

  const getClientSecret = useCallback(async (existingClientSecret = null) => {
    const now = Math.floor(Date.now() / 1000)
    const mustRefresh = Boolean(existingClientSecret)

    if (!mustRefresh && sessionRef.current.secret && now < sessionRef.current.expiresAt - 30) {
      return sessionRef.current.secret
    }

    if (sessionRef.current.pending) return await sessionRef.current.pending

    sessionRef.current.pending = (async () => {
      try {
        const data = await createEmployeeChatSession()
        const secret = data?.client_secret
        if (!secret) throw new Error("Session did not return client_secret")

        const expiresAt = parseExpiresAt(data?.expires_at)
        sessionRef.current.secret = secret
        sessionRef.current.expiresAt = expiresAt || now + 900
        return secret
      } finally {
        sessionRef.current.pending = null
      }
    })()

    return await sessionRef.current.pending
  }, [])

  const handleClientTool = useCallback(async ({ name, params, signal }) => {
    const args = params || {}
    if (name === "attendance_resolve") return await attendanceResolveTool(args, { signal })
    if (name === "attendance_query") return await attendanceQueryTool(args, { signal })
    if (name === "employee_search") return await employeeSearchTool(args, { signal })
    if (name === "employee_get") return await employeeGetTool(args, { signal })
    if (name === "employee_query") return await employeeQueryTool(args, { signal })
    return { error: true, message: `Unhandled tool: ${name}` }
  }, [])


  const onWidgetAction = useCallback(async (action, widgetItem) => {
    console.log("WIDGET onAction fired", { action, widgetItem })

    if (!action?.type) return
    if (action.type !== "attachment.download") return

    const data = await chatkitWidgetActionTool({
      action,
      itemId: widgetItem?.id,
    })

    console.log("widget-action backend response", data)

    const url = normalizeUrl(data?.download_url || data?.open_url)
    if (!url) return

    const fileName =
      action?.payload?.fileName ||
      action?.payload?.filename ||
      "download"
    await downloadWithAxios(url, fileName)
  }, [])

  const chatkitUiOptions = useMemo(
    () => ({
      history: { enabled: false },

      theme: {
        density: "spacious",
        radius: "pill",
        typography: { baseSize: 14 },
        color: { accent: { primary: "#44528f", level: 2 } },
      },

      composer: { placeholder: "Ask about employees or attendance…" },

      startScreen: {
        greeting: "Welcome to SappSense HR Agent!",
        prompts: [
          { label: "Employee profile", prompt: "Show profile of Yasir Hashmi", icon: "search" },
          { label: "Today late employees", prompt: "Who is late today?", icon: "calendar" },
          { label: "My team attendance", prompt: "Show today attendance of my team", icon: "calendar" },
          { label: "Employees count", prompt: "How many employees are in IT department?", icon: "search" },
        ],
      },

      threadItemActions: { feedback: false, retry: true },

      widgets: {
        onAction: onWidgetAction,
      },
    }),
    [onWidgetAction]
  )

  const chatkit = useChatKit({
    api: { getClientSecret },
    ...chatkitUiOptions,

    onClientTool: async (call) => {
      const controller = new AbortController()
      try {
        const result = await handleClientTool({
          name: call.name,
          params: call.params,
          signal: controller.signal,
        })
        return { toolCallId: call.toolCallId, output: JSON.stringify(result ?? {}) }
      } catch (e) {
        return {
          toolCallId: call.toolCallId,
          output: JSON.stringify({ error: true, message: e?.message || "Client tool failed" }),
        }
      }
    },

    onReady: () => onChatReady?.(chatkit),

    onError: ({ error }) => {
      const msg = String(error?.message || "")
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        sessionRef.current.secret = null
        sessionRef.current.expiresAt = 0
      }
      console.error("ChatKit error:", error)
    },
  })

  useEffect(() => {
    chatkitRef.current = chatkit
  }, [chatkit])

  if (chatkit.status === "initializing") {
    return <div className="flex items-center justify-center h-full text-xs text-gray-500">Loading…</div>
  }

  if (chatkit.error) {
    return <div className="flex items-center justify-center h-full text-xs text-red-600">{chatkit.error.message}</div>
  }

  return (
    <div className="relative h-[80dvh] min-h-0 w-full overflow-hidden">
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  )
}
