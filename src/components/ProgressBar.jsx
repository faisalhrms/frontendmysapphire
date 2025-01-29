const calculateProgress = (total, completed) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};

const ProgressBar = ({ value = null, total = null, completed = null, status = 'Completed', barColor = 'bg-primary', withStatus = true}) => {
    const progressValue = value !== null ? value : calculateProgress(total, completed);
    {
        if (withStatus){
            return (
                <div>
                    <div
                        aria-valuemax="100"
                        aria-valuemin="0"
                        aria-valuenow={progressValue}
                        className="progress progress-xs progress-animate flex-grow me-2"
                    >
                        <div className={`progress-bar ${barColor}`} style={{ width: `${progressValue}%` }}></div>
                    </div>
                    <div className="mt-1"><span className="text-primary font-semibold">{progressValue}%</span> {status}</div>
                </div>
            );
        }else {
            return (
                <>
                    <div className="progress progress-xs progress-animate flex-grow me-2" style={{width: `${progressValue}%`}}>
                        <div className={`progress-bar ${barColor}`} style={{width: `${progressValue}%`}}></div>
                    </div>
                    <div className="text-[#8c9097] dark:text-white/50 text-[.6875rem]">{progressValue}%</div>
                </>
            )
        }
    }
};

export default ProgressBar;
