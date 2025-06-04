import React, { useState, useEffect, useRef } from "react";
import api from "@config/axiosConfig.js";

export default function DateDropdown({ value = [], onChange }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    api.get("/select/beirholm/date/").then(res => setData(res.data?.data ?? []));
  }, []);

  useEffect(() => {
    if (!initialized && data.length) {
      const currentYear = new Date().getFullYear().toString();
      const grp = data.find(g => g.value.toString() === currentYear);
      if (grp) {
        onChange(grp.children);
        setExpanded([currentYear]);
      }
      setInitialized(true);
    }
  }, [data, initialized, onChange]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isYearFullySelected = year => {
    const grp = data.find(g => g.value.toString() === year.toString());
    return grp && grp.children.every(c => value.some(v => v.value === c.value));
  };

  const toggleYear = year => {
    const grp = data.find(g => g.value.toString() === year.toString());
    if (!grp) return;
    const allMonths = grp.children;
    if (isYearFullySelected(year)) {
      onChange(value.filter(v => !allMonths.some(c => c.value === v.value)));
    } else {
      const toAdd = allMonths.filter(c => !value.some(v => v.value === c.value));
      onChange([...value, ...toAdd]);
    }
  };

  const toggleMonth = month => {
    if (value.some(v => v.value === month.value)) {
      onChange(value.filter(v => v.value !== month.value));
    } else {
      onChange([...value, month]);
    }
  };

  const selectedYears = data
    .filter(g => isYearFullySelected(g.value))
    .map(g => g.label);
  const leftoverMonths = value
    .filter(v => !selectedYears.some(label => data.find(g => g.label === label)?.children.some(c => c.value === v.value)))
    .map(v => v.label);
  const displayLabels = [...selectedYears, ...leftoverMonths];
  const displayLabel = displayLabels.length ? displayLabels.join(", ") : "Select Dates";
  console.log(selectedYears)
  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="border rounded px-3 py-2 cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(o => !o)}
      >
        <span className="truncate">{displayLabel}</span>
        <span
          className="ml-2 transform transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
          </svg>
        </span>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow-lg max-h-80 overflow-auto divide-y divide-gray-100">
          {data.map(group => {
            const yearStr = group.value.toString();
            const full = isYearFullySelected(yearStr);
            const partial = !full && group.children.some(c => value.some(v => v.value === c.value));
            return (
              <div key={yearStr} className="p-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-check-input h-4 w-4 text-blue-600"
                    checked={full}
                    ref={el => el && (el.indeterminate = partial)}
                    onChange={() => toggleYear(yearStr)}
                  />
                  <span className="ml-2 font-medium cursor-pointer" onClick={() => toggleYear(yearStr)}>
                    {group.label}
                  </span>
                  <span
                    className="ml-auto cursor-pointer select-none"
                    onClick={() =>
                      setExpanded(e =>
                        e.includes(yearStr) ? e.filter(y => y !== yearStr) : [...e, yearStr]
                      )
                    }
                  >
                    {expanded.includes(yearStr) ? "–" : "+"}
                  </span>
                </div>
                {expanded.includes(yearStr) &&
                  group.children.map(child => (
                    <div key={child.value} className="flex items-center pl-6 mt-1">
                      <input
                        type="checkbox"
                        className="form-check-input h-4 w-4 text-green-600"
                        checked={value.some(v => v.value === child.value)}
                        onChange={() => toggleMonth(child)}
                      />
                      <span className="ml-2 cursor-pointer" onClick={() => toggleMonth(child)}>
                        {child.label}
                      </span>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
