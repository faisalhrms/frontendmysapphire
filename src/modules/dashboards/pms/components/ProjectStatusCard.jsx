import React from 'react';
import {getChangeStyles, getStatusStyles} from "@helpers/statusStyles.js";
import CountUp from "react-countup";
import SvgIcon from "@components/SvgIcon.jsx";
import PercentageIcon from "@components/PercentageIcon.jsx";

const ProjectStatusCard = ({ item }) => {
    const { status, last_month, total, percentage_change } = item;
    const styles = getStatusStyles(status);
    const { changeClass, arrowIconClass, ariaLabel } = getChangeStyles(percentage_change);
    return (
        <div className="box">
            <div className="box-body">
                <div className="grid grid-cols-12">
                    <div className="col-span-8 pe-0">
                        <p className="mb-2">
                            <span className="text-[1rem] font-bold">{status}</span>
                        </p>
                        <p className="mb-2 text-[0.75rem]">
                            <span className="text-[1.5625rem] leading-none vertical-bottom mb-0">
                                <CountUp className="count-up" end={total} />
                            </span>
                        </p>
                        <PercentageIcon
                            parentClasses='text-[0.75rem] text-gray-600'
                            percentage_change={percentage_change}
                            arrowIconClass={arrowIconClass}
                            changeClass={changeClass}
                            ariaLabel={ariaLabel}
                        />
                    </div>
                    <div className="col-span-4 flex items-center justify-end">
                        <SvgIcon styles={styles} me='' />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProjectStatusCard;
