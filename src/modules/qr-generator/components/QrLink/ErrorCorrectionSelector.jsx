const ErrorCorrectionSelector = ({ levels, selected, onSelect }) => (
    <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg ">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200 dark:bg-bodybg">
                Scannability Level (Error Correction Level)
            </h2>
            <p className="text-[0.75rem] mb-4 text-[#8c9097] dark:text-white/50 ">
                By changing the error correction level, you can simplify or complicate the QR code pattern.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        onClick={() => onSelect(level.id)}
                        className={`
              cursor-pointer rounded-xl transition-all duration-300
              ${selected === level.id
                            ? "ring-2 ring-primary shadow-lg"
                            : "ring-1 ring-gray-300 hover:ring-2 hover:ring-primary"}
            `}
                    >
                        <div className="flex flex-col items-center text-center mt-4 mb-4 ml-4 mr-4">
                            <img
                                src={level?.image}
                                alt={`${level.name} QR code`}
                                className="w-32 h-32 rounded-lg mb-4 object-cover"
                            />
                            <h3 className="text-[0.875rem] mb-1 font-semibold">{level.name}</h3>
                            <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">{level.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ErrorCorrectionSelector;
