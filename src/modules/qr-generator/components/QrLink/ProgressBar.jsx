const ProgressBar = ({ progress = 33 }) => (
    <div className="flex items-center mb-6">
        <div className="flex-1 bg-purple-200 h-2 rounded-full">
            <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
);

export default ProgressBar;