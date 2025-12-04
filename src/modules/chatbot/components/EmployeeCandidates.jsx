import React from "react"
import Avatar from "@components/Avatar.jsx"

export default function EmployeeCandidates({ items = [], onPick }) {
  if (!items?.length) return null

  const heading =
    items.length === 1
      ? "One match found. Select to view details:"
      : `Multiple matches found (${items.length}). Select one:`

  return (
    <div className="max-w-2xl">
      <p className="text-xs mb-2">{heading}</p>
      <ul className="space-y-2 max-h-96 overflow-auto pr-1">
        {items.map(x => (
          <li
            key={x.id}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <Avatar full_name={x.full_name} />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">
                  {x.full_name}
                  {x.emp_code ? ` (${x.emp_code})` : ""}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  {x.designation || ""}
                  {x.department ? ` • ${x.department}` : ""}
                  {x.company ? ` • ${x.company}` : ""}
                </div>
                {x.email && (
                  <div className="text-[0.7rem] text-gray-500 dark:text-gray-300 break-all">
                    {x.email}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onPick?.(x)}
              className="ti-btn ti-btn-info !py-1 !px-2 !text-[0.75rem]"
            >
              <i className="ri-eye-line" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
