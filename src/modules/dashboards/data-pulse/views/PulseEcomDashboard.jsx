import React, {useCallback, useMemo, useState} from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import {
    Activity,
    BadgePercent,
    Wallet,
    AlertTriangle,
    UserX,
    TrendingUp,
    Receipt,
    BarChart3,
    LayoutGrid,
    ShieldAlert,
    Calendar,
    MapPin,
    ArrowUpRight,
    Ban,
    RotateCcw,
    History,
    Users,
} from "lucide-react";
import {formatRoundedAmountWithCommas} from "@helpers/formatters.js";
import {getPastDate} from "@helpers/dateTime.js";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import ReturnsAreaChart from "@modules/dashboards/data-pulse/components/ecom/ReturnsAreaChart.jsx";
import EcomReturnsGradiantCards from "@modules/dashboards/data-pulse/components/ecom/EcomReturnsGradiantCards.jsx";
import TopHabitualReturns from "@modules/dashboards/data-pulse/components/ecom/TopHabitualReturns.jsx";
import ReturnsLocationWise from "@modules/dashboards/data-pulse/components/ecom/ReturnsLocationWise.jsx";
import ReturnsCancelledAfterDispatchTable
    from "@modules/dashboards/data-pulse/components/ecom/ReturnsCancelledAfterDispatchTable.jsx";
import DormantUsers from "@modules/dashboards/data-pulse/components/ecom/DormantUsers.jsx";
import OrdersOnBehalf from "@modules/dashboards/data-pulse/components/ecom/OrdersOnBehalf.jsx";
import EcomOverview from "@modules/dashboards/data-pulse/components/ecom/EcomOverview.jsx";
import EcomHabitualCustomerCards from "@modules/dashboards/data-pulse/components/ecom/EcomHabitualCustomerCards.jsx";
import EcomHabitualRatioGradientCards
    from "@modules/dashboards/data-pulse/components/ecom/EcomHabitualRatioGradientCards.jsx";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Activity size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

const formatPKR = (v, formatRoundedAmountWithCommas) =>
    `PKR ${formatRoundedAmountWithCommas(v)}`;

const CouponsAreaByCode = ({ rows = [], formatRoundedAmountWithCommas }) => {
    const data = useMemo(() => {
        const safe = Array.isArray(rows) ? rows : [];
        return [...safe]
            .map((r) => ({
                coupon_code: r.coupon_code || "-",
                coupon_amount: Number(r.coupon_amount) || 0,
                total_payment_amount: Number(r.total_payment_amount) || 0,
                order_total: Number(r.order_total) || 0,
                OrderNumber: r.OrderNumber || "-",
            }))
            .sort((a, b) => (b.coupon_amount || 0) - (a.coupon_amount || 0))
            .slice(0, 10);
    }, [rows]);

    if (!data.length) return null;

    return (
        <div className="h-[360px]">
            <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gCoupon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gOrder" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.20} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    {/* X axis = coupon code */}
                    <XAxis
                        dataKey="coupon_code"
                        stroke="#6B7280"
                        fontSize={9}
                        interval={0}
                        tickMargin={4}
                        angle={-30}
                        textAnchor="end"
                        height={110}
                        tickFormatter={(v) => (String(v).length > 10 ? `${String(v).slice(0, 10)}…` : v)}
                    />

                    <YAxis stroke="#6B7280" fontSize={12} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                        }}
                        formatter={(value, name) =>
                            [formatPKR(value, formatRoundedAmountWithCommas), name]
                        }
                        labelFormatter={(label) => `Coupon: ${label}`}
                    />

                    <Legend />

                    {/* 3 areas */}
                    <Area
                        type="monotone"
                        dataKey="coupon_amount"
                        stroke="#6366F1"
                        fill="url(#gCoupon)"
                        fillOpacity={1}
                        name="Coupon Amount"
                    />
                    <Area
                        type="monotone"
                        dataKey="total_payment_amount"
                        stroke="#10B981"
                        fill="url(#gPaid)"
                        fillOpacity={1}
                        name="Paid Amount"
                    />
                    <Area
                        type="monotone"
                        dataKey="order_total"
                        stroke="#F59E0B"
                        fill="url(#gOrder)"
                        fillOpacity={1}
                        name="Order Amount"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const StoreCreditAreaByOrder = ({ rows = [], formatRoundedAmountWithCommas }) => {
    const data = useMemo(() => {
        const safe = Array.isArray(rows) ? rows : [];
        return [...safe]
            .map((r) => ({
                OrderNumber: r.OrderNumber || "-",
                OrderedDate: r.OrderedDate || "",
                store_credit_amount: Number(r.store_credit_amount) || 0,
                total_payment_amount: Number(r.total_payment_amount) || 0,
                Status: r.Status || "",
            }))
            .sort((a, b) => (b.store_credit_amount || 0) - (a.store_credit_amount || 0))
            .slice(0, 10);
    }, [rows]);

    if (!data.length) return null;

    return (
        <div className="h-[420px]">
            <ResponsiveContainer width="100%" height={420}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <defs>
                        <linearGradient id="gStoreCredit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gPaid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.20} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                    {/* X axis = Order # */}
                    <XAxis
                        dataKey="OrderNumber"
                        stroke="#6B7280"
                        fontSize={11}
                        interval={0}
                        tickMargin={12}
                        height={70}
                        tickFormatter={(v) => (String(v).length > 12 ? `${String(v).slice(0, 12)}…` : v)}
                    />

                    <YAxis stroke="#6B7280" fontSize={12} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                        }}
                        labelFormatter={(label) => `Order: ${label}`}
                        formatter={(value, name) => [formatPKR(value, formatRoundedAmountWithCommas), name]}
                    />

                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="store_credit_amount"
                        stroke="#0EA5E9"
                        fill="url(#gStoreCredit)"
                        fillOpacity={1}
                        name="Store Credit"
                    />

                    <Area
                        type="monotone"
                        dataKey="total_payment_amount"
                        stroke="#10B981"
                        fill="url(#gPaid)"
                        fillOpacity={1}
                        name="Order Amount"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const Tabs = ({ tabs, activeTab, onChange }) => (
    <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                        activeTab === tab.id
                            ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                    }`}
                >
                    <Icon size={18} />
                    <span className="font-medium whitespace-nowrap">{tab.label}</span>
                </button>
            );
        })}
    </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
            {Icon ? <Icon size={20} /> : null}
            {title}
        </h3>
        {children}
    </div>
);
const SimpleTable = ({columns, rows}) => (
    <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max">
            <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
            <tr>
                {columns.map((c) => (
                    <th
                        key={c.key}
                        className={`px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300 ${
                            c.align === "right" ? "text-right" : "text-left"
                        }`}
                    >
                        {c.label}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {columns.map((c) => (
                        <td
                            key={c.key}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                                c.mono ? "font-mono" : ""
                            } ${c.align === "right" ? "text-right tabular-nums" : "text-left"} ${
                                c.strong ? "font-semibold" : ""
                            } ${c.colorClass || "text-gray-700 dark:text-gray-300"}`}
                        >
                            {typeof c.render === "function" ? c.render(r) : r?.[c.key] ?? "-"}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

// -------------------- MAIN --------------------
const PulseEcomDashboard = () => {
    const COLORS = DEFAULT_CHART_COLORS;

    const tabs = useMemo(
        () => [
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "orders", label: "Orders", icon: TrendingUp },
            { id: "returns", label: "Returns", icon: RotateCcw },
            { id: "promos", label: "Discounts", icon: BadgePercent },
            { id: "customers", label: "Customers", icon: Users },
            { id: "risk", label: "Audit & Risk", icon: ShieldAlert },
            { id: "dormant_users", label: "users", icon: UserX },
        ],
        []
    );

    const [activeTab, setActiveTab] = useState("overview");
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date_from',defaultValue: getPastDate(1)},
                    { name: 'date_to',defaultValue: getPastDate(1)},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    const DateInfo = ({  }) => (
        <div className="flex items-center gap-2">
            <Calendar size={13}/>
            <span>
            <span className="opacity-70">From:</span> {filters?.date_from || "-"}</span>
            <span className="opacity-40">—</span>
            <span>
        <span className="opacity-70">To:</span> {filters?.date_to || "-"}</span>
        </div>
    );


    const overviewEnabled = activeTab === "overview";
    const ordersEnabled = activeTab === "orders";
    const promosEnabled = activeTab === "promos";
    const riskEnabled = activeTab === "risk";
    const dormantUsersEnabled = activeTab === "dormant_users";
    const returnsEnabled = activeTab === "returns";
    const customersEnabled = activeTab === "customers";


    const CUSTOMERS_TABS = [
        { key: "habitual", label: "Habitual Customers", icon: History },
    ];

    const [activeCustomersTab, setActiveCustomersTab] = useState("habitual");

    const RETURNS_TABS = [
        { key: "location", label: "Location Wise Return", icon: MapPin },
        { key: "cancelled", label: "Cancelled After Dispatch", icon: Ban },
    ];

    const [activeReturnsTab, setActiveReturnsTab] = useState("location");

    const LONG_CACHE = {
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60 * 6,
    };

    const { data: kpiResp, isLoading: kpiLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/kpis/",
        filters,
        { enabled: overviewEnabled, ...LONG_CACHE }
    );

    const { data: topOrdersResp, isLoading: topOrdersLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/order-amounts/",
        filters,
        { enabled: overviewEnabled || ordersEnabled, ...LONG_CACHE }
    );

    const { data: topCouponsResp, isLoading: topCouponsLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/coupons/",
        filters,
        { enabled: overviewEnabled || promosEnabled, ...LONG_CACHE }
    );

    const { data: topStoreCreditResp, isLoading: topStoreCreditLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/store-credit/",
        filters,
        { enabled: overviewEnabled || ordersEnabled, ...LONG_CACHE }
    );

    const { data: codIssuesResp, isLoading: codIssuesLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/cod-amount-issues/",
        filters,
        { enabled: overviewEnabled || riskEnabled, ...LONG_CACHE }
    );

    const { data: missingEmailResp, isLoading: missingEmailLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/top/accounts-missing-email/",
        filters,
        { enabled: riskEnabled, ...LONG_CACHE }
    );

    const { data: returnsLocationWiseRes, isLoading: returnsLocationWiseLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/location_wise/",
        filters,
        { enabled: returnsEnabled && activeReturnsTab === "location", ...LONG_CACHE }
    );

    const { data: returnsCancelledAfterDispatchRes, isLoading: returnsCancelledAfterDispatchLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/cancelled-after-dispatch/",
        filters,
        { enabled: returnsEnabled && activeReturnsTab === "cancelled", ...LONG_CACHE }
    );

    const { data: returnsInactiveUsersRes, isLoading: returnsInactiveUsersResLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/inactive-users-last7d/",
        filters,
        { enabled: dormantUsersEnabled, ...LONG_CACHE }
    );

    const { data: returnsOrdersOnBehalfRes, isLoading: returnsOrdersOnBehalfLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/orders/on-behalf/",
        filters,
        { enabled: ordersEnabled, ...LONG_CACHE }
    );

    const { data: customerHabitualRes, isLoading: customerHabitualLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customers/habitual/summary/",
        filters,
        { enabled: customersEnabled && activeCustomersTab === "habitual", ...LONG_CACHE }
    );

    const { data: returnsTopHabitual, isLoading: returnsTopHabitualLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/customers/habitual/top/",
        filters,
        { enabled: customersEnabled && activeCustomersTab === "habitual", ...LONG_CACHE }
    );


    const topOrders = topOrdersResp?.rows || [];
    const topCoupons = topCouponsResp?.rows || [];
    const topStoreCredit = topStoreCreditResp?.rows || [];
    const codIssues = codIssuesResp?.rows || [];
    const missingEmails = missingEmailResp?.rows || [];
    const topHabitual = returnsTopHabitual?.rows || [];
    const returnsLocationWise = returnsLocationWiseRes?.rows || [];
    const returnsCancelledAfterDispatch = returnsCancelledAfterDispatchRes?.rows || [];
    const returnsCancelledAfterDispatchSummary = returnsCancelledAfterDispatchRes?.summary || {};
    const returnsInactiveUsers = returnsInactiveUsersRes?.rows || [];
    const returnsInactiveUsersSummary = returnsInactiveUsersRes?.summary || {};
    const returnsOrdersOnBehalf = returnsOrdersOnBehalfRes?.rows || [];


    const chartTopOrders = useMemo(
        () =>
            topOrders.map((r) => ({
                name: r.OrderNumber || "-",
                value: Number(r.GrandTotalAmount) || 0,
            })),
        [topOrders]
    );


    return (
        <div className="space-y-6 pb-8 pt-6">

            {/* ---- Top header box (like you wanted) ---- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Title + meta */}
                    <div className="flex items-start gap-3">
                        <div
                            className="p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-slate-900 dark:border-gray-700">
                            <BarChart3 size={26} className="text-gray-700 dark:text-gray-200"/>
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
                                Ecom Data Pulse
                            </h1>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Top 10 signals for the selected date range.
                            </p>

                            {/* Range from filters (no meta) */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                <DateInfo />
                                <div className="flex items-center gap-2">
                                    <span className="opacity-40">|</span>
                                    <MapPin size={13}/>
                                    <span>Asia/Karachi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Right: Filters */}
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                                <div className="w-full sm:w-[180px]">
                                    <FormInput
                                        type="date"
                                        name="date_from"
                                        control={control}
                                        errors={errors}
                                        label={false}
                                    />
                                </div>

                                <div className="w-full sm:w-[180px]">
                                    <FormInput
                                        type="date"
                                        name="date_to"
                                        control={control}
                                        errors={errors}
                                        label={false}
                                    />
                            </div>

                            <div className="sm:pb-[2px]">
                                <FilterButton/>
                            </div>
                        </div>
                    </form>
                </div>
                {/* Tabs */}
                <div className="mt-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}/>
                </div>
            </div>
            <>
                {activeTab === "overview" && (
                    <>
                        {activeTab === "overview" && (
                            <EcomOverview
                                kpiResp={kpiResp}
                                kpiLoading={kpiLoading}
                                formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                DateInfo={DateInfo}
                            />
                        )}
                    </>
                )}

                {activeTab === "returns" && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    {RETURNS_TABS.map((m) => {
                                        const Icon = m.icon;
                                        const active = activeReturnsTab === m.key;
                                        return (
                                            <button
                                                key={m.key}
                                                onClick={() => setActiveReturnsTab(m.key)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                    active
                                                        ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="font-medium whitespace-nowrap">{m.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="p-6 space-y-6">
                                {activeReturnsTab === "location" && (
                                        <ReturnsLocationWise
                                            colors={COLORS}
                                            rows={returnsLocationWise}
                                            loading={returnsLocationWiseLoading}
                                        />
                                )}

                                {activeReturnsTab === "cancelled" && (
                                    <ReturnsCancelledAfterDispatchTable
                                        rows={returnsCancelledAfterDispatch}
                                        loading={returnsCancelledAfterDispatchLoading}
                                        summary={returnsCancelledAfterDispatchSummary}
                                    />
                                )}

                            </div>
                        </div>
                    </>
                )}

                {activeTab === "customers" && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                                <div className="flex flex-wrap gap-2">
                                    {CUSTOMERS_TABS.map((m) => {
                                        const Icon = m.icon;
                                        const active = activeCustomersTab === m.key;
                                        return (
                                            <button
                                                key={m.key}
                                                onClick={() => setActiveCustomersTab(m.key)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                    active
                                                        ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                                }`}
                                            >
                                                <Icon size={18} />
                                                <span className="font-medium whitespace-nowrap">{m.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {activeCustomersTab === "habitual" && (
                                    <div className="space-y-6">
                                        <EcomHabitualCustomerCards
                                            cards={customerHabitualRes?.cards}
                                            loading={customerHabitualLoading}
                                            formatAmount={formatRoundedAmountWithCommas}
                                        />

                                        <EcomHabitualRatioGradientCards
                                            buckets={customerHabitualRes?.ratio_buckets}
                                            loading={customerHabitualLoading}
                                            formatAmount={formatRoundedAmountWithCommas}
                                        />

                                        <TopHabitualReturns
                                            rows={topHabitual}
                                            meta={returnsTopHabitual?.meta}
                                            loading={returnsTopHabitualLoading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}


                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <SectionCard title="Top Order Amounts" icon={TrendingUp}>
                            {topOrdersLoading ? (
                                <LoadingSpinner/>
                            ) : !isNonEmptyArray(topOrders) ? (
                                <EmptyState/>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="h-[420px]">
                                                <ReChart
                                                    data={chartTopOrders}
                                                    variant="bar"
                                                    dimensions={{height: 420, bottom: 0}}
                                                    colors={COLORS}
                                                />
                                            </div>
                                            <SimpleTable
                                                columns={[
                                                    {
                                                        key: "OrderNumber",
                                                        label: "Order #",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "OrderedDate", label: "Order Date"},
                                                    {key: "Status", label: "Status"},
                                                    {
                                                        key: "GrandTotalAmount",
                                                        label: "Grand Total",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.GrandTotalAmount)}`,
                                                    },
                                                    {key: "Description", label: "Customer Name"},
                                                ]}
                                                rows={topOrders}
                                            />
                                        </div>
                                    )}
                                </SectionCard>

                                <SectionCard title="Top Store Credit" icon={Wallet}>
                                    {topStoreCreditLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(topStoreCredit) ? (
                                        <EmptyState/>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="h-[420px]">
                                                <StoreCreditAreaByOrder
                                                    rows={topStoreCredit}
                                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                                />
                                            </div>
                                            <SimpleTable
                                                columns={[
                                                    {
                                                        key: "OrderNumber",
                                                        label: "Order #",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "OrderedDate", label: "Ordered Date"},
                                                    {key: "Status", label: "Status"},
                                                    {
                                                        key: "store_credit_amount",
                                                        label: "Store Credit",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.store_credit_amount)}`,
                                                    },
                                                    {
                                                        key: "total_payment_amount",
                                                        label: "Order Amount",
                                                        align: "right",
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.total_payment_amount)}`,
                                                    },
                                                ]}
                                                rows={topStoreCredit}
                                            />
                                        </div>
                                    )}
                                </SectionCard>

                        <OrdersOnBehalf
                            rows={returnsOrdersOnBehalf}
                            loading={returnsOrdersOnBehalfLoading}
                            colors={COLORS}
                        />
                            </div>
                 )}

                {activeTab === "promos" && (
                  <div className="space-y-6">
                                <SectionCard title="Top Coupons" icon={BadgePercent}>
                                    {topCouponsLoading ? (
                                        <LoadingSpinner/>
                                    ) : !isNonEmptyArray(topCoupons) ? (
                                        <EmptyState/>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="h-[420px]">
                                                <CouponsAreaByCode
                                                    rows={topCoupons}
                                                    formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                                                />
                                            </div>
                                            <SimpleTable
                                                columns={[
                                                    {
                                                        key: "OrderNumber",
                                                        label: "Order #",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "OrderedDate", label: "Ordered Date"},
                                                    {key: "coupon_code", label: "Coupon Code", strong: true},
                                                    {key: "coupon_type", label: "Type"},
                                                    {
                                                        key: "coupon_amount",
                                                        label: "Coupon Amount",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.coupon_amount)}`,
                                                    },
                                                    {
                                                        key: "total_payment_amount",
                                                        label: "Total Paid",
                                                        align: "right",
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.total_payment_amount)}`,
                                                    },
                                                    {
                                                        key: "order_total",
                                                        label: "Order Total",
                                                        align: "right",
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.order_total)}`,
                                                    },
                                                ]}
                                                rows={topCoupons}
                                            />
                                        </div>
                                    )}
                                </SectionCard>
                            </div>
                )}

                {activeTab === "risk" && (
                  <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <SectionCard title="COD Amount Issues" icon={AlertTriangle}>
                                        {codIssuesLoading ? (
                                            <LoadingSpinner/>
                                        ) : !isNonEmptyArray(codIssues) ? (
                                            <EmptyState/>
                                        ) : (
                                            <SimpleTable
                                                columns={[
                                                    {
                                                        key: "Formatted_FO_Number__c",
                                                        label: "FO #",
                                                        mono: true,
                                                        colorClass: "text-blue-600"
                                                    },
                                                    {key: "Status", label: "Status"},
                                                    {
                                                        key: "cod_amount",
                                                        label: "COD Amount",
                                                        align: "right",
                                                        strong: true,
                                                        render: (r) => `PKR ${formatRoundedAmountWithCommas(r.cod_amount)}`,
                                                },
                                                {
                                                    key: "calculated_amount",
                                                    label: "Order Amount",
                                                    align: "right",
                                                    render: (r) => `PKR ${formatRoundedAmountWithCommas(r.calculated_amount)}`,
                                                },
                                                { key: "CreatedDate", label: "Created" },
                                            ]}
                                            rows={codIssues}
                                        />
                                    )}
                                </SectionCard>

                                <SectionCard title="Accounts Missing Email" icon={UserX}>
                                    {missingEmailLoading ? (
                                        <LoadingSpinner />
                                    ) : !isNonEmptyArray(missingEmails) ? (
                                        <EmptyState />
                                    ) : (
                                        <SimpleTable
                                            columns={[
                                                { key: "Id", label: "ID", mono: true, colorClass: "text-blue-600" },
                                                { key: "AccountNumber", label: "Account #" },
                                                { key: "FirstName", label: "First" },
                                                { key: "LastName", label: "Last" },
                                                { key: "Last_Update_date", label: "Last Update" },
                                            ]}
                                            rows={missingEmails}
                                        />
                                    )}
                                </SectionCard>
                            </div>
                        </div>
                )}

                {activeTab === "dormant_users" && (
                    <DormantUsers
                        rows={returnsInactiveUsers}
                        summary={returnsInactiveUsersSummary}
                        loading={returnsInactiveUsersResLoading}
                    />
                )}
                </>
        </div>
    );
};

export default PulseEcomDashboard;
