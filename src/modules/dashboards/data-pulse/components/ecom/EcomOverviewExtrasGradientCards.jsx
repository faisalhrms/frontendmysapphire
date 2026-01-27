import React, { useMemo } from "react";
import { CreditCard, Landmark, ArrowUpRight } from "lucide-react";

const PulseLine = () => (
    <div className="relative w-full h-10 flex items-center">
        <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/15"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-glow-extra)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan blur-[2px]"
                style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
            />
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-gradient-extra)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan"
                style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
            />
            <circle cx="0" cy="20" r="2.5" fill="currentColor" className="text-white animate-pulse-dot">
                <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
            </circle>

            <defs>
                <linearGradient id="pulse-gradient-extra" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/20" stopOpacity="0.2" />
                    <stop offset="30%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="70%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/20" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pulse-glow-extra" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                    <stop offset="50%" stopColor="currentColor" className="text-white/40" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>

        <div className="absolute -bottom-3 left-0 flex items-center space-x-2">
            <div className="flex space-x-1">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-[9px] uppercase tracking-wider text-white/60 font-semibold">Analyzing</span>
        </div>
    </div>
);

const EcomOverviewExtrasGradientCards = ({
                                             loading = false,
                                             summary = {}, // kpiExtraResp?.summary
                                             formatRoundedAmountWithCommas,
                                             DateInfo,
                                         }) => {
    const styles = `
    @keyframes pulseScan {
      0% { stroke-dashoffset: 400; }
      50% { stroke-dashoffset: 200; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes pulseDot {
      0% { cx: 0; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { cx: 200; opacity: 0; }
    }
    .animate-pulse-scan { animation: pulseScan 2.5s cubic-bezier(0.4,0,0.2,1) infinite; }
    .animate-pulse-dot { animation: pulseDot 2.5s cubic-bezier(0.4,0,0.2,1) infinite; }
  `;

    const fmtPKR = (v) => `PKR ${formatRoundedAmountWithCommas(Number(v) || 0)}`;

    const emp = summary?.employee_discount || {};
    const pg = summary?.payment_gateway || {};
    const pgRows = useMemo(() => (Array.isArray(pg?.rows) ? pg.rows : []), [pg]);

    const empDiscountSum = Number(emp?.emp_discount_sum) || 0;
    const empDiscountOrderCount = Number(emp?.emp_discount_order_count) || 0;

    const totalGatewayAmount = Number(pg?.total_amount_sum) || 0;

    return (
        <>
            <style>{styles}</style>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Employee Discount */}
                <div className="lg:col-span-6 bg-gradient-to-br from-blue to-purple rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-16 -mt-16" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <CreditCard size={20} /> Employee Discount
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <ArrowUpRight className="text-white" size={22} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/80">Discount Amount</p>
                                {loading ? (
                                    <PulseLine />
                                ) : (
                                    <p className="text-4xl font-bold text-white tabular-nums">{fmtPKR(empDiscountSum)}</p>
                                )}

                                {!loading && (
                                    <p className="text-xs text-white/70 mt-1">
                                        Orders: {formatRoundedAmountWithCommas(empDiscountOrderCount)}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/25 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-white/70">Range</p>
                                {!loading ? <p className="text-xs text-white/90 mt-1"><DateInfo /></p> : <div className="h-8"><PulseLine /></div>}
                            </div>

                            {/* optional small scroll section (future proof) */}
                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                                Watch for unusual spikes in employee card usage.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Gateway Mix (scroll all methods) */}
                <div className="lg:col-span-6 bg-gradient-to-br from-black to-black rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Landmark size={20} /> Payment Gateways
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <ArrowUpRight className="text-white" size={22} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/80">Total Paid Amount</p>
                                {loading ? (
                                    <PulseLine />
                                ) : (
                                    <p className="text-4xl font-bold text-white tabular-nums">{fmtPKR(totalGatewayAmount)}</p>
                                )}
                                {!loading && (
                                    <p className="text-xs text-white/70 mt-1">
                                        Methods: {pgRows.length || 0}
                                    </p>
                                )}
                            </div>

                            {/* ✅ scroll all methods */}
                            <div className="pt-4 border-t border-white/30 space-y-3 max-h-[140px] overflow-y-auto pr-2">
                                {loading ? (
                                    <>
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                                            <PulseLine />
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                                            <PulseLine />
                                        </div>
                                    </>
                                ) : pgRows.length ? (
                                    pgRows.map((row, idx) => (
                                        <div
                                            key={`${row?.PaymentGatewayName || "pg"}-${idx}`}
                                            className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {row?.PaymentGatewayName || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-white/70 truncate">
                                                        Share:{" "}
                                                        {totalGatewayAmount > 0
                                                            ? `${((Number(row?.amount_sum || 0) / totalGatewayAmount) * 100).toFixed(2)}%`
                                                            : "0.00%"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white tabular-nums">
                                                        {fmtPKR(Number(row?.amount_sum || 0))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-center border border-white/10">
                                        <p className="text-xs text-white">No payment gateway data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EcomOverviewExtrasGradientCards;
