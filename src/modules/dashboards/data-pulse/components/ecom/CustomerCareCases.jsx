// @modules/dashboards/data-pulse/components/ecom/CustomerCareCases.jsx
import React, { useMemo } from "react";
import PulseScan from "@modules/dashboards/data-pulse/components/ecom/PulseScan.jsx";
import { FileText, Layers3, Route, Shapes, ListChecks,Briefcase } from "lucide-react";

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const GRADIENTS = {
    cases: "bg-gradient-to-br from-black to-black",
};

const CardShell = ({ title, icon: Icon, gradient, children, rightIcon: RightIcon }) => (
    <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden ${gradient} h-full`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {Icon ? <Icon size={20} className="text-white" /> : null}
                    {title}
                </h3>

                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    {RightIcon ? <RightIcon size={18} className="text-white" /> : <FileText size={18} className="text-white" />}
                </div>
            </div>

            {children}
        </div>
    </div>
);

const MiniListCard = ({ title, Icon, items = [], loading }) => {
    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-4 border border-white/10 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                {Icon ? <Icon size={18} className="text-white" /> : null}
                {title}
            </div>

            {loading ? (
                <div className="space-y-2">
                    <PulseScan />
                    <PulseScan />
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((it) => (
                        <div key={it.key} className="flex items-center justify-between text-sm">
                            <span className="text-white/80">{it.label}</span>
                            <span className="text-white font-semibold tabular-nums">{nf0.format(toNum(it.value))}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CustomerCareCases = ({ loading = false }) => {
    // ✅ dummy data for now (later we’ll replace with API data)
    const totals = useMemo(
        () => [
            { key: "landed", label: "Landed", value: 0 },
            { key: "closed", label: "Closed", value: 0 },
            { key: "open", label: "Open", value: 0 },
        ],
        []
    );

    const origin = useMemo(
        () => [
            { key: "chatbot", label: "Chatbot", value: 0 },
            { key: "email", label: "Email", value: 0 },
            { key: "facebook", label: "Facebook", value: 0 },
            { key: "instagram", label: "Instagram", value: 0 },
            { key: "oms", label: "OMS", value: 0 },
        ],
        []
    );

    const types = useMemo(
        () => [
            { key: "information", label: "Information", value: 0 },
            { key: "service", label: "Service", value: 0 },
            { key: "complaint", label: "Complaint", value: 0 },
        ],
        []
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <p className="text-rose-500">In Process</p>
            <div className="lg:col-span-12">
                <CardShell title="Cases" icon={Briefcase} gradient={GRADIENTS.cases} rightIcon={Layers3}>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                        <MiniListCard title="Total Cases" Icon={ListChecks} items={totals} loading={loading} />
                        <MiniListCard title="Cases By Origin" Icon={Route} items={origin} loading={loading} />
                        <MiniListCard title="Cases By Type" Icon={Shapes} items={types} loading={loading} />
                    </div>
                </CardShell>
            </div>
        </div>
    );
};

export default CustomerCareCases;
