import React from "react";
import { ArrowUpRight, Percent } from "lucide-react";

const RetailSalesReturnRatioSnapshot = ({ ratio, loading, formatRoundedAmountWithCommas }) => {
    const salesAmount = Number(ratio?.sales_amount) || 0;
    const returnAmount = Number(ratio?.return_amount) || 0;
    const salesRatio = Number(ratio?.sales_ratio) || 0;
    const returnRatio = Number(ratio?.return_ratio) || 0;

    return (
        <div className="lg:col-span-4">
            <div className="h-[600px] bg-gradient-to-br from-black to-black to-indigo-700 rounded-xl shadow-xl p-6 relative overflow-hidden border border-slate-700/50">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-sm">
                                <Percent size={18} className="text-emerald-400" />
                            </div>
                            Sale vs Return
                        </h3>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 space-y-4">
                            <div className="h-32 bg-slate-700/50 rounded-lg animate-pulse" />
                            <div className="h-32 bg-slate-700/50 rounded-lg animate-pulse" />
                            <div className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-between">
                            {/* Ratio comparison */}
                            <div className="space-y-5 mb-6">
                                {/* Sales ratio */}
                                <div className="bg-gradient-to-r from-emerald-500/20 to-transparent backdrop-blur-sm p-5 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-sm text-slate-300 mb-1">Sales Ratio</p>
                                            <p className="text-xs text-slate-400 tabular-nums">
                                                PKR {formatRoundedAmountWithCommas(salesAmount)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-white tabular-nums">
                                                {salesRatio.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-success to-success rounded-full transition-all duration-700"
                                            style={{ width: `${Math.min(100, salesRatio)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Return ratio */}
                                <div className="bg-gradient-to-r from-rose-500/20 to-transparent backdrop-blur-sm p-5 rounded-lg border border-rose-500/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-sm text-slate-300 mb-1">Return Ratio</p>
                                            <p className="text-xs text-slate-400 tabular-nums">
                                                PKR {formatRoundedAmountWithCommas(returnAmount)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-white tabular-nums">
                                                {returnRatio.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700"
                                            style={{ width: `${Math.min(100, returnRatio)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-2">Total Sales</p>
                                    <p className="text-base font-bold text-white tabular-nums">
                                        PKR {formatRoundedAmountWithCommas(salesAmount)}
                                    </p>
                                </div>
                                <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-2">Total Returns</p>
                                    <p className="text-base font-bold text-white tabular-nums">
                                        PKR {formatRoundedAmountWithCommas(returnAmount)}
                                    </p>
                                </div>
                            </div>

                            {/* Visual comparison */}
                            <div className="mt-4 bg-slate-800/40 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                    <span>Distribution</span>
                                    <span>100%</span>
                                </div>
                                <div className="flex h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-400"
                                        style={{ width: `${salesRatio}%` }}
                                    />
                                    <div
                                        className="bg-gradient-to-r from-rose-500 to-rose-400"
                                        style={{ width: `${returnRatio}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                                        <span className="text-xs text-slate-400">Sales</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Returns</span>
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetailSalesReturnRatioSnapshot;