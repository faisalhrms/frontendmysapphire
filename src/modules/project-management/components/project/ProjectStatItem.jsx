import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import {getChangeStyles, getStatusStyles} from "@helpers/statusStyles.js";
import PercentageIcon from "@components/PercentageIcon.jsx";

const ProjectStatItem = ({ item }) => {
    const { status, last_month, total, percentage_change } = item;
    const styles = getStatusStyles(status);
    const { changeClass, arrowIconClass, ariaLabel } = getChangeStyles(percentage_change);

    return (
        <div className="p-6 border-b dark:border-defaultborder/10 border-dashed flex items-start">
            <div className={`svg-icon-background ${styles.background} ${styles.text} !${styles.svgFill} me-6`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    className={`${styles.svgColor}`}
                >
                    <path
                        d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"
                    />
                </svg>
            </div>
            <div className="flex-grow">
                <h6 className="!mb-1 text-[0.75rem] flex justify-between items-center">
                    {status} Tasks
                    <span className={`badge ${styles.badge} text-white font-semibold`}>
                        {last_month}
                    </span>
                </h6>
                <div className="pb-0 mt-0">
                    <div>
                        <h4 className="text-[1.125rem] font-semibold mb-1">
                            <CountUp className="count-up" end={total} />
                            <span className="text-muted ltr:float-right rtl:float-left text-[.6875rem] font-normal">
                                Last Month
                            </span>
                        </h4>
                        <PercentageIcon percentage_change={percentage_change} arrowIconClass={arrowIconClass} changeClass={changeClass} ariaLabel={ariaLabel} />
                    </div>
                </div>
            </div>
        </div>
    );

};

ProjectStatItem.propTypes = {
    item: PropTypes.shape({
        status: PropTypes.string.isRequired,
        last_month: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        percentage_change: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProjectStatItem;
