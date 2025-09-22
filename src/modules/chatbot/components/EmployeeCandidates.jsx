import React from "react"
import Avatar from "@components/Avatar.jsx"

export default function EmployeeCandidates({ items = [], onPick }) {
  if (!items?.length) return null
  return (
    <div className="max-w-2xl">
      <p className="text-xs mb-2">Multiple matches found. Select one:</p>
      <ul className="space-y-2">
        {items.map(x=>(
          <li key={x.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <Avatar full_name={x.full_name} />
              <div>
                <div className="text-sm font-medium">{x.full_name}{x.emp_code ? ` (${x.emp_code})` : ""}</div>
                <div className="text-xs text-gray-500">{x.designation || ""}{x.email ? ` • ${x.email}` : ""}</div>
              </div>
            </div>
            <button onClick={()=>onPick?.(x)} className="ti-btn ti-btn-info !py-1 !px-2 !text-[0.75rem]"><i className="ri-eye-line"></i></button>
          </li>
        ))}
      </ul>
    </div>
  )
}
