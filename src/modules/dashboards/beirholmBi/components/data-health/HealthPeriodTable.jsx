import React from "react"

const pct = v => Math.max(0, Math.min(100, Number(v ?? 0)))

const Meter = ({ label, value, tone }) => (
  <div className="space-y-1 dark:bg-bodybg">
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>{label}</span>
      <span className="font-medium">{pct(value)}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-100 dark:bg-gray-700">
      <div className={`h-2 rounded-full ${tone}`} style={{ width: `${pct(value)}%` }} />
    </div>
  </div>
)

const PeriodRow = ({ r }) => (
  <div className="py-5 first:pt-0 last:pb-0 dark:bg-bodybg">
    <div className="flex items-baseline justify-between mb-4">
      <div className="text-base font-semibold">{r.period}</div>
      <div className="text-xs text-slate-500"><span className="font-semibold">{r.total}</span> rows</div>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 dark:bg-bodybg">
      <Meter label="Blanks" value={r.blanks_pct} tone="bg-emerald-500" />
      <Meter label="Unknown" value={r.unknown_pct} tone="bg-amber-500" />
      <Meter label="Dots" value={r.dots_pct} tone="bg-sky-500" />
      <Meter label="Invalid" value={r.invalid_pct} tone="bg-rose-500" />
    </div>
  </div>
)

const HealthPeriodTable = ({ rows, title = "Quality By Period" }) => {
  return (
    <div className="box">
      <div className="box-header !bg-green/10"><div className="box-title">{title}</div></div>
      <div className="box-body">
        <div className="rounded-full border bg-white dark:bg-bodybg">
          <div className="max-h-[40vh] overflow-auto px-6 divide-y divide-slate-100 dark:bg-bodybg">
            {(rows || []).map(r => <PeriodRow key={r.period} r={r} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPeriodTable
