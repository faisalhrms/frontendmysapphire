import React, { useState } from "react";
import PropTypes from "prop-types";
import IconTabs from "./IconTabs.jsx";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";

/**
 * IconTabsWithPermission
 * Accepts an array of tab definitions (tabsConfig). Each definition can include an optional `permission` string.
 * Calls useHasPermission for every `permission` (or null) in order, then filters out disallowed tabs.
 */
const IconTabsWithPermission = ({ tabsConfig, onTabChange }) => {
    // Call useHasPermission for each tab's permission at top-level
    const permResults = tabsConfig.map(tab => useHasPermission(tab.permission || null));

    // Filter allowed tabs: if no permission required, always include; otherwise only if hook returned true
    const allowedTabs = tabsConfig.filter((tab, idx) => {
        if (!tab.permission) return true;
        return permResults[idx] === true;
    });

    // Build the array for IconTabs (strip out `permission` field)
    const visibleTabs = allowedTabs.map(({ permission, ...rest }) => rest);

    // Track the active tab (default to first visible tab ID)
    const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || "");

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (onTabChange) onTabChange(tabId);
    };

    return (
        <IconTabs
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={handleTabClick}
        />
    );
};

IconTabsWithPermission.propTypes = {
    tabsConfig: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.element,
            content: PropTypes.node.isRequired,
            permission: PropTypes.string, // optional
        })
    ).isRequired,
    onTabChange: PropTypes.func,
};

export default IconTabsWithPermission;
