import React from "react";

const PercentageIcon = ({ parentClasses = 'text-[.6875rem] mb-0 leading-none', changeClass, arrowIconClass, percentage_change, ariaLabel = ''}) => {
    return (
        <p  className={`text-muted ${parentClasses}`}>
        {arrowIconClass && (
            <i
            className={`${arrowIconClass} me-1 align-middle ${changeClass}`}
            aria-label={ariaLabel}
        ></i>
        )}
        <span className={`${changeClass} me-1 font-semibold`}>{percentage_change}</span>
        <span>This Month</span>
    </p>)
}

export default PercentageIcon;