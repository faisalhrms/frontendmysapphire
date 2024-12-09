const calculateProgress = (total, completed) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

const ProgressBar = ({ total, completed, status = 'Completed', barColor = 'bg-primary' }) => {
    const progressValue = calculateProgress(total, completed);

    return (
        <div>
            <div
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow={progressValue}
                className="progress progress-xs progress-animate flex-grow me-2"
            >
                <div
                    className={`progress-bar ${barColor}`}
                    style={{ width: `${progressValue}%` }}
                ></div>
            </div>
            <div className="mt-1"><span className="text-primary font-semibold">{progressValue}%</span> {status}</div>
        </div>
    );
};

export default ProgressBar;
