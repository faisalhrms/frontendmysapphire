import Tooltip from "@components/Tooltip.jsx";
import React from "react";

const TextAvatar = ({item, itemKey = 'id', itemValueKey = 'short_name', itemTooltipValueKey = 'full_name'}) => {
    if (!item) {
        return (<Tooltip id="item-tooltip-N/A" tooltipContent="No data available">
                <div className="me-2">
          <span className="avatar avatar-rounded p-1 bg-primary/10 !text-primary !mb-0">
            N/A
          </span>
                </div>
            </Tooltip>);
    }
    const itemId = item[itemKey] ?? 'N/A';
    const itemValue = item[itemValueKey] ?? 'N/A';
    const tooltipContent = item[itemTooltipValueKey] ?? 'No data available';

    return (<Tooltip id={`item-tooltip-${itemId}`} tooltipContent={tooltipContent}>
            <div className="me-2">
        <span className="avatar avatar-rounded p-1 bg-primary/10 !text-primary !mb-0">
          {itemValue.toUpperCase()}
        </span>
            </div>
        </Tooltip>);
};

export default TextAvatar;
