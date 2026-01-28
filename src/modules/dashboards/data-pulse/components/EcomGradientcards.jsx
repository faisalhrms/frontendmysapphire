import React from 'react';
import { TrendingUp, BadgePercent, ShieldAlert, ArrowUpRight, AlertTriangle, Ban, RotateCcw } from 'lucide-react';

// PulseLine component for loading states
const PulseLine = () => (
    <div className="relative w-full h-10 flex items-center">
        <svg
            className="w-full h-10 overflow-visible"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
        >
            {/* Background Static Line (Ghost Path) */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/15"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Glow effect underneath */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-glow)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan blur-[2px]"
                style={{
                    strokeDasharray: '200',
                    strokeDashoffset: '200',
                }}
            />

            {/* Main Animated Pulse Line */}
            <path
                d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                fill="none"
                stroke="url(#pulse-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse-scan"
                style={{
                    strokeDasharray: '200',
                    strokeDashoffset: '200',
                }}
            />

            {/* Moving dot at the end of the pulse */}
            <circle
                cx="0"
                cy="20"
                r="2.5"
                fill="currentColor"
                className="text-white animate-pulse-dot"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>

            <defs>
                <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/20" stopOpacity="0.2" />
                    <stop offset="30%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="70%" stopColor="currentColor" className="text-white" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/20" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pulse-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                    <stop offset="50%" stopColor="currentColor" className="text-white/40" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" className="text-white/10" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
        <div className="absolute -bottom-3 left-0 flex items-center space-x-2">
            <div className="flex space-x-1">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[9px] uppercase tracking-wider text-white/60 font-semibold">
                Analyzing
            </span>
        </div>
    </div>
);

const EcomGradientCards = ({
                           kpiLoading,
                           grossSales,
                           avgOrder,
                           ordersCount,
                           couponSum,
                           couponOrders,
                           storeCreditSum,
                           storeCreditCount,
                           codIssueCount,
                           missingEmailCount,
                           formatRoundedAmountWithCommas,
                           DateInfo
                       }) => {
    const styles = `
    @keyframes pulseScan {
      0% { 
        stroke-dashoffset: 400;
      }
      50% {
        stroke-dashoffset: 200;
      }
      100% { 
        stroke-dashoffset: 0;
      }
    }
    
    @keyframes pulseDot {
      0% { 
        cx: 0;
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% { 
        cx: 200;
        opacity: 0;
      }
    }
    
    .animate-pulse-scan {
      animation: pulseScan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    
    .animate-pulse-dot {
      animation: pulseDot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  `;

    return (
        <>
            <style>{styles}</style>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trends */}
                <div className="bg-gradient-to-br from-black to-black to-indigo-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-16 -mt-16"/>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp size={20}/> Sales Trend
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <ArrowUpRight className="text-white" size={22}/>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/80">Gross Sales</p>
                                {kpiLoading ? (
                                    <PulseLine />
                                ) : (
                                    <p className="text-4xl font-bold text-white tabular-nums">
                                        PKR {formatRoundedAmountWithCommas(grossSales)}
                                    </p>
                                )}
                                {!kpiLoading && (
                                    <p className="text-xs text-white/70 mt-1">
                                        Avg Order: PKR {formatRoundedAmountWithCommas(avgOrder)}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/25 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-white/80">Orders</p>
                                {kpiLoading ? (
                                    <div className="h-8">
                                        <PulseLine />
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold text-white tabular-nums">
                                        {formatRoundedAmountWithCommas(ordersCount)}
                                    </p>
                                )}
                                {!kpiLoading && <p className="text-xs text-white/70 mt-1"><DateInfo/></p>}
                            </div>

                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                                <span className="font-semibold">Tip:</span> Review top orders below for VIP buyers.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo / Coupons Snapshot */}
                <div className="bg-gradient-to-br from-black via-fuchsia-900 to-pink-900 rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16"/>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BadgePercent size={20}/> Promo Snapshot
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <BadgePercent className="text-white" size={22}/>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/80">Coupon Discount</p>
                                {kpiLoading ? (
                                    <PulseLine />
                                ) : (
                                    <p className="text-4xl font-bold text-white tabular-nums">
                                        PKR {formatRoundedAmountWithCommas(couponSum)}
                                    </p>
                                )}
                                {!kpiLoading && (
                                    <p className="text-xs text-white/70 mt-1">
                                        Orders with coupon: {formatRoundedAmountWithCommas(couponOrders)}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/25 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-white/80">Store Credit Used</p>
                                {kpiLoading ? (
                                    <div className="h-8">
                                        <PulseLine />
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold text-white tabular-nums">
                                        PKR {formatRoundedAmountWithCommas(storeCreditSum)}
                                    </p>
                                )}
                                {!kpiLoading && (
                                    <p className="text-xs text-white/70 mt-1">
                                        transactions: {formatRoundedAmountWithCommas(storeCreditCount)}
                                    </p>
                                )}
                            </div>

                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm">
                                Watch for coupon stacking & high store-credit usage.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Snapshot */}
                <div className="bg-gradient-to-br from-red via-orange-600 to-warning rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-44 h-44 bg-white/10 rounded-full -ml-20 -mb-20"/>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ShieldAlert size={20}/> Risk Snapshot
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <AlertTriangle className="text-white" size={22}/>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white/80">COD Amount Issues</p>
                                {kpiLoading ? (
                                    <PulseLine />
                                ) : (
                                    <p className="text-4xl font-bold text-white tabular-nums">
                                        {formatRoundedAmountWithCommas(codIssueCount)}
                                    </p>
                                )}
                                {!kpiLoading && <p className="text-xs text-white/70 mt-1">OMS</p>}
                            </div>

                            <div className="pt-4 border-t border-white/25 grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs text-white/80">Missing Email</p>
                                    {kpiLoading ? (
                                        <div className="h-8">
                                            <PulseLine />
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-white tabular-nums">
                                            {formatRoundedAmountWithCommas(missingEmailCount)}
                                        </p>
                                    )}
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs text-white/80">Signal</p>
                                    <p className="text-2xl font-bold text-white tabular-nums">
                                        <span className="inline-flex items-center gap-1">
                                            <Ban size={16}/> Audit
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 p-2 rounded-lg text-white/90 text-sm flex items-center gap-2">
                                <RotateCcw size={16}/> Review COD mismatches + incomplete accounts first.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EcomGradientCards;