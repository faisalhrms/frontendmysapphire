import React, { useCallback, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { Copy, Check } from "lucide-react"

export const copyToClipboard = async (val) => {
  const text = String(val ?? "").trim()
  if (!text) return false

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (_) {}

  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.position = "fixed"
    ta.style.top = "-9999px"
    ta.style.left = "-9999px"
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch (_) {
    return false
  }
}

const normalizeForCopy = (value, dateFormat) => {
  if (value == null) return ""

  if (value instanceof Date) {
    const d = dayjs(value)
    return d.isValid() ? d.format(dateFormat) : ""
  }

  if (typeof value === "number") {
    const d = dayjs(value)
    return d.isValid() ? d.format(dateFormat) : String(value)
  }

  const s = String(value).trim()
  if (!s) return ""

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = dayjs(s, "YYYY-MM-DD")
    return d.isValid() ? d.format(dateFormat) : s
  }

  if (s.includes("GMT")) {
    const d = dayjs(new Date(s))
    return d.isValid() ? d.format(dateFormat) : s
  }

  const d = dayjs(s)
  if (d.isValid() && (/\d{4}/.test(s) || /\d{2}\/\d{2}\/\d{4}/.test(s))) {
    return d.format(dateFormat)
  }

  return s
}

const CopyCornerBtn = ({
  value,
  title = "Copy",
  copiedTitle = "Copied",
  disabled: disabledProp,
  className = "",
  copyText,
  dateFormat = "MM/DD/YYYY",

  size = 5,
  iconSize = 10,
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(t)
  }, [copied])

  const textToCopy = useMemo(() => {
    if (copyText != null) return String(copyText ?? "").trim()
    return normalizeForCopy(value, dateFormat)
  }, [copyText, value, dateFormat])

  const disabled = disabledProp ?? !textToCopy

  const onCopy = useCallback(async () => {
    if (disabled) return
    const ok = await copyToClipboard(textToCopy)
    if (ok) setCopied(true)
  }, [disabled, textToCopy])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onCopy}
      title={copied ? copiedTitle : title}
      aria-label={copied ? copiedTitle : title}
      className={
        `inline-flex items-center justify-center rounded-full border transition ` +
        `h-${size} w-${size} ` +
        (disabled
          ? "border-slate-200 text-slate-300 dark:border-white/10 dark:text-white/20 cursor-not-allowed "
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 ") +
        className
      }
    >
      {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
    </button>
  )
}

export default CopyCornerBtn
