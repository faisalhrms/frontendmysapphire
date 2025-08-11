import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

const WeightageStatus = ({ totalWeightage }) => {
    const getStatusConfig = () => {
        if (totalWeightage === 100) {
            return {
                status: 'success',
                bgGradient: 'from-emerald-500/10 to-teal-500/10',
                borderColor: 'border-emerald-200/60',
                textColor: 'text-emerald-800',
                iconColor: 'text-emerald-600',
                iconBg: 'bg-emerald-100',
                icon: CheckCircle2,
                message: 'Perfect allocation achieved',
                weightageColor: 'text-emerald-600',
                badgeStyle: 'bg-emerald-100 text-emerald-700',
                progressColor: 'bg-emerald-500'
            };
        } else if (totalWeightage > 100) {
            return {
                status: 'error',
                bgGradient: 'from-red-500/10 to-rose-500/10',
                borderColor: 'border-red-200/60',
                textColor: 'text-red-800',
                iconColor: 'text-red-600',
                iconBg: 'bg-red-100',
                icon: AlertCircle,
                message: 'Exceeds maximum limit',
                weightageColor: 'text-red-600',
                badgeStyle: 'bg-red-100 text-red-700',
                progressColor: 'bg-red-500'
            };
        } else {
            return {
                status: 'warning',
                bgGradient: 'from-amber-500/10 to-yellow-500/10',
                borderColor: 'border-amber-200/60',
                textColor: 'text-amber-800',
                iconColor: 'text-amber-600',
                iconBg: 'bg-amber-100',
                icon: TrendingUp,
                message: 'Needs adjustment to reach 100%',
                weightageColor: 'text-amber-600',
                badgeStyle: 'bg-amber-100 text-amber-700',
                progressColor: 'bg-amber-500'
            };
        }
    };

    const config = getStatusConfig();
    const IconComponent = config.icon;
    const progressWidth = Math.min((totalWeightage / 100) * 100, 100);

    return (
        <div className={`
            bg-gradient-to-r ${config.bgGradient} 
            border ${config.borderColor} 
            rounded-2xl p-4 
            backdrop-blur-sm 
            shadow-sm hover:shadow-md 
            transition-all duration-300
        `}>
            <div className="flex items-center justify-between">
                {/* Left side - Icon and Status */}
                <div className="flex items-center space-x-4">
                    <div className={`
                        ${config.iconBg} 
                        p-2.5 rounded-xl 
                        shadow-sm
                    `}>
                        <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h4 className={`font-semibold text-sm ${config.textColor}`}>
                                Weightage Status
                            </h4>
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs font-medium
                                ${config.badgeStyle}
                            `}>
                                {config.status === 'success' ? 'Complete' :
                                    config.status === 'error' ? 'Over Limit' : 'In Progress'}
                            </span>
                        </div>
                        <p className={`text-xs ${config.iconColor}`}>
                            {config.message}
                        </p>
                    </div>
                </div>

                {/* Right side - Progress and Percentage */}
                <div className="flex items-center space-x-4">
                    {/* Progress Bar */}
                    <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${config.progressColor} transition-all duration-500 ease-out rounded-full`}
                                style={{ width: `${progressWidth}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                            {totalWeightage}/100
                        </span>
                    </div>

                    {/* Large Percentage Display */}
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${config.weightageColor} leading-none`}>
                            {totalWeightage}%
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                            Total Weight
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeightageStatus;