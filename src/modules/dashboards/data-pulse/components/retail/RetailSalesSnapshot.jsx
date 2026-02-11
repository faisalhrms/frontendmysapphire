import React, { useMemo } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const RetailSalesSnapshot = ({ sales, loading, formatRoundedAmountWithCommas }) => {
    const totalSale = Number(sales?.total_sale) || 0;

    const tenderSales = useMemo(() => {
        const list = Array.isArray(sales?.tender_sales_by_name) ? sales.tender_sales_by_name : [];
        return list
            .map((x) => ({
                name: x?.name ?? x?.NAME ?? "Unknown",
                amount: Number(x?.amount ?? x?.AMOUNT ?? 0) || 0,
            }))
            .sort((a, b) => (b.amount || 0) - (a.amount || 0));
    }, [sales]);

    return (
        <div className="lg:col-span-4">
            <div className="h-[600px] bg-gradient-to-br from-black to-green rounded-xl shadow-xl p-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                                <TrendingUp size={18} className="text-blue-400" />
                            </div>
                            Sales Snapshot
                        </h3>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse" />
                                <div className="h-10 w-48 bg-slate-700/50 rounded animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-white/70 mb-1 font-medium">Total Net Sale</p>
                                <p className="text-3xl font-bold text-white tabular-nums">
                                    PKR {formatRoundedAmountWithCommas(totalSale)}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Tender list - scrollable */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {loading ? (
                                <>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-[72px] bg-white/10 rounded-lg animate-pulse" />
                                    ))}
                                </>
                            ) : tenderSales.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-white/70 text-sm">
                                    No tender sales data available
                                </div>
                            ) : (
                                tenderSales.map((t, idx) => {
                                    const percentage = totalSale > 0 ? ((t.amount / totalSale) * 100).toFixed(1) : "0.0";
                                    return (
                                        <div
                                            key={`${t.name}-${idx}`}
                                            className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{t.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white tabular-nums">
                                                        PKR {formatRoundedAmountWithCommas(t.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-success to-success rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-white/70 tabular-nums min-w-[3rem] text-right">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(71, 85, 105, 0.2);
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.4);
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(148, 163, 184, 0.6);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default RetailSalesSnapshot;