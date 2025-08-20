import React from "react";
import {Clock, Paperclip, Target, TrendingUp} from "lucide-react";
import {QuarterDisplayCompact} from "@modules/employee-self-services/objectives/components/quarter-display-compact.jsx";
import ExpandableText from "@modules/employee-self-services/objectives/components/ExpandableText.jsx";


const KRADetailsTable = ({ details }) => {

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "bg-danger/10 text-xs font-bold uppercase text-danger";
            case "medium":
                return "text-primary text-xs font-bold uppercase bg-primary/10";
            case "low":
                return "text-success text-xs font-bold uppercase bg-success/10";
            default:
                return "text-white text-xs font-bold uppercase px-2 py-1 bg-slate-100";
        }
    };
    const getWeightageColor = (weightage) => {
        const weight = parseFloat(weightage);
        if (weight >= 30) return 'text-emerald-600 bg-emerald-100';
        if (weight >= 20) return 'text-amber-600 bg-amber-100';
        return 'text-blue-600 bg-blue-100';
    };



    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            <div className="dark:text-gray-200 dark:bg-bodybg border-b border-slate-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                         style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                        <Target className="w-5 h-5"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg">Key Result Areas</h2>
                        <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">Performance objectives and key indicators</p>
                    </div>
                </div>
            </div>
            <div className="accordion-body dark:text-gray-200 dark:bg-bodybg">
                <div className="table-responsive task-table overflow-hidden transition-all duration-300 min-h-[100px]">
                    <table className="table whitespace-nowrap table-bordered min-w-full">
                        <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th style={{fontWeight: "bold"}} className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">#
                            </th>
                            <th style={{fontWeight: "bold"}} className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">Key
                                Result Area
                            </th>
                            <th style={{fontWeight: "bold"}} className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">KPI
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">Weightage
                            </th>

                            <th style={{fontWeight: "bold"}}
                                className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">Priority
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">Quarter
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">Attachment
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-slate-800">
                        {details.map((kra, index) => (
                            <tr
                                key={index}
                                className=""
                            >
                                <td className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">{index + 1}</td>
                                <td style={{textAlign: "left"}}
                                    className="text-left px-3 py-2 border border-slate-300 dark:text-gray-200 dark:bg-bodybg">{kra.kra}</td>
                                <td
                                    style={{textAlign: "left"}}
                                    className="text-left px-3 py-2 border border-slate-300 max-w-[350px] dark:text-gray-200 dark:bg-bodybg"
                                >
                                    <ExpandableText content={kra.kpi || ""}/>
                                </td>


                                <td className="px-3 py-2 border border-slate-200 text-center">
                               <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-semibold text-xs ${getWeightageColor(
                                 kra.weightage
                              )}`}
                                >
                                <TrendingUp className="w-3 h-3 mr-1"/>
                                  {kra.weightage}%
                                   </span>
                                </td>
                                <td className={`text-left px-3 py-2 border border-slate-300 ${getPriorityClass(kra.priority)}`}>
                           <span className="font-medium">
                               {kra.priority}
                                 </span>
                                </td>
                                <td className="text-left px-3 py-2 border border-slate-300">
                                    <QuarterDisplayCompact quarter={kra.quarter}/>
                                </td>
                                <td className="text-left px-3 py-2 border border-slate-300">
                                    {(() => {
                                        const [expanded, setExpanded] = React.useState(false);

                                        if (!Array.isArray(kra.attachments) || kra.attachments.length === 0) {
                                            return <span className="text-slate-400 text-sm italic">No File</span>;
                                        }

                                        const maxVisible = 2;
                                        const visibleFiles = expanded
                                            ? kra.attachments
                                            : kra.attachments.slice(0, maxVisible);
                                        const hasMore = kra.attachments.length > maxVisible;

                                        return (
                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    {visibleFiles.map((file, idx) => {
                                                        const isImage = file.file_type === "image";
                                                        const fileSizeKB = (file.file_size / 1024).toFixed(1);

                                                        return (
                                                            <a
                                                                key={file.id || idx}
                                                                href={file.file_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group relative flex-1 min-w-[45%] max-w-[48%]" // 2 per row
                                                            >
                                                                {isImage ? (
                                                                    <div
                                                                        className="relative overflow-hidden rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white h-20">
                                                                        <img
                                                                            src={
                                                                                file.small_url || file.medium_url || file.file_url
                                                                            }
                                                                            alt={file.file_name}
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                        <div
                                                                            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                                        <div
                                                                            className="absolute bottom-0 left-0 right-0 p-1">
                      <span className="text-white text-[10px] font-medium truncate block">
                        {file.file_name}
                      </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="flex flex-col items-center justify-center h-20 rounded-md border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-1">
                                                                        <div
                                                                            className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center mb-1">
                                                                            <svg
                                                                                className="w-3 h-3 text-slate-500"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <span
                                                                            className="text-[10px] font-medium text-slate-700 truncate w-full text-center">
                                                                               {file.file_name}
                                                                                     </span>
                                                                        <span className="text-[9px] text-slate-500">
                                                                       {file.file_extension?.toUpperCase()} · {fileSizeKB}KB
                                                                               </span>
                                                                    </div>
                                                                )}

                                                                <div
                                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <div
                                                                        className="w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                                                                        <svg
                                                                            className="w-3 h-3 text-slate-600"
                                                                            fill="currentColor"
                                                                            viewBox="0 0 20 20"
                                                                        >
                                                                            <path
                                                                                d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                                                            <path
                                                                                d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>

                                                {hasMore && (
                                                    <button
                                                        onClick={() => setExpanded(!expanded)}
                                                        className="text-primary hover:text-primary-800 text-xs font-medium mt-2 flex items-center transition-colors"
                                                    >
                                                        {expanded ? (
                                                            <>
                                                                <i className="ri-arrow-up-s-line mr-1"></i>
                                                                Show Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="ri-arrow-down-s-line mr-1"></i>
                                                                Read More
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div
                className="mt-4 bg-gray-100 dark:text-gray-200 dark:bg-bodybg rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Target className="w-6 h-6"/>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm dark:text-gray-200 dark:bg-bodybg">Total KRAs Summary</p>
                            <p className="text-xs text-slate-600 dark:text-gray-200 dark:bg-bodybg">Complete performance framework</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div
                            className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg"> {details.reduce((sum, kra) => sum + parseFloat(kra.weightage), 0).toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">{details.length} Areas</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KRADetailsTable;
