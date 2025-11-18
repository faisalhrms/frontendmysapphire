import React, { useEffect, useState } from "react"
import { Edit3, Save } from "lucide-react"

const VALUE_COL_WIDTH = "w-[7rem] md:w-[7rem]"

const EditableKV = ({
  label,
  value,
  onSave,
  type = "number",
  step = "any",
  min,
  max,
  prefix = "",
  suffix = "",
  valueWidth = VALUE_COL_WIDTH
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? "")
  const [current, setCurrent] = useState(value ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setCurrent(value ?? "")
    if (!editing) setDraft(value ?? "")
  }, [value])

  const handleSave = async () => {
    const next = type === "number" ? Number(draft) : draft
    setSaving(true)
    try {
      if (onSave) await onSave(next)
      setCurrent(next)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!saving) handleSave()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      setDraft(current ?? "")
      setEditing(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr,auto] items-center py-2 gap-2">
      <span className="text-gray-600 dark:text-white/70 truncate">{label}</span>

      {!editing ? (
        <div className={`relative flex items-center justify-end ${valueWidth} pr-6`}>
          <span className="font-medium text-right tabular-nums truncate">
            {current === "" || current === null || current === undefined ? "-" : current}
          </span>
          <button
            type="button"
            className="absolute right-0 rounded-md p-1 text-sky-500 hover:text-sky-700 hover:bg-slate-100 dark:text-sky-300 dark:hover:text-sky-200 dark:hover:bg-white/10"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Edit3 size={13} className="text-primary" />
          </button>
        </div>
      ) : (
        <div className={`flex items-center justify-end gap-2 ${valueWidth}`}>
          {prefix ? <span className="text-slate-500 dark:text-slate-300">{prefix}</span> : null}
          <input
            type={type}
            step={step}
            min={min}
            max={max}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-control !w-[5rem] !h-8 !px-2 text-right"
            autoFocus
          />
          {suffix ? <span className="text-slate-500 dark:text-slate-300">{suffix}</span> : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="ti-btn ti-btn-primary !mb-0 !py-1 !px-1 rounded-md inline-flex items-center gap-1"
            title="Save"
          >
            <Save size={14} className="text-emerald-50" />
          </button>
        </div>
      )}
    </div>
  )
}

export default EditableKV
