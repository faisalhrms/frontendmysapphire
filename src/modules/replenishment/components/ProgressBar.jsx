import React, { useEffect, useState } from "react";
import '@assets/css/custom/ProgressBar.css';

const ProgressBar = ({ progress = 0 }) => {
    const [progressWidth, setProgressWidth] = useState(progress);

    useEffect(() => {
        setProgressWidth(progress);
    }, [progress]);

    return (
        <div className={`progress progress-xl mb-4 progress-animate custom-progress-4 primary`}
             aria-valuenow={progressWidth} aria-valuemin={0} aria-valuemax={100}>
            <div style={{width: `${progressWidth}%`}}
                 className={`progress-bar !rounded-sm bg-primary-gradient ${progressWidth < 100 ? "shimmer-effect" : ""}`}></div>
            <div className="progress-bar-label">{progressWidth}%</div>
        </div>
    )
        ;
};

export default ProgressBar;
