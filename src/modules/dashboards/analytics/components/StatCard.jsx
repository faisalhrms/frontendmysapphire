import React, { memo, useId } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const VARIANTS = {
    // Default (your existing look)
    primary: {
        cardGradient: "bg-white dark:bg-bodybg",
        hoverOverlay: "from-primary/[0.01] to-transparent",
        iconWrap: "bg-primary/5 text-primary ring-primary/5 dark:bg-primary/8 dark:ring-primary/15",
        pulseText: "text-primary",
        pulseStart: "text-primary/20",
        pulseGlow: "text-primary/40",
        loadingText: "text-primary/60",
        border: "border-gray-200 dark:border-white/5",
        borderHover: "hover:border-primary/20 dark:hover:border-primary/30",
        titleText: "text-gray-600 dark:text-gray-300",
        subText: "text-gray-500 dark:text-gray-200",
        valueText: "text-gray-900 dark:text-white",
    },

    // ✅ from-black via-black to-indigo-700
    blackIndigo: {
        cardGradient: "bg-gradient-to-br from-black to-black to-indigo-700 text-white",
        hoverOverlay: "from-white/[0.06] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "border-white/10",
        borderHover: "hover:border-white/20",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },

    // ✅ from-black to-green
    blackGreen: {
        cardGradient: "bg-gradient-to-br from-black to-green text-white",
        hoverOverlay: "from-white/[0.06] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "",
        borderHover: "",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },

    // ✅ from-red to-orange
    redOrange: {
        cardGradient: "bg-gradient-to-br from-red to-orange text-white",
        hoverOverlay: "from-white/[0.07] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "",
        borderHover: "",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },

    // ✅ from-black to-blue
    blackBlue: {
        cardGradient: "bg-gradient-to-br from-black to-blue text-white",
        hoverOverlay: "from-white/[0.06] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "",
        borderHover: "",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },

    // ✅ from-purple to-pink
    purplePink: {
        cardGradient: "bg-gradient-to-br from-purple to-pink text-white",
        hoverOverlay: "from-white/[0.07] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "",
        borderHover: "",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },

    blackRed: {
        cardGradient: "bg-gradient-to-br from-black to-red text-white",
        hoverOverlay: "from-white/[0.07] to-transparent",
        iconWrap: "bg-white/10 text-white ring-white/10",
        pulseText: "text-white",
        pulseStart: "text-white/20",
        pulseGlow: "text-white/40",
        loadingText: "text-white/70",
        border: "",
        borderHover: "",
        titleText: "text-white/90",
        subText: "text-white/75",
        valueText: "text-white",
    },
};

const PulseLine = ({ idPrefix, pulseText, pulseStart, pulseGlow }) => {
    const gradientId = `${idPrefix}-pulse-gradient`;
    const glowId = `${idPrefix}-pulse-glow`;

    return (
        <div className={`absolute inset-0 flex items-center w-full ${pulseText}`}>
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                {/* Ghost line */}
                <path
                    d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gray-300/40 dark:text-white/15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Glow */}
                <path
                    d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                    fill="none"
                    stroke={`url(#${glowId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse-scan blur-[2px]"
                    style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                />

                {/* Main */}
                <path
                    d="M0 20 L50 20 L55 12 L60 28 L65 20 L110 20 L115 14 L120 26 L125 20 L150 20 L155 16 L160 24 L165 20 L200 20"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse-scan"
                    style={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                />

                {/* Dot */}
                <circle cx="0" cy="20" r="2.5" fill="currentColor" className={pulseText} />

                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" className={pulseStart} stopOpacity="0.2" />
                        <stop offset="30%" stopColor="currentColor" className={pulseText} stopOpacity="1" />
                        <stop offset="70%" stopColor="currentColor" className={pulseText} stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" className={pulseStart} stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id={glowId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" className={pulseStart} stopOpacity="0" />
                        <stop offset="50%" stopColor="currentColor" className={pulseGlow} stopOpacity="0.4" />
                        <stop offset="100%" stopColor="currentColor" className={pulseStart} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

const StatCard = ({
                      title,
                      value,
                      change,
                      icon: Icon,
                      subtitle,
                      isLoading,
                      classes = "",
                      variant = "primary",
                  }) => {
    const v = VARIANTS[variant] || VARIANTS.primary;
    const uid = useId();

    const styles = `
    @keyframes pulseScan { 0% { stroke-dashoffset: 400; } 50% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
    .animate-pulse-scan { animation: pulseScan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  `;

    return (
        <div
            className={[
                "relative overflow-hidden rounded-xl shadow-sm border p-6 transition-all duration-300 hover:shadow-lg",
                v.cardGradient,
                v.border,
                v.borderHover,
                classes,
            ].join(" ")}
        >
            <style>{styles}</style>

            <div
                className={[
                    "absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    v.hoverOverlay,
                ].join(" ")}
            />

            {/* Header */}
            <div className="relative flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-lg ring-1 ${v.iconWrap}`}>
                        <Icon size={18} strokeWidth={2.5} />
                    </div>

                    <div>
                        <h3 className={`text-sm font-medium ${v.titleText}`}>{title}</h3>
                        {subtitle && !isLoading && <p className={`text-xs ${v.subText}`}>{subtitle}</p>}
                    </div>
                </div>

                {change !== undefined && !isLoading && (
                    <div
                        className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            change >= 0
                                ? "bg-success/10 text-success ring-1 ring-success/20"
                                : "bg-danger/10 text-danger ring-1 ring-danger/20"
                        }`}
                    >
                        {change >= 0 ? (
                            <TrendingUp size={12} className="mr-1" strokeWidth={2.5} />
                        ) : (
                            <TrendingDown size={12} className="mr-1" strokeWidth={2.5} />
                        )}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>

            {/* Value / Pulse */}
            <div className="relative mt-6 h-12 flex items-center">
                {isLoading ? (
                    <div className="w-full relative">
                        <PulseLine
                            idPrefix={uid}
                            pulseText={v.pulseText}
                            pulseStart={v.pulseStart}
                            pulseGlow={v.pulseGlow}
                        />
                        <div className="absolute -bottom-5 left-0 flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <span className={`w-1 h-1 rounded-full animate-pulse ${v.pulseText}`} />
                                <span className={`w-1 h-1 rounded-full animate-pulse ${v.pulseText}`} style={{ animationDelay: "150ms" }} />
                                <span className={`w-1 h-1 rounded-full animate-pulse ${v.pulseText}`} style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className={`text-[9px] uppercase tracking-wider font-semibold ${v.loadingText}`}>
                Analyzing
              </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-baseline space-x-1 animate-fade-in">
            <span className={`text-3xl font-bold tracking-tight tabular-nums ${v.valueText}`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(StatCard);
