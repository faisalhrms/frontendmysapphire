import React, { useEffect, useMemo, useState } from "react"
import { MessageSquareText, X } from "lucide-react"

const countWords = (s) =>
  String(s || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

const normalizeRemark = (s) => String(s || "").replace(/\s+/g, " ").trim()

const clampText = (raw, maxWords, maxChars) => {
  let s = String(raw ?? "")

  // 1) hard cap characters (prevents huge single-word strings)
  if (maxChars && s.length > maxChars) s = s.slice(0, maxChars)

  // 2) cap words
  const parts = s.trim().split(/\s+/).filter(Boolean)
  if (parts.length > maxWords) s = parts.slice(0, maxWords).join(" ")

  return s
}

export default function AgreementRemarkModal({
  open,
  value,
  onClose,
  onSave,
  maxWords = 20,
  maxChars, // optional override
}) {
  // default chars cap: ~15 chars/word
  const maxLen = maxChars ?? maxWords * 15

  const [text, setText] = useState("")

  useEffect(() => {
    if (open) setText(value || "")
  }, [open, value])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose?.()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const words = useMemo(() => countWords(text), [text])
  const remaining = Math.max(0, maxWords - words)
  const full = words >= maxWords

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-bodybg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
              <MessageSquareText size={16} />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Remark</div>
              <div className="text-xs opacity-70">
                Max {maxLen} chars
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            aria-label="Close"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <textarea
            value={text}
            rows={4}
            maxLength={maxLen}
            placeholder="Type a short remark..."
            onChange={(e) => setText(clampText(e.target.value, maxWords, maxLen))}
            onPaste={(e) => {
              e.preventDefault()
              const paste = e.clipboardData.getData("text")
              setText((prev) => clampText(prev + paste, maxWords, maxLen))
            }}
            className={
              "w-full rounded-xl border px-3 py-2 text-sm outline-none bg-white dark:bg-bodybg focus:ring-2 " +
              (full
                ? "border-amber-300 focus:ring-amber-300/60"
                : "border-slate-200 dark:border-white/10 focus:ring-violet-300/60")
            }
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="opacity-70"> · {text.length}/{maxLen} chars</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="ti-btn ti-btn-light !py-1.5 !px-3 !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSave?.(normalizeRemark(text))}
                className="ti-btn ti-btn-primary !py-1.5 !px-3 !text-xs"
              >
                Save
              </button>
            </div>
          </div>

          {full && (
            <div className="mt-2 text-[0.75rem] text-amber-700 dark:text-amber-300">
              Word limit reached ({maxWords}). Add a space for a new word.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
