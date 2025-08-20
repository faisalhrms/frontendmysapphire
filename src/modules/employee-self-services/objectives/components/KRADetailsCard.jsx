import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import {QuarterDisplayCompact} from "@modules/employee-self-services/objectives/components/quarter-display-compact.jsx";

const KRADetailsCard = ({heading="Key Result Areas", details }) => {
    const getWeightageColor = (weightage) => {
        const weight = parseFloat(weightage);
        if (weight >= 30) return 'text-emerald-600 bg-emerald-100';
        if (weight >= 20) return 'text-amber-600 bg-amber-100';
        return 'text-blue-600 bg-blue-100';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            {/* Header */}
            <div className="bg-gray-100 to-white border-b border-slate-200 px-6 py-4 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center space-x-3 dark:bg-bodybg dark:text-gray-200">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                         style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg">{heading}</h2>
                        <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">Performance objectives and key indicators</p>
                    </div>
                </div>
            </div>

            {/* KRA List */}
            <div className="p-6 space-y-6 dark:text-gray-200 dark:bg-bodybg">
                {details.map((kra, index) => (
                    <div key={index} className="group bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-slate-300/70 dark:text-gray-200 dark:bg-bodybg">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                             style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>
                                            {index + 1}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>

                                <div className="flex-1 dark:text-gray-200 dark:bg-bodybg">
                                    <h3 className="text-lg font-semibold text-slate-900  mb-1 dark:text-gray-200 dark:bg-bodybg">
                                        {kra.kra}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">
                                        <Award className="w-3 h-3" />
                                        <span>Key Result Area #{index + 1}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Weightage Badge */}
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${getWeightageColor(kra.weightage)}`}>
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-bold text-sm">{kra.weightage}%</span>
                            </div>
                        </div>

                        {/* KPI Content */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200/60 relative overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                            <div className="flex items-start space-x-3 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                                <div
                                    className="flex-shrink-0 w-6 h-6 bg-primary rounded-lg flex items-center justify-center mt-1 dark:text-gray-200 dark:bg-bodybg">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div className="flex-1 space-y-4 dark:text-gray-200 dark:bg-bodybg">
                                    {/* KPI Heading */}
                                    <h4 className="font-semibold text-slate-800 mb-2 text-sm dark:text-gray-200 dark:bg-bodybg">
                                        Key Performance Indicators
                                    </h4>
                                    <div className="prose prose-sm prose-slate max-w-none dark:text-gray-200 dark:bg-bodybg">
                                        {kra.kpi?.includes('<') ? (
                                            <div
                                                className="text-slate-700 leading-relaxed dark:text-gray-200 dark:bg-bodybg"
                                                dangerouslySetInnerHTML={{__html: kra.kpi}}
                                            />
                                        ) : (
                                            <p className="text-slate-700 leading-relaxed dark:text-gray-200 dark:bg-bodybg">{kra.kpi}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mb-6 dark:text-gray-200 dark:bg-bodybg">
                                        {kra.quarter && (
                                            <div className="flex items-center gap-3 dark:text-gray-200 dark:bg-bodybg">
                                                <div className="flex items-center gap-2 dark:text-gray-200 dark:bg-bodybg">

                                                    <div className="flex flex-wrap items-center gap-2 dark:text-gray-200 dark:bg-bodybg">
                                                        <QuarterDisplayCompact quarter={kra.quarter}/>
                                                    </div>

                                                </div>
                                            </div>
                                        )}

                                        {kra.priority && (
                                            <div
                                                className={`absolute top-2 right-2 text-white text-xs font-bold uppercase px-2 py-1  ${
                                                    kra.priority.toLowerCase() === "high"
                                                        ? "bg-danger"
                                                        : kra.priority.toLowerCase() === "medium"
                                                            ? "bg-primary"
                                                            : "bg-success"
                                                }`}
                                                style={{
                                                    borderRadius: '3px',
                                                    zIndex: 10
                                                }}>
                                                {kra.priority}
                                            </div>
                                          
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    {Array.isArray(kra.attachments) && kra.attachments.length > 0 && (
                                        <div className="border-t border-slate-100 pt-5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-800 dark:text-gray-200 dark:bg-bodybg">ATTACHMENTS</h5>
                                                    <p className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">{kra.attachments.length} file{kra.attachments.length > 1 ? 's' : ''} attached</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {kra.attachments.map((file) => {
                                                    const isImage = file.file_type === "image";
                                                    const fileSizeKB = (file.file_size / 1024).toFixed(1);

                                                    return (
                                                        <a
                                                            key={file.id}
                                                            href={file.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group relative"
                                                        >
                                                            {isImage ? (
                                                                <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                                                    <img
                                                                        src={file.small_url || file.medium_url || file.file_url}
                                                                        alt={file.file_name}
                                                                        className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-white text-xs font-medium truncate pr-2">
                                                                                {file.file_name}
                                                                            </span>
                                                                            <div className="flex-shrink-0 w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center h-28 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-3 group-hover:bg-slate-50">
                                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                                                                        <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-xs font-medium text-slate-700 text-center truncate w-full mb-1">
                                                                        {file.file_name}
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-[10px] text-slate-500">{file.file_extension?.toUpperCase()}</span>
                                                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                                        <span className="text-[10px] text-slate-500">{fileSizeKB} KB</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                                                                    <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}



                                </div>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                        style={{width: `${Math.min((parseFloat(kra.weightage) / 50) * 100, 100)}%`}}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">Weight Distribution</span>
                            </div>

                            <div className="flex items-center space-x-1 dark:text-gray-200 dark:bg-bodybg ">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                <span className="text-xs text-slate-500 ml-2 dark:text-gray-200 dark:bg-bodybg">Defined</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Summary Card */}
                <div className="bg-gray-100 rounded-2xl p-6 border border-blue-200/50 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Target className="w-6 h-6"/>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-gray-200 dark:bg-bodybg">Total KRAs Summary</h4>
                                <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">Complete performance framework</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-gray-200 dark:bg-bodybg">
                                {details.reduce((sum, kra) => sum + parseFloat(kra.weightage), 0).toFixed(0)}%
                            </div>
                            <div className="text-sm text-slate-500 dark:text-gray-200 dark:bg-bodybg">{details.length} Areas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KRADetailsCard;