import React from "react";
import { ArrowUpRight, Shuffle } from "lucide-react";

const RetailExchangesSnapshot = ({ exchanges, loading, formatRoundedAmountWithCommas }) => {
    const txnCount = Number(exchanges?.txn_count) || 0;
    const saleQty = Number(exchanges?.sale_qty) || 0;
    const returnQty = Number(exchanges?.return_qty) || 0;
    const withRef = Number(exchanges?.with_ref) || 0;
    const withoutRef = Number(exchanges?.without_ref) || 0;

    const totalReturns = withRef + withoutRef;
    const withPct = totalReturns > 0 ? ((withRef / totalReturns) * 100).toFixed(1) : "0.0";
    const withoutPct = totalReturns > 0 ? ((withoutRef / totalReturns) * 100).toFixed(1) : "0.0";

    return (
        <div className="lg:col-span-4">
            <div className="h-[600px] bg-gradient-to-br from-red to-orange rounded-xl shadow-xl p-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm">
                                <Shuffle size={18} className="text-indigo-400" />
                            </div>
                            Exchanges Snapshot
                        </h3>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
                                <div className="h-10 w-32 bg-slate-700/50 rounded animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mb-1 font-medium">Total Transactions</p>
                                <p className="text-3xl font-bold text-white tabular-nums">
                                    {formatRoundedAmountWithCommas(txnCount)}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Metrics */}
                    <div className="flex-1 space-y-3">
                        {loading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-[72px] bg-slate-700/50 rounded-lg animate-pulse" />
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">Sale Qty</p>
                                            <p className="text-xs text-white/70">Items sold in exchanges</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(saleQty)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">Return Qty</p>
                                            <p className="text-xs text-white/70">Items returned in exchanges</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(returnQty)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">Return With Receipt</p>
                                            <p className="text-xs text-white/70">{withPct}% of total returns</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(withRef)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-success to-success rounded-full transition-all duration-500"
                                            style={{ width: `${withPct}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white">Return Without Receipt</p>
                                            <p className="text-xs text-white/70">{withoutPct}% of total returns</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(withoutRef)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                                            style={{ width: `${withoutPct}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailExchangesSnapshot;