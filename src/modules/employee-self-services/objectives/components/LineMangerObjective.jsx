import React from 'react';
import { Target, TrendingUp, Award, Shield } from 'lucide-react';
import LoadingSpinner from '@components/LoadingSpinner.jsx';
import EmptyState from '@components/EmptyState.jsx';

const LineMangerObjective = ({ details = []}) => {
    const getWeightageColor = (weightage) => {
        const weight = parseFloat(weightage);
        if (weight >= 30) return 'text-emerald-600 bg-emerald-100';
        if (weight >= 20) return 'text-amber-600 bg-amber-100';
        return 'text-blue-600 bg-blue-100';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                        }}
                    >
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Key Result Areas Line Manger</h2>
                        <p className="text-sm text-slate-600">
                            Performance objectives and key indicators
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-6 dark:text-gray-200 dark:bg-bodybg">
                    {details.map((kra, index) => (
                        <div
                            key={index}
                            className="group bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-slate-300/70 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div
                                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                }}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                            {kra.kra}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">
                                            <Award className="w-3 h-3" />
                                            <span>Key Result Area #{index + 1}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Weightage Badge */}
                                <div
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${getWeightageColor(
                                        kra.weightage
                                    )}`}
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-bold text-sm">{kra.weightage}%</span>
                                </div>
                            </div>

                            {/* KPI Content */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200/60">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-lg flex items-center justify-center mt-1">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-800 mb-2 text-sm">
                                            Key Performance Indicators
                                        </h4>
                                        <div className="prose prose-sm prose-slate max-w-none">
                                            {kra.kpi.includes('<') ? (
                                                <div
                                                    className="text-slate-700 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: kra.kpi }}
                                                />
                                            ) : (
                                                <p className="text-slate-700 leading-relaxed">
                                                    {kra.kpi}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(
                                                    (parseFloat(kra.weightage) / 50) * 100,
                                                    100
                                                )}%`
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        Weight Distribution
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                    <span className="text-xs text-slate-500 ml-2">Defined</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">
                                        Total KRAs Summary
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Complete performance framework
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {details
                                        .reduce(
                                            (sum, kra) => sum + parseFloat(kra.weightage),
                                            0
                                        )
                                        .toFixed(0)}
                                    %
                                </div>
                                <div className="text-sm text-slate-500">
                                    {details.length} Areas
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default LineMangerObjective;
