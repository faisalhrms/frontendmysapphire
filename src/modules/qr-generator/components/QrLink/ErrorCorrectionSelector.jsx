// const ErrorCorrectionSelector = ({ levels, selected, onSelect }) => (
//     <div className="flex items-center justify-center bg-gray-100">
//         <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Scannability Level (Error Correction Level)</h2>
//             <p className="text-gray-500 mb-8">By changing the error correction level, you can simplify or complicate the
//                 QR code pattern.</p>
//
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {levels.map((level) => (
//                     <div
//                         key={level.id}
//                         onClick={() => onSelect(level.id)}
//                         className={`
//                                 cursor-pointer rounded-xl transition-all duration-300
//                                 ${selected === level.id ? 'ring-2 ring-purple-600 shadow-lg' : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-purple-300'}
//                             `}
//                     >
//                         <div className="flex flex-col items-center text-center mt-4 mb-4 ml-4 mr-4">
//                             <img
//                                 src={level?.image}
//                                 alt={`${level.name} QR code`}
//                                 className="w-32 h-32 rounded-lg mb-4 object-cover"
//                             />
//                             <h3 className="font-semibold text-lg text-gray-800">{level.name}</h3>
//                             <p className="text-sm text-gray-500">{level.description}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
// );
//
// export default ErrorCorrectionSelector;
//
//
const ErrorCorrectionSelector = ({ levels, selected, onSelect }) => (
    <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Scannability Level (Error Correction Level)
            </h2>
            <p className="text-gray-500 mb-8">
                By changing the error correction level, you can simplify or complicate the QR code pattern.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        onClick={() => onSelect(level.id)}
                        className={`
              cursor-pointer rounded-xl transition-all duration-300
              ${selected === level.id
                            ? "ring-2 ring-purple-600 shadow-lg"
                            : "ring-1 ring-gray-200 hover:ring-2 hover:ring-purple-300"}
            `}
                    >
                        <div className="flex flex-col items-center text-center mt-4 mb-4 ml-4 mr-4">
                            <img
                                src={level?.image}
                                alt={`${level.name} QR code`}
                                className="w-32 h-32 rounded-lg mb-4 object-cover"
                            />
                            <h3 className="font-semibold text-lg text-gray-800">{level.name}</h3>
                            <p className="text-sm text-gray-500">{level.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ErrorCorrectionSelector;
