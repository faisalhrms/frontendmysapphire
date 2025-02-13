import Tooltip from "@components/Tooltip.jsx";
import React from "react";

const TextAvatar = ({ item, itemKey = 'id', itemValueKey = 'short_name', itemTooltipValueKey = 'full_name' }) => {
    return (
        <Tooltip
            id={`item-tooltip-${item[itemKey]}`}
            tooltipContent={item[itemTooltipValueKey] ?? item[itemValueKey]}
        >
            <div className="me-2">
                <span className="avatar avatar-rounded p-1 bg-primary/10 !text-primary !mb-0">{item[itemValueKey].toUpperCase()}</span>
            </div>
        </Tooltip>
    );
};
export default TextAvatar;
