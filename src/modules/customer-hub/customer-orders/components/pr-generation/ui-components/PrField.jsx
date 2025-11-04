import React from "react"

const PrField = ({ label, name, value, onChange, type = "text", readOnly = false }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[0.6rem] font-semibold tracking-[0.12em] text-slate-500 dark:text-slate-300 uppercase">
      {label}
    </span>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      readOnly={readOnly}
      onChange={(e) => onChange(name, type === "number" ? e.target.value.replace(",", "") : e.target.value)}
      className={`form-control !h-8 !text-[0.8rem] !rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ${
        readOnly ? "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/70" : "text-slate-800 dark:text-slate-100"
      }`}
    />
  </div>
)

export default PrField
