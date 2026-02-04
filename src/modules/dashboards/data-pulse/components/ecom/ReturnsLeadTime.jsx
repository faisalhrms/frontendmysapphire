// @modules/dashboards/data-pulse/components/ecom/ReturnsLeadTime.jsx
import React, { memo, useMemo } from "react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { Clock, MessageCircle, Truck, Package } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US");
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const CardShell = ({ title, icon: Icon, gradient, children }) => (
    <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden bg-gradient-to-br ${gradient} h-full`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {Icon ? <Icon size={20} className="text-white" /> : null}
                    {title}
                </h3>
            </div>
            {children}
        </div>
    </div>
);

function MiniKpiCard({ title, Icon, value, subtitle, loading }) {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                {Icon ? <Icon size={18} className="text-white/90" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="mt-3">
                    <PulseScan />
                </div>
            ) : (
                <>
                    <p className="mt-3 text-2xl font-bold text-white tabular-nums">{value ?? "-"}</p>
                    <p className="text-xs text-white/70 mt-1 tabular-nums min-h-[16px]">{subtitle ?? "\u00A0"}</p>
                </>
            )}
        </div>
    );
}

const GRADIENTS = {
    leadTime: "from-slate-950 to-slate-700",
};

const ReturnsLeadTime = ({ enabled = true, loading = false }) => {
    // ✅ dummy values for now (replace later with API)
    const dummy = useMemo(
        () => ({
            whatsapp_confirmation: { value: 0, subtitle: "Avg minutes" },
            order_placed_till_dispatch: { value: 0, subtitle: "Avg minutes" },
            order_available_wh_till_dispatch: { value: 0, subtitle: "Avg minutes" },
        }),
        []
    );

    const isLoading = !enabled || loading;

    return (
        <div className="space-y-6">
            <p className="text-rose-500">In Process</p>
            <CardShell title="Lead Time" icon={Clock} gradient={GRADIENTS.leadTime}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    <MiniKpiCard
                        title="WhatsApp Confirmation"
                        Icon={MessageCircle}
                        value={nf0.format(toNum(dummy.whatsapp_confirmation.value))}
                        subtitle={dummy.whatsapp_confirmation.subtitle}
                        loading={isLoading}
                    />

                    <MiniKpiCard
                        title="Order placed till dispatch"
                        Icon={Truck}
                        value={nf0.format(toNum(dummy.order_placed_till_dispatch.value))}
                        subtitle={dummy.order_placed_till_dispatch.subtitle}
                        loading={isLoading}
                    />

                    <MiniKpiCard
                        title="Order available to WH till dispatch"
                        Icon={Package}
                        value={nf0.format(toNum(dummy.order_available_wh_till_dispatch.value))}
                        subtitle={dummy.order_available_wh_till_dispatch.subtitle}
                        loading={isLoading}
                    />
                </div>
            </CardShell>
        </div>
    );
};

export default memo(ReturnsLeadTime);
