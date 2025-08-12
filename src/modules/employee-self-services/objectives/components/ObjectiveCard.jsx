import React from 'react';
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import FormInput from "@components/form/FormInput.jsx";

const ObjectiveCard = ({
                           objective,
                           index,
                           control,
                           errors,
                           onRemove,
                           canRemove
                       }) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                                <span className="text-sm font-bold text-white">
                                  {index + 1}
                                </span>
                            </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 tracking-tight ">
                                Key Result Area {index + 1}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Define measurable outcomes and performance indicators
                            </p>
                        </div>
                    </div>

                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-danger"
                            title="Remove KRA"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
                {/* KRA and Weightage Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 tracking-wide dark:text-gray-200 dark:bg-bodybg">
                                Key Result Area
                                <span className="text-red ml-1">*</span>
                            </label>
                            <FormInput
                                name={`objectives.${index}.kra`}
                                control={control}
                                errors={errors}
                                label={false}
                                placeholder="e.g., Sales Performance, Customer Satisfaction, Process Improvement..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-300"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 tracking-wide dark:text-gray-200 dark:bg-bodybg">
                                Weightage (%)
                                <span className="text-red ml-1">*</span>
                            </label>
                            <div className="relative">
                                <FormInput
                                    label={false}
                                    name={`objectives.${index}.weightage`}
                                    control={control}
                                    errors={errors}
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="10"
                                    className="w-full px-4 py-3 pr-8 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 tracking-wide dark:text-gray-200 dark:bg-bodybg">
                                Key Performance Indicators & Objectives
                                <span className="text-red ml-1">*</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed dark:text-gray-200 dark:bg-bodybg">
                                Define specific, measurable, achievable, relevant, and time-bound objectives for this KRA
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-200/80 overflow-hidden">
                        <FormRichTextarea
                            name={`objectives.${index}.kpi`}
                            control={control}
                            errors={errors}
                            editorOptions={{
                                height: 180,
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <span>KRA #{index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
        </div>
    );
};

export default ObjectiveCard;