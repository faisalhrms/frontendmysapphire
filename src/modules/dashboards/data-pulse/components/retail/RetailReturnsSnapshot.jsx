import React, { useMemo } from "react";
import { ArrowUpRight, RotateCcw, Receipt, ArrowLeftRight, Clock } from "lucide-react";

const normalizeLoading = (loading) => {
    if (typeof loading === "object" && loading !== null) {
        return {
            totals: !!loading.totals,
            split: !!loading.split,
            mismatch: !!loading.mismatch,
            late: !!loading.late,
        };
    }
    const b = !!loading;
    return { totals: b, split: b, mismatch: b, late: b };
};

const RetailReturnsSnapshot = ({ returns, loading, formatRoundedAmountWithCommas }) => {
    const L = normalizeLoading(loading);

    // Totals
    const returnQtyTotal = Number(returns?.return_qty_total) || 0;
    const returnAmtInclTax = Number(returns?.return_amount_incl_tax_total) || 0;

    // Split
    const withReceiptQty = Number(returns?.return_qty_with_receipt) || 0;
    const withoutReceiptQty = Number(returns?.return_qty_without_receipt) || 0;

    const withPct = returnQtyTotal > 0 ? ((withReceiptQty / returnQtyTotal) * 100).toFixed(1) : "0.0";
    const withoutPct = returnQtyTotal > 0 ? ((withoutReceiptQty / returnQtyTotal) * 100).toFixed(1) : "0.0";

    // Mismatch
    const mismatchRows = useMemo(() => {
        const list = Array.isArray(returns?.payment_method_mismatch) ? returns.payment_method_mismatch : [];
        return list
            .map((r) => ({
                returned_method: r?.returned_method ?? "Unknown",
                original_method: r?.original_method ?? "Unknown",
                txn_count: Number(r?.txn_count) || 0,
                returned_amount: Number(r?.returned_amount) || 0,
            }))
            .sort((a, b) => (b.returned_amount || 0) - (a.returned_amount || 0));
    }, [returns]);

    const mismatchTxnTotal = mismatchRows.reduce((s, r) => s + r.txn_count, 0);
    const mismatchAmtTotal = mismatchRows.reduce((s, r) => s + r.returned_amount, 0);

    // Late
    const late = returns?.late_returns || {};
    const lateTxnCount = Number(late?.txn_count) || 0;
    const lateQtyTotal = Number(late?.qty_total) || 0;
    const lateAmtInclTax = Number(late?.amount_incl_tax_total) || 0;

    return (
        <div className="lg:col-span-12">
            <div className="bg-gradient-to-br from-black to-red rounded-xl shadow-xl p-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="p-2 bg-red-500/20 rounded-lg backdrop-blur-sm">
                                <RotateCcw size={18} className="text-red" />
                            </div>
                            Returns Snapshot
                        </h3>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-6">
                        {L.totals ? (
                            <div className="space-y-2">
                                <div className="h-4 w-48 bg-slate-700/50 rounded animate-pulse" />
                                <div className="h-12 w-64 bg-slate-700/50 rounded animate-pulse" />
                                <div className="h-3 w-32 bg-slate-700/50 rounded animate-pulse" />
                            </div>
                        ) : (
                            <div className="bg-black/60 backdrop-blur-sm p-5 rounded-lg border border-slate-700/50">
                                <p className="text-xs text-white/70 mb-2 font-medium">Total Returns (Incl. Tax)</p>
                                <p className="text-4xl font-bold text-white tabular-nums mb-2">
                                    PKR {formatRoundedAmountWithCommas(returnAmtInclTax)}
                                </p>
                                <p className="text-sm text-white/70 tabular-nums">
                                    Qty: {formatRoundedAmountWithCommas(returnQtyTotal)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Three columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Receipt Split */}
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-5 border border-slate-700/50">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Receipt size={16} className="text-blue-400" />
                                Receipt Split
                            </h4>

                            {L.split ? (
                                <div className="space-y-3">
                                    <div className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
                                    <div className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Return With Receipt</p>
                                                <p className="text-xs text-white/70">{withPct}% of total</p>
                                            </div>
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(withReceiptQty)}
                                            </p>
                                        </div>
                                        <div className="h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-red to-red rounded-full transition-all duration-500"
                                                style={{ width: `${withPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Return Without Receipt</p>
                                                <p className="text-xs text-white/70">{withoutPct}% of total</p>
                                            </div>
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(withoutReceiptQty)}
                                            </p>
                                        </div>
                                        <div className="h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${withoutPct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Method Mismatch */}
                        <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-5 border border-slate-700/50">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <ArrowLeftRight size={16} className="text-orange-400" />
                                Method Mismatch
                            </h4>

                            {L.mismatch ? (
                                <div className="h-24 bg-slate-700/50 rounded-lg animate-pulse mb-4" />
                            ) : (
                                <div className="bg-danger/50 p-4 rounded-lg border border-red mb-4">
                                    <p className="text-xs text-white/70 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-white tabular-nums mb-1">
                                        PKR {formatRoundedAmountWithCommas(mismatchAmtTotal)}
                                    </p>
                                    <p className="text-xs text-white/70 tabular-nums">
                                        Transactions: {formatRoundedAmountWithCommas(mismatchTxnTotal)}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {L.mismatch ? (
                                    <>
                                        <div className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
                                        <div className="h-16 bg-slate-700/50 rounded-lg animate-pulse" />
                                    </>
                                ) : mismatchRows.length === 0 ? (
                                    <p className="text-sm text-white/70 italic text-center py-4">No mismatches</p>
                                ) : (
                                    mismatchRows.map((r, idx) => (
                                        <div
                                            key={`${r.returned_method}-${idx}`}
                                            className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-white truncate">
                                                        {r.returned_method}
                                                    </p>
                                                    <p className="text-xs text-white/70 truncate">
                                                        From: {r.original_method}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-white tabular-nums">
                                                        PKR {formatRoundedAmountWithCommas(r.returned_amount)}
                                                    </p>
                                                    <p className="text-xs text-white/70 tabular-nums">
                                                        {r.txn_count} txns
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Late Returns */}
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-5 border border-slate-700/50">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-red-400" />
                                Late Returns
                            </h4>

                            {L.late ? (
                                <div className="space-y-3">
                                    <div className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
                                    <div className="h-20 bg-slate-700/50 rounded-lg animate-pulse" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Late Transactions</p>
                                                <p className="text-xs text-white/70">After closing</p>
                                            </div>
                                            <p className="text-lg font-bold text-white tabular-nums">
                                                {formatRoundedAmountWithCommas(lateTxnCount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Late Amount</p>
                                                <p className="text-xs text-white/70">Incl. Tax</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-white tabular-nums">
                                            PKR {formatRoundedAmountWithCommas(lateAmtInclTax)}
                                        </p>
                                        <p className="text-xs text-white/70 tabular-nums mt-1">
                                            Qty: {formatRoundedAmountWithCommas(lateQtyTotal)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(71, 85, 105, 0.2);
                        border-radius: 2px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.4);
                        border-radius: 2px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(148, 163, 184, 0.6);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default RetailReturnsSnapshot;