import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

const IconTabs = ({ tabs, activeId, defaultActiveId, onTabChange }) => {
    const controlled = activeId !== undefined && activeId !== null;

    const firstId = tabs[0]?.id || "";
    const initialId = defaultActiveId || firstId;

    const [internal, setInternal] = useState(initialId);

    // ✅ When tabs list changes (or defaultActiveId changes), keep internal valid (uncontrolled mode)
    useEffect(() => {
        if (controlled) return;

        // if current internal is missing from tabs, fallback to default/first
        const exists = tabs.some((t) => t.id === internal);
        if (!exists) setInternal(initialId);
    }, [tabs, defaultActiveId]); // intentionally not depending on internal/initialId to avoid loops

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
                    {tabs.map((tab) => (
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
                            {tab.icon && tab.icon}
                            {tab.label}
                        </button>
                    ))}
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

IconTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.element,
            content: PropTypes.node,
        })
    ).isRequired,
    activeId: PropTypes.string,
    defaultActiveId: PropTypes.string,
    onTabChange: PropTypes.func,
};

export default IconTabs;
