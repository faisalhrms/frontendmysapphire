import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

const colorText = {
  slate: "text-slate-700 dark:text-white/80",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
  fuchsia: "text-fuchsia-700 dark:text-fuchsia-300",
  purple: "text-purple-700 dark:text-purple-300",
  teal: "text-teal-700 dark:text-teal-300",
  blue: "text-blue-700 dark:text-blue-300",
  green: "text-green-700 dark:text-green-300",
};

const colorActiveChip = {
  slate: "bg-slate-100 dark:bg-white/10 border-slate-200/80",
  sky: "bg-sky-100 dark:bg-sky-900/30 border-sky-200/80",
  emerald: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200/80",
  violet: "bg-violet-100 dark:bg-violet-900/30 border-violet-200/80",
  amber: "bg-amber-100 dark:bg-amber-900/30 border-amber-200/80",
  rose: "bg-rose-100 dark:bg-rose-900/30 border-rose-200/80",
  fuchsia: "bg-fuchsia-100 dark:bg-fuchsia-900/30 border-fuchsia-200/80",
  purple: "bg-purple-100 dark:bg-purple-900/30 border-purple-200/80",
  teal: "bg-teal-100 dark:bg-teal-900/30 border-teal-200/80",
  blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-200/80",
  green: "bg-green-100 dark:bg-green-900/30 border-green-200/80",
};

const NavTabs = ({ tabs, activeId, defaultActiveId, onTabChange }) => {
  const controlled = activeId !== undefined && activeId !== null;
  const [internal, setInternal] = useState(defaultActiveId || tabs[0]?.id || "");
  const current = controlled ? activeId : internal;
  const setActive = (id) => {
    if (!controlled) setInternal(id);
    onTabChange?.(id);
  };
  const hasContent = useMemo(() => tabs.some((t) => t.content), [tabs]);

  return (
    <div>
      <div className="sm:border-b-2 border-gray-200 dark:border-white/10">
        <nav className="-mb-0.5 sm:flex sm:space-x-6 overflow-x-auto rtl:space-x-reverse">
          {tabs.map((tab) => {
            const color = tab.color || "slate";
            const icon = tab.icon
              ? React.cloneElement(tab.icon, {
                  size: 14,
                  className: colorText[color],
                })
              : null;
            return (
              <button
                key={tab.id}
                className={`w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary pb-3 px-1 inline-flex items-center gap-2 border-b-[3px] ${
                  current === tab.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 hover:text-primary"
                } text-sm whitespace-nowrap`}
                onClick={() => setActive(tab.id)}
                aria-controls={tab.id}
                aria-selected={current === tab.id}
              >
                {icon && (
                  <span
                    className={`h-6 w-6 grid place-items-center rounded-md border transition-all ${
                      current === tab.id ? colorActiveChip[color] : "border-transparent bg-transparent"
                    }`}
                  >
                    {icon}
                  </span>
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {hasContent && (
        <div className="mt-3">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={current === tab.id ? "block" : "hidden"}
            >
              {tab.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

NavTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.element,
      content: PropTypes.node,
      color: PropTypes.string,
    })
  ).isRequired,
  activeId: PropTypes.string,
  defaultActiveId: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default NavTabs;
