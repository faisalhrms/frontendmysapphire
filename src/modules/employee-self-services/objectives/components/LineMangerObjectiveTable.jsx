import React from 'react';
import {Clock, Target, TrendingUp} from 'lucide-react';
import ExpandableText from "@modules/employee-self-services/objectives/components/ExpandableText.jsx";

const LineMangerObjectiveTable = ({ details = [] }) => {
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
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                        }}
                    >
                        <Target className="w-5 h-5"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg">
                            Key Result Areas Line Manager
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">
                            Performance objectives and key indicators
                        </p>
                    </div>
                </div>
            </div>

            <div className="accordion-body p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="table-responsive task-table overflow-hidden transition-all duration-300 min-h-[100px]">
                    <table className="table whitespace-nowrap table-bordered min-w-full border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 text-sm dark:text-gray-200 dark:bg-bodybg">
                        <tr>
                            <th style={{fontWeight: "bold"}} className="px-3 py-2 text-left border border-slate-200 dark:text-gray-200 dark:bg-bodybg">#
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-3 py-2 text-left border border-slate-200 dark:text-gray-200 dark:bg-bodybg">KRA
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-3 py-2 text-left border border-slate-200 dark:text-gray-200 dark:bg-bodybg">KPI
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-3 py-2 text-center border border-slate-200 dark:text-gray-200 dark:bg-bodybg">Weightage
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {details.map((kra, index) => (
                            <tr key={index} className="">
                                <td className="px-3 py-2 border border-slate-200 text-sm font-medium text-slate-700 dark:text-gray-200 dark:bg-bodybg">
                                    {index + 1}
                                </td>

                                <td style={{textAlign: "left"}}
                                    className="px-3 py-2 border border-slate-200 text-sm text-slate-900 dark:text-gray-200 dark:bg-bodybg">
                                    {kra.kra}
                                </td>

                                <td
                                    style={{textAlign: "left"}}
                                    className="text-left px-3 py-2 border border-slate-300 max-w-[350px] dark:text-gray-200 dark:bg-bodybg"
                                >
                                    <ExpandableText content={kra.kpi || ""} maxLength={100}/>
                                </td>

                                <td className="px-3 py-2 border border-slate-200 text-center">
                    <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-semibold text-xs  ${getWeightageColor(
                            kra.weightage
                        )}`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1"/>
                        {kra.weightage}%
                    </span>
                                </td>
                            </tr>
                        ))}

                        </tbody>

                    </table>

                </div>
            </div>
            <div
                className="mt-4  bg-gray-100 dark:text-gray-200 dark:bg-bodybg rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm dark:text-gray-200 dark:bg-bodybg">Total KRAs Summary</p>
                            <p className="text-xs text-slate-600 dark:text-gray-200 dark:bg-bodybg">Complete performance framework</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg"> {details.reduce((sum, kra) => sum + parseFloat(kra.weightage), 0).toFixed(0)}%</div>
                        <div className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">{details.length} Areas</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineMangerObjectiveTable;
