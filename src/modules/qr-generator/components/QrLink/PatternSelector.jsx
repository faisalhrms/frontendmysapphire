// const PatternSelector = ({ patterns, selectedPattern, onSelect }) => {
//
//     const colors = [
//         "text-danger",
//         "text-success",
//         "text-primary",
//         "text-warning",
//         "text-secondary",
//         "text-pink",
//     ];
//
//     return (
//         <div className="flex items-center justify-center bg-gray-100">
//             <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200 dark:bg-bodybg">Body Patterns</h3>
//             <div className="grid grid-cols-3 gap-3">
//                 {patterns.map((pattern, index) => (
//                     <button
//                         key={pattern.id}
//                         onClick={() => onSelect(pattern.id)}
//                         className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
//                             selectedPattern === pattern.id
//                                 ? "border-primary bg-purple-50"
//                                 : "border-gray-200 hover:border-primary"
//                         }`}
//                     >
//
//                         <div className={`text-2xl mb-2 ${colors[index % colors.length]}`}>
//                             {pattern.preview}
//                         </div>
//                         <div className="text-[0.875rem] mb-1 font-semibold">{pattern.name}</div>
//                     </button>
//                 ))}
//             </div>
//         </div>
//         </div>
//     );
// };
//
// export default PatternSelector;
import { X } from "lucide-react";

const PatternSelector = ({ patterns, selectedPattern, onSelect }) => {
    const colors = [
        "text-danger",
        "text-success",
        "text-primary",
        "text-warning",
        "text-secondary",
        "text-pink",
    ];

    return (
        <div className="flex items-center justify-center bg-gray-100">

            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200">
                    Body Patterns
                </h3>

                <div className="grid grid-cols-3 gap-3">

                    <button
                        type="button"
                        onClick={() => onSelect(null)}
                        className={`flex flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105 p-4
                            ${
                            !selectedPattern
                                ? "border-primary bg-purple-50"
                                : "border-gray-200 hover:border-primary"
                        }`}
                        title="Remove Pattern"
                    >
                        <div className="text-2xl mb-2 text-gray-400">
                            <X className="w-8 h-8" />
                        </div>

                    </button>

                    {/* 🎨 Pattern cards */}
                    {patterns.map((pattern, index) => (
                        <button
                            key={pattern.id}
                            onClick={() => onSelect(pattern.id)}
                            className={`flex flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105 p-4
                                ${
                                selectedPattern === pattern.id
                                    ? "border-primary bg-purple-50"
                                    : "border-gray-200 hover:border-primary"
                            }`}
                        >
                            <div className={`text-2xl mb-2 ${colors[index % colors.length]}`}>
                                {pattern.preview}
                            </div>
                            <div className="text-[0.875rem] mb-1 font-semibold">
                                {pattern.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatternSelector;
