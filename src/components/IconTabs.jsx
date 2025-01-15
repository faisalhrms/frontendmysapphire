import React, { useState } from "react";
import PropTypes from "prop-types";

const IconTabs = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    return (
        <div>
            <div className="sm:border-b-2 border-gray-200 dark:border-white/10">
                <nav className="-mb-0.5 sm:flex sm:space-x-6 rtl:space-x-reverse">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary pb-3 px-1 inline-flex items-center gap-2 border-b-[3px] ${
                                activeTab === tab.id
                                    ? "border-primary text-primary font-semibold"
                                    : "border-transparent text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 hover:text-primary"
                            } text-sm whitespace-nowrap`}
                            onClick={() => handleTabClick(tab.id)}
                            aria-controls={tab.id}
                            aria-selected={activeTab === tab.id}
                        >
                            {tab.icon &&
                                (
                                    tab.icon
                                )
                            }
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-3">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        id={tab.id}
                        role="tabpanel"
                        aria-labelledby={`tab-${tab.id}`}
                        className={activeTab === tab.id ? "block" : "hidden"}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

IconTabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.element,
            content: PropTypes.node.isRequired,
        })
    ).isRequired,
    onTabChange: PropTypes.func,
};

export default IconTabs;
