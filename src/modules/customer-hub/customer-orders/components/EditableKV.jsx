import React, { useEffect, useState } from "react"
import { Pencil, Check, X } from "lucide-react"

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

  return (
    <div className="group flex items-center justify-between py-2">
      <span className="text-gray-600 dark:text-white/70 truncate">{label}</span>

      {!editing ? (
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {current === "" || current === null || current === undefined ? "-" : current}
          </span>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 transition rounded-md p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {prefix ? <span className="text-slate-500 dark:text-slate-300">{prefix}</span> : null}
          <input
            type={type}
            step={step}
            min={min}
            max={max}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="form-control !w-16 !h-8 !px-2"
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
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(current ?? "")
              setEditing(false)
            }}
            className="ti-btn ti-btn-light !mb-0 !py-1 !px-1 rounded-md"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default EditableKV
