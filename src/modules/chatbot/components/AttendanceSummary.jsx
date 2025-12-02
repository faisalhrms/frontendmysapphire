import React, { useMemo } from "react"
import { CalendarDays, Clock, UserCheck, UserX, Users } from "lucide-react"

function StatChip({ icon: Icon, label, value, tone = "default" }) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
        : tone === "accent"
          ? "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"
          : "bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"

  return (
    <div className={`rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-[0_0_0_1px_rgba(15,23,42,0.03)] ${toneClasses}`}>
      <div className="flex flex-col">
        <span className="text-[0.68rem] uppercase tracking-wide opacity-80">{label}</span>
        <span className="text-[0.9rem] font-semibold">{value ?? "—"}</span>
      </div>
      <Icon className="w-4 h-4 opacity-60" />
    </div>
  )
}

const LEAVE_STATUSES = [
  "annual leave",
  "casual leave",
  "combine leave",
  "compensatory leave",
  "leave without pay",
  "paternal leave",
  "sick leave",
  "umrah leave",
]

export default function AttendanceSummary({ data, ask }) {
  if (!data) return null

  const {
    scope_label,
    period,
    stats: rawStats = {},
    top_late = [],
    records: rawRecords = [],
    rows = [],
    actions = [],
  } = data

  const sourceRecords = rawRecords && rawRecords.length ? rawRecords : rows || []

  const records = useMemo(
    () =>
      (sourceRecords || []).map(r => {
        const statusRaw = r.status_label || r.status || ""
        const status = statusRaw.trim()
        const s = status.toLowerCase()

        const derivedIsAbsent = s === "absent"
        const derivedIsLeave = LEAVE_STATUSES.includes(s)
        const derivedIsHalfDay = s === "half day"
        const derivedIsRest = s === "rest day"
        const derivedIsPresent =
          s === "present" || s === "exempted" || derivedIsHalfDay

        const isLate =
          r.is_late ??
          (derivedIsHalfDay ? true : false)

        const workedHours =
          r.worked_hours != null
            ? r.worked_hours
            : r.worked_minutes != null
              ? (r.worked_minutes / 60).toFixed(2)
              : null

        const reqHours =
          r.req_hours != null
            ? r.req_hours
            : r.required_hours != null
              ? r.required_hours
              : null

        return {
          ...r,
          name: r.name || r.full_name,
          department:
            r.department ||
            r.department_name ||
            r.employee_department ||
            null,
          status_label: status || "—",
          worked_hours: workedHours,
          req_hours: reqHours,
          is_absent: r.is_absent ?? derivedIsAbsent,
          is_leave: r.is_leave ?? derivedIsLeave,
          is_rest: r.is_rest ?? derivedIsRest,
          is_half_day: r.is_half_day ?? derivedIsHalfDay,
          is_present: r.is_present ?? derivedIsPresent,
          is_late: isLate,
        }
      }),
    [sourceRecords],
  )

  const derivedStats = useMemo(() => {
    const s = {
      total_records: records.length,
      unique_employees: new Set(records.map(r => r.emp_code || r.employee_id)).size,
      present_records: 0,
      absent_records: 0,
      leave_records: 0,
      rest_records: 0,
      late_records: 0,
    }

    records.forEach(r => {
      if (r.is_present) s.present_records += 1
      if (r.is_absent) s.absent_records += 1
      if (r.is_leave) s.leave_records += 1
      if (r.is_rest) s.rest_records += 1
      if (r.is_late) s.late_records += 1
    })

    return s
  }, [records])

  const stats = { ...derivedStats, ...rawStats }
  const limitedRecords = useMemo(() => records.slice(0, 25), [records])

  return (
    <div className="mt-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/80 dark:bg-slate-950/70 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-100/80 dark:border-slate-800/80 bg-gradient-to-r from-sky-50 via-emerald-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex items-center justify-between gap-2">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Attendance snapshot
          </p>
          <p className="text-[0.8rem] font-medium text-slate-800 dark:text-slate-100">
            {scope_label || "Your team"}
            {period?.label ? ` · ${period.label}` : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-900/70 px-2 py-1 border border-slate-200/70 dark:border-slate-700/70">
            <CalendarDays className="w-3 h-3 text-slate-500" />
            <span className="text-[0.7rem] text-slate-600 dark:text-slate-300">
              {period?.from} → {period?.to}
            </span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 pt-2 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatChip icon={Users} label="Employees" value={stats.unique_employees} />
          <StatChip icon={UserCheck} label="Present" value={stats.present_records} tone="success" />
          <StatChip
            icon={UserX}
            label="Absent / Leave"
            value={(stats.absent_records || 0) + (stats.leave_records || 0)}
            tone="warn"
          />
          <StatChip icon={Clock} label="Late / short" value={stats.late_records} tone="accent" />
        </div>

        {top_late?.length ? (
          <div className="bg-sky-50/80 dark:bg-slate-800/60 rounded-xl px-3 py-2 border border-sky-100/80 dark:border-slate-700/70">
            <p className="text-[0.75rem] font-medium text-slate-700 dark:text-slate-100 mb-1">
              Highlight – people with late / short hours
            </p>
            <ul className="space-y-1">
              {top_late.slice(0, 5).map(person => (
                <li
                  key={person.emp_code || person.employee_id}
                  className="flex justify-between text-[0.72rem] text-slate-700 dark:text-slate-200"
                >
                  <span className="truncate">
                    {person.name}{" "}
                    <span className="text-slate-400">({person.emp_code})</span>
                  </span>
                  <span className="text-slate-500">
                    {(person.late_days ?? person.late_records) || 0} day(s) late
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {limitedRecords.length ? (
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="table-auto w-full border-collapse border border-slate-200 dark:border-slate-700 text-[0.75rem] dark:bg-bodybg">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr>
                  <th className="px-2 py-1 text-left border-b font-semibold">Employee</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">Emp Code</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">Department</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">Date</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">Status</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">In / Out</th>
                  <th className="px-2 py-1 text-left border-b font-semibold">Hours</th>
                </tr>
              </thead>
              <tbody>
                {limitedRecords.map((row, idx) => (
                  <tr
                    key={`${row.emp_code}-${row.date}-${idx}`}
                    className="border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                  >
                    <td className="px-2 py-1 whitespace-nowrap">
                      <span className="font-medium text-[0.76rem]">{row.name}</span>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap text-[0.72rem] text-slate-600">
                      {row.emp_code}
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap text-[0.72rem] text-slate-600">
                      {row.department || "—"}
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">{row.date}</td>
                    <td className="px-2 py-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-[2px] text-[0.68rem] ${
                          row.is_leave
                            ? "bg-amber-50 text-amber-800"
                            : row.is_absent
                              ? "bg-rose-50 text-rose-700"
                              : row.is_late
                                ? "bg-orange-50 text-orange-700"
                                : row.is_rest
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.status_label || "—"}
                      </span>
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">
                      {row.in_time || row.out_time
                        ? `${row.in_time || "—"} – ${row.out_time || "—"}`
                        : "—"}
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">
                      {row.worked_hours != null
                        ? `${row.worked_hours} / ${row.req_hours ?? "—"}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {records.length > limitedRecords.length ? (
              <div className="px-3 py-2 text-[0.7rem] text-slate-500 bg-slate-50 dark:bg-slate-900/40">
                Showing {limitedRecords.length} of {records.length} records. Ask the bot to export or drill down.
              </div>
            ) : null}
          </div>
        ) : null}

        {actions?.length ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => ask?.(action.prompt)}
                className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-[0.7rem] text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
