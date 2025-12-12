import React, { useCallback, useEffect, useState } from "react"
import { ChatKit, useChatKit } from "@openai/chatkit-react"
import {
  createCaloriesChatSession,
  getCalorieDaySummary,
  updateCalorieProfile,
  createCalorieEntry,
  getCalorieProfile, deleteCalorieEntry,
} from "@modules/chatbot/services/CaloriesService.js"

const formatDate = (d) => d.toISOString().slice(0, 10)

/**
 * Modal to view / edit the calorie profile stored in Django.
 */

function ConfirmDeleteModal({ open, entry, onConfirm, onCancel, isDeleting }) {
  if (!open || !entry) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Delete this entry?
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            This will remove the calories for:
          </p>
          <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-100 line-clamp-2">
            {entry.calories} kcal – {entry.description}
          </p>
        </div>
        <div className="px-5 py-3 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-[11px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}


function CalorieProfileModal({ open, onClose, profile, onSaved }) {
  const [form, setForm] = useState({
    gender: "",
    age: "",
    height_cm: "",
    weight_kg: "",
    target_weight_kg: "",
    daily_calorie_budget: "",
    activity_level: "moderate",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (!profile) {
      setForm({
        gender: "male",
        age: "",
        height_cm: "",
        weight_kg: "",
        target_weight_kg: "",
        daily_calorie_budget: "",
        activity_level: "moderate",
      })
      return
    }

    setForm({
      gender: profile.gender || "male",
      age: profile.age ?? "",
      height_cm: profile.height_cm ?? "",
      weight_kg: profile.weight_kg ?? "",
      target_weight_kg: profile.target_weight_kg ?? "",
      daily_calorie_budget: profile.daily_calorie_budget ?? "",
      activity_level: profile.activity_level || "moderate",
    })
  }, [open, profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        gender: form.gender || null,
        age: form.age ? Number(form.age) : null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        target_weight_kg: form.target_weight_kg
          ? Number(form.target_weight_kg)
          : null,
        daily_calorie_budget: form.daily_calorie_budget
          ? Number(form.daily_calorie_budget)
          : null,
        activity_level: form.activity_level || null,
      }

      const updated = await updateCalorieProfile(payload)
      await onSaved?.(updated)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Calorie Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Age (years)
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Height (cm)
              </label>
              <input
                type="number"
                name="height_cm"
                value={form.height_cm}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                placeholder="e.g. 170"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight_kg"
                value={form.weight_kg}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Target weight (kg)
              </label>
              <input
                type="number"
                name="target_weight_kg"
                value={form.target_weight_kg}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-slate-500">
                Daily calorie target (kcal)
              </label>
              <input
                type="number"
                name="daily_calorie_budget"
                value={form.daily_calorie_budget}
                onChange={handleChange}
                className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[11px] text-slate-500">
              Activity level
            </label>
            <select
              name="activity_level"
              value={form.activity_level}
              onChange={handleChange}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very active</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-[11px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CaloriesChatKitPane() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [confirmDeleteEntry, setConfirmDeleteEntry] = useState(null)
   const [deletingId, setDeletingId] = useState(null)

  const loadSummary = useCallback(async (d) => {
    setLoadingSummary(true)
    try {
      const iso = formatDate(d)
      const data = await getCalorieDaySummary(iso)
      if (data) setSummary(data)
    } finally {
      setLoadingSummary(false)
    }
  }, [])

  useEffect(() => {
    loadSummary(selectedDate)
  }, [selectedDate, loadSummary])

  const changeDay = (delta) => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() + delta)
      return next
    })
  }

  const today = new Date()
  const isToday = formatDate(today) === formatDate(selectedDate)

  const total = summary?.total_calories ?? 0
  const target = summary?.profile?.daily_calorie_budget ?? 0
  const remaining =
    target && typeof summary?.remaining_calories === "number"
      ? summary.remaining_calories
      : target
      ? Math.max(0, target - total)
      : null
  const pct = target ? Math.min(100, Math.round((total / target) * 100)) : 0

  /**
   * Handle client tools coming from the workflow.
   * ChatKit passes { name, params } here.
   */

    const handleDeleteEntry = useCallback(
    async (entryId) => {
      if (!entryId) return
      setDeletingId(entryId)
      try {
        await deleteCalorieEntry(entryId)
        await loadSummary(selectedDate)
      } finally {
        setDeletingId(null)
      }
    },
    [loadSummary, selectedDate],
  )


const handleClientTool = useCallback(
  async ({ name, params }) => {
    const args = params || {}

    try {
      if (name === "get_calorie_profile") {
        const prof = await getCalorieProfile()
        await loadSummary(selectedDate)
        return { ok: true, profile: prof }
      }

      if (name === "update_calorie_profile") {
        const current = summary?.profile || {}
        const payload = {
          gender: args.gender ?? current.gender ?? null,
          age: args.age ?? current.age ?? null,
          height_cm: args.height_cm ?? current.height_cm ?? null,
          weight_kg: args.weight_kg ?? current.weight_kg ?? null,
          target_weight_kg:
            args.target_weight_kg ?? current.target_weight_kg ?? null,
          daily_calorie_budget:
            args.daily_calorie_budget ??
            current.daily_calorie_budget ??
            1500,
          activity_level:
            args.activity_level ?? current.activity_level ?? null,
        }

        const updated = await updateCalorieProfile(payload)
        await loadSummary(selectedDate)
        return { ok: true, profile: updated }
      }

      if (name === "log_calorie_entry") {
        const desc = args.description
        const rawCal = args.calories

        let calories = null
        if (typeof rawCal === "number") {
          calories = Math.round(rawCal)
        } else if (
          typeof rawCal === "string" &&
          rawCal.trim() !== "" &&
          Number.isFinite(Number(rawCal))
        ) {
          calories = Math.round(Number(rawCal))
        }

        if (!desc || calories == null) {
          return {
            ok: false,
            message:
              "Missing description or calories for log_calorie_entry; entry not saved.",
          }
        }

        const payload = {
          description: String(desc),
          calories,
          entry_date: args.entry_date || formatDate(selectedDate),
          source: "llm",
          message_id: args.message_id ?? null,
        }

        const entry = await createCalorieEntry(payload)
        await loadSummary(selectedDate)
        return { ok: true, entry_id: entry.id }
      }

      return { ok: false, message: `Unhandled tool: ${name}` }
    } catch (err) {
      console.error("Calorie client tool error", err)
      return {
        ok: false,
        message: "Failed to sync calorie data with backend",
      }
    }
  },
  [summary, selectedDate, loadSummary],
)


const { control, status, error } = useChatKit({
  api: {
    async getClientSecret() {
      const data = await createCaloriesChatSession()
      return data.client_secret
    },
  },
  onClientTool: async (call) => {
    try {
      const result = await handleClientTool({ name: call.name, params: call.params })
      return {
        toolCallId: call.toolCallId,
        output: JSON.stringify(result ?? { ok: true }),
      }
    } catch (e) {
      return {
        toolCallId: call.toolCallId,
        output: JSON.stringify({ ok: false, message: e?.message || "Client tool failed" }),
      }
    }
  },
})


  if (status === "initializing") {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        Loading calorie coach…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-red-600">
        {error.message || "Failed to start calorie coach"}
      </div>
    )
  }

  const profile = summary?.profile

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-bodybg">
<header
  className="
    flex flex-col sm:flex-row sm:items-center sm:justify-between
    gap-2 sm:gap-4 px-3 py-2 sm:px-6 sm:py-3
    border-b border-slate-200 dark:border-slate-800
    bg-white/80 dark:bg-slate-950/80 backdrop-blur
  "
>
  {/* Left: brand + profile button (unchanged visually) */}
  <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-400/90 to-emerald-600 flex items-center justify-center shadow-sm">
      <span className="text-white text-base sm:text-lg font-semibold">KC</span>
    </div>
    <div className="min-w-0">
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
        Calorie Coach
      </div>
      <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
        Track your meals in natural language
      </div>
    </div>

    <button
      type="button"
      onClick={() => setProfileModalOpen(true)}
      className="ml-2 sm:ml-3 shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
    >
      <i className="ri-user-heart-line text-xs" />
      <span className="whitespace-nowrap">
        {profile?.weight_kg ? `${profile.weight_kg} kg` : "Set profile"}
      </span>
    </button>
  </div>

  {/* ====== MOBILE (<sm) ====== */}
  <div className="sm:hidden w-full">
    {/* One-row controls with Today chip */}
    <div
      className="
        grid grid-cols-[32px,1fr,32px,auto] items-center gap-1
        rounded-2xl bg-slate-100/80 dark:bg-slate-900
        px-2 py-1 shadow-inner
      "
    >
      <button
        type="button"
        onClick={() => changeDay(-1)}
        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/70 dark:hover:bg-slate-800"
        aria-label="Previous day"
      >
        ‹
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <input
          type="date"
          value={formatDate(selectedDate)}
          onChange={(e) => {
            if (!e.target.value) return
            const d = new Date(e.target.value)
            if (!isNaN(d.getTime())) setSelectedDate(d)
          }}
          className="
            flex-1 min-w-0 text-sm
            bg-transparent border-0 outline-none focus:ring-0
            px-2 py-2 rounded-md
          "
        />
      </div>

      <button
        type="button"
        onClick={() => changeDay(1)}
        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/70 dark:hover:bg-slate-800"
        aria-label="Next day"
      >
        ›
      </button>

      <button
        type="button"
        onClick={() => setSelectedDate(new Date())}
        className={`px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap ${
          isToday
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-100"
        }`}
      >
        Today
      </button>
    </div>

    {/* Mobile compact stats chips */}
    <div className="mt-2 grid grid-cols-3 gap-2 w-full">
      <div className="rounded-full px-3 py-2 bg-slate-100 dark:bg-slate-900 text-center">
        <div className="text-[11px] text-slate-600 dark:text-slate-300">Consumed</div>
        <div className="text-xs font-semibold">{loadingSummary ? "…" : total}</div>
      </div>
      <div className="rounded-full px-3 py-2 bg-slate-100 dark:bg-slate-900 text-center">
        <div className="text-[11px] text-slate-600 dark:text-slate-300">Target</div>
        <div className="text-xs font-semibold">{target || "—"}</div>
      </div>
      <div className="rounded-full px-3 py-2 bg-slate-100 dark:bg-slate-900 text-center">
        <div className="text-[11px] text-slate-600 dark:text-slate-300">Remain</div>
        <div
          className={`text-xs font-semibold ${
            target && remaining !== null && remaining < 0
              ? "text-rose-600"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {target ? remaining ?? 0 : "—"}
        </div>
      </div>
    </div>
  </div>

  {/* ====== DESKTOP (sm+) — UNCHANGED ====== */}
  <div className="hidden sm:flex items-center gap-4">
    {/* Date controls (original) */}
    <div className="flex items-center gap-1 rounded-full bg-slate-100/80 dark:bg-slate-900 px-2 py-1 shadow-inner">
      <button
        type="button"
        onClick={() => changeDay(-1)}
        className="px-2 py-1 text-xs rounded-full hover:bg-white/80 dark:hover:bg-slate-800"
      >
        ◀
      </button>
      <input
        type="date"
        className="form-control"
        value={formatDate(selectedDate)}
        onChange={(e) => {
          if (!e.target.value) return
          const d = new Date(e.target.value)
          if (!isNaN(d.getTime())) setSelectedDate(d)
        }}
      />
      <button
        type="button"
        onClick={() => changeDay(1)}
        className="px-2 py-1 text-xs rounded-full hover:bg-white/80 dark:hover:bg-slate-800"
      >
        ▶
      </button>
      <button
        type="button"
        onClick={() => setSelectedDate(new Date())}
        className={`ml-1 px-2 py-1 text-[11px] rounded-full ${
          isToday
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-100"
        }`}
      >
        Today
      </button>
    </div>

    {/* Desktop stats (original) */}
    <div className="hidden sm:flex items-center gap-4 text-xs">
      <div className="flex flex-col min-w-[80px]">
        <span className="text-slate-500 dark:text-slate-400">Consumed</span>
        <span className="font-semibold text-slate-900 dark:text-slate-50">
          {loadingSummary ? "…" : `${total} kcal`}
        </span>
      </div>
      <div className="flex flex-col min-w-[80px]">
        <span className="text-slate-500 dark:text-slate-400">Target</span>
        <span className="font-semibold text-slate-900 dark:text-slate-50">
          {target || "—"}
        </span>
      </div>
      <div className="flex flex-col min-w-[90px]">
        <span className="text-slate-500 dark:text-slate-400">Remaining</span>
        <span
          className={`font-semibold ${
            target && remaining !== null && remaining < 0
              ? "text-rose-500"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {target ? `${remaining ?? 0} kcal` : "—"}
        </span>
      </div>
      <div className="h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[11px] font-semibold bg-white dark:bg-slate-950">
        {target ? `${pct}%` : "—"}
      </div>
    </div>
  </div>
</header>



      <main className="flex-1 min-h-0 flex">
        <section className="flex-1 min-h-0 p-3">
          <div className="h-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
          <ChatKit control={control}  onClientTool={handleClientTool} className="w-full" style={{ height: 700 }} />
          </div>
        </section>

                <aside
                    className="hidden lg:block w-72 border-l border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        {summary?.date || formatDate(selectedDate)} entries
                    </h3>
                    <div
                        className="space-y-2 text-[11px] text-slate-700 dark:text-slate-200 max-h-full overflow-y-auto">
                        {loadingSummary ? (
                            <p className="text-[11px] text-slate-500">Loading…</p>
                        ) : summary?.entries?.length ? (
                            summary.entries.map((e) => {
                                const isDeleting = deletingId === e.id
                                return (
                                    <div
                                        key={e.id}
                                        className="rounded-lg bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200/80 dark:border-slate-700/80"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold">{e.calories} kcal</span>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] text-slate-400">
                                                {e.created_at
                                                    ? new Date(e.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : ""}
                                              </span>
                                                <button
                                                    type="button"
                                                    aria-label="Delete entry"
                                                    title="Delete entry"
                                                    disabled={isDeleting}
                                                    onClick={() => setConfirmDeleteEntry(e)}
                                                    className={`text-[10px] rounded-xl px-2 py-0.5 border transition
                                                      ${isDeleting
                                                        ? "opacity-60 rounded-full cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400"
                                                        : "text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-900/20"
                                                    }`}
                                                >
                                                    {isDeleting ? "Deleting…" : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[11px] leading-snug line-clamp-3">{e.description}</p>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-[11px] text-slate-500">
                                No entries for this day yet. Tell Calorie Coach what you ate.
                            </p>
                        )}
                    </div>
                </aside>
            </main>

      <CalorieProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSaved={async () => {
          await loadSummary(selectedDate)
        }}
      />
      <ConfirmDeleteModal
        open={!!confirmDeleteEntry}
        entry={confirmDeleteEntry}
        isDeleting={!!deletingId}
        onCancel={() => {
          if (!deletingId) setConfirmDeleteEntry(null)
        }}
        onConfirm={async () => {
          if (!confirmDeleteEntry || deletingId) return
          await handleDeleteEntry(confirmDeleteEntry.id)
          setConfirmDeleteEntry(null)
        }}
      />
    </div>
  )
}
