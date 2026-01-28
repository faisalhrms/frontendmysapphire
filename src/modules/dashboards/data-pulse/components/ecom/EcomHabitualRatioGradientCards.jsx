import React, { useMemo } from "react";
import { Users, BarChart3, RotateCcw, Wallet } from "lucide-react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const pickBucket = (buckets, key) =>
    (Array.isArray(buckets) ? buckets : []).find((x) => x?.bucket === key) || {
        bucket: key,
        customers_count: 0,
        orders_count: 0,
        return_orders: 0,
        total_amount: 0,
    };

const RatioCard = ({ title, subtitle, icon: Icon, loading, rows, formatAmount, className }) => {
    const customers = safeNum(rows?.customers_count);
    const orders = safeNum(rows?.orders_count);
    const returns = safeNum(rows?.return_orders);
    const amount = safeNum(rows?.total_amount);

    return (
        <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden ${className}`}>
            <div className="absolute top-0 left-0 w-44 h-44 bg-white/10 rounded-full -ml-20 -mt-20" />
            <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Icon size={20}/> {title}
                        </h3>
                        <p className="text-[11px] text-white/60 mt-1">{subtitle}</p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                    {/* Customers */}
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-[10px] text-white/75 uppercase flex items-center gap-1">
                            <Users size={12}/> Customers
                        </p>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {loading ?  <PulseScan/> : formatAmount(customers)}
                        </p>
                    </div>

                    {/* Returns */}
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <p className="text-[10px] text-white/75 uppercase flex items-center gap-1">
                            <RotateCcw size={12}/> Returns
                        </p>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {loading ?  <PulseScan/> : formatAmount(returns)}
                        </p>
                    </div>

                    {/* Amount - FULL WIDTH */}
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm col-span-2">
                        <p className="text-[10px] text-white/75 uppercase flex items-center gap-1">
                            <Wallet size={12}/> Amount
                        </p>
                        <p className="text-2xl font-bold text-white tabular-nums">
                            {loading ?  <PulseScan/> : `PKR ${formatAmount(amount)}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EcomHabitualRatioGradientCards = ({buckets = [], loading = false, formatAmount = (n) => String(n)}) => {
    const b5070 = useMemo(() => pickBucket(buckets, "50-70"), [buckets]);
    const b7090 = useMemo(() => pickBucket(buckets, "70-90"), [buckets]);
    const b90100 = useMemo(() => pickBucket(buckets, "90-100"), [buckets]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RatioCard
                title="Ratio 50–70%"
                subtitle="Mid risk customers"
                icon={BarChart3}
                loading={loading}
                rows={b5070}
                formatAmount={formatAmount}
                className="bg-gradient-to-br from-slate-950 via-indigo-900 to-indigo-700"
            />
            <RatioCard
                title="Ratio 70–90%"
                subtitle="High risk customers"
                icon={RotateCcw}
                loading={loading}
                rows={b7090}
                formatAmount={formatAmount}
                className="bg-gradient-to-br from-slate-950 via-orange-700 to-amber-600"
            />
            <RatioCard
                title="Ratio 90–100%"
                subtitle="Critical customers"
                icon={Users}
                loading={loading}
                rows={b90100}
                formatAmount={formatAmount}
                className="bg-gradient-to-br from-slate-950 via-red-700 to-rose-600"
            />
        </div>
    );
};

export default EcomHabitualRatioGradientCards;
