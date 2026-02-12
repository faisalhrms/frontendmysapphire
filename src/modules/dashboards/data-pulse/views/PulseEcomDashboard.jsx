import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form"; // ✅ NEW
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
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
    AlertTriangle,
    UserX,
    TrendingUp,
    BarChart3,
    LayoutGrid,
    ShieldAlert,
    Calendar,
    Users,
    RotateCcw,
    Truck,
    Undo,
    Clock,
    Headset,
    Briefcase
} from "lucide-react";

import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import { getPastDate } from "@helpers/dateTime.js";
import useFilters from "@hooks/useFilters.js";
import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";

import ReturnsLocationWise from "@modules/dashboards/data-pulse/components/ecom/ReturnsLocationWise.jsx";
import ReturnsCancelledAfterDispatchTable from "@modules/dashboards/data-pulse/components/ecom/ReturnsCancelledAfterDispatchTable.jsx";
import DormantUsers from "@modules/dashboards/data-pulse/components/ecom/DormantUsers.jsx";
import EcomOverview from "@modules/dashboards/data-pulse/components/ecom/EcomOverview.jsx";
import EcomOrdersTab from "@modules/dashboards/data-pulse/components/ecom/EcomOrdersTab.jsx";
import EcomCustomersTab from "@modules/dashboards/data-pulse/components/ecom/EcomCustomersTab.jsx";
import CustomerCareCases from "@modules/dashboards/data-pulse/components/ecom/CustomerCareCases.jsx";

// ✅ Discounts sub-tabs
import DiscountsRedemptionTab from "@modules/dashboards/data-pulse/components/ecom/DiscountsRedemptionTab.jsx";
import DiscountsIssuanceTab from "@modules/dashboards/data-pulse/components/ecom/DiscountsIssuanceTab.jsx";

// ✅ Lead-time component
import ReturnsLeadTime from "@modules/dashboards/data-pulse/components/ecom/ReturnsLeadTime.jsx";

// ✅ NEW Customer Care component
import CustomerCareRefunds from "@modules/dashboards/data-pulse/components/ecom/CustomerCareRefunds.jsx";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[320px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Activity size={32} className="mb-2 opacity-20" />
        {label}
    </div>
);

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

const SimpleTable = ({ columns, rows }) => (
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
    const topRef = useRef(null);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const tabs = useMemo(
        () => [
            { id: "overview", label: "Overview", icon: LayoutGrid },
            { id: "orders", label: "Orders", icon: TrendingUp },
            { id: "returns", label: "Fulfillment", icon: RotateCcw },
            { id: "discounts", label: "Discounts", icon: BadgePercent },
            { id: "customer_care", label: "Customer Care", icon: Headset },
            { id: "customers", label: "Customers", icon: Users },
            { id: "risk", label: "Audit & Risk", icon: ShieldAlert },
            { id: "dormant_users", label: "Users", icon: UserX },
        ],
        []
    );

    const [activeTab, setActiveTab] = useState("overview");

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "date_from", defaultValue: getPastDate(1) },
                    { name: "date_to", defaultValue: getPastDate(1) },
                    { name: "country", defaultValue: "PK" },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    // ✅ NEW: inline date-range error (since useFilters hook doesn't expose setError)
    const [dateRangeError, setDateRangeError] = useState("");

    // ✅ Watch form values so we can set min/max on inputs
    const watchedFrom = useWatch({ control, name: "date_from" });
    const watchedTo = useWatch({ control, name: "date_to" });

    const toISODate = (d) => {
        if (!d) return "";
        const dt = new Date(d);
        return Number.isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
    };

    const todayISO = useMemo(() => toISODate(new Date()), []);
    const watchedFromISO = useMemo(() => toISODate(watchedFrom), [watchedFrom]);


    const minISO = (a, b) => (a && b ? (a < b ? a : b) : (a || b || ""));


    const onSubmit = useCallback((formData) => {
        const df = formData?.date_from;
        const dt = formData?.date_to;

        if (df && dt) {
            const dFrom = new Date(df);
            const dTo = new Date(dt);
            if (!Number.isNaN(dFrom.getTime()) && !Number.isNaN(dTo.getTime()) && dFrom > dTo) {
                setDateRangeError("From date cannot be after To date.");
                return;
            }
        }

        setDateRangeError("");
        setFilters(formData);
    }, []);

    const DateInfo = () => (
        <div className="flex items-center gap-2 text-base text-black">
            <Calendar size={13} />
            <span>{formatDate(filters?.date_from)}</span>
            <span>—</span>
            <span>{formatDate(filters?.date_to)}</span>
            <span>|</span>
            <span>
                <span>Website:</span> {filters?.country || "PK"}
            </span>
        </div>
    );

    const overviewEnabled = activeTab === "overview";
    const ordersEnabled = activeTab === "orders";
    const discountsEnabled = activeTab === "discounts";
    const riskEnabled = activeTab === "risk";
    const dormantUsersEnabled = activeTab === "dormant_users";
    const returnsEnabled = activeTab === "returns";
    const customersEnabled = activeTab === "customers";

    // ✅ NEW: Customer Care
    const customerCareEnabled = activeTab === "customer_care";

    const RETURNS_TABS = [
        { key: "cancelled", label: "Dispatch", icon: Truck },
        { key: "location", label: "Returns", icon: Undo },
        { key: "lead_time", label: "Lead Time", icon: Clock },
    ];
    const [activeReturnsTab, setActiveReturnsTab] = useState("cancelled");

    const DISCOUNTS_TABS = [
        { key: "redemption", label: "Redemption", icon: LayoutGrid },
        { key: "issuance", label: "Issuance", icon: BarChart3 },
    ];
    const [activeDiscountsTab, setActiveDiscountsTab] = useState("redemption");

    // ✅ NEW: Customer Care sub-tabs
    const CUSTOMER_CARE_TABS = [
        { key: "cases", label: "Cases", icon: Briefcase },
        { key: "refunds", label: "Refunds", icon: Undo },
    ];
    const [activeCustomerCareTab, setActiveCustomerCareTab] = useState("cases");

    const LONG_CACHE = {
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60 * 6,
    };

    const { data: kpiResp, isLoading: kpiLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/kpis/",
        filters,
        { enabled: overviewEnabled || returnsEnabled, ...LONG_CACHE }
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

    const { data: returnsCancelledAfterDispatchRes } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/cancelled-after-dispatch/",
        filters,
        { enabled: returnsEnabled && activeReturnsTab === "cancelled", ...LONG_CACHE }
    );

    const { data: dispatchSummaryRes, isLoading: dispatchSummaryLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/dispatch/summary/",
        { ...filters, dispatch_key: "all" },
        { enabled: overviewEnabled, ...LONG_CACHE }
    );

    const { data: returnsInactiveUsersRes, isLoading: returnsInactiveUsersResLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/inactive-users-last7d/",
        filters,
        { enabled: overviewEnabled || dormantUsersEnabled, ...LONG_CACHE }
    );

    const pendingPunchingSnapshotFilters = useMemo(
        () => ({ country: filters?.country || "PK" }),
        [filters?.country]
    );

    const { data: pendingPunchingBucketAllRes, isLoading: pendingPunchingBucketAllLoading } =
        useFetchWithFilters(
            "/dashboard/data-pulse/ecom/returns/location_wise/bucketwise-all/",
            pendingPunchingSnapshotFilters,
            { enabled: returnsEnabled && activeReturnsTab === "location", ...LONG_CACHE }
        );

    const { data: returnsLeadTimeRes, isLoading: returnsLeadTimeLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/lead-time/",
        filters,
        { enabled: returnsEnabled && activeReturnsTab === "lead_time", ...LONG_CACHE }
    );

    // ✅ NEW: IBFT Approved endpoint (only when Customer Care > Refunds is active)
    const { data: ibftApprovedRes, isLoading: ibftApprovedLoading } = useFetchWithFilters(
        "/dashboard/data-pulse/ecom/returns/ibft-approved/",
        filters,
        { enabled: customerCareEnabled && activeCustomerCareTab === "refunds", ...LONG_CACHE }
    );

    const codIssues = codIssuesResp?.rows || [];
    const missingEmails = missingEmailResp?.rows || [];

    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
    }, [activeTab]);

    const returnsSnapshot = useMemo(() => {
        const sections = kpiResp?.data?.sections ?? kpiResp?.sections ?? [];
        const returnsSection = Array.isArray(sections) ? sections.find((s) => s?.key === "returns_section") : null;

        const items = Array.isArray(returnsSection?.items) ? returnsSection.items : [];
        const m = {};
        items.forEach((c) => {
            if (c?.key) m[c.key] = c;
        });

        let title = (returnsSection?.title || "Returns Summary").trim();
        title = title.replace(/snapshot/gi, "Summary");
        if (title.toLowerCase() === "returns") title = "Returns Summary";

        return {
            title,
            total_amount: m.return_amount?.value,
            total_orders: m.returns?.value,
            orders: m.returns?.value,
            qty: m.return_qty?.value,
            avg_qty: m.avg_return_qty?.value,
        };
    }, [kpiResp]);

    return (
        <div ref={topRef} className="space-y-6 pb-8 pt-6">
            {/* ---- Top header box ---- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Title + meta */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 dark:bg-slate-900 dark:border-gray-700">
                            <BarChart3 size={26} className="text-gray-700 dark:text-gray-200" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Ecom Data Pulse</h1>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                <DateInfo />
                            </div>
                        </div>
                    </div>

                    {/* Right: Filters */}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                            <div className="w-full sm:w-[120px]">
                                <FormSelect
                                    name="country"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                    placeholder=""
                                    isClearable={false} // ✅ remove cross
                                    options={[
                                        { value: "PK", label: "PK" },
                                        { value: "UAE", label: "UAE" },
                                        { value: "INT", label: "INT" },
                                    ]}
                                />
                            </div>

                            <div className="w-full sm:w-[180px]">
                                <FormInput
                                    type="date"
                                    name="date_from"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                    required
                                    max={todayISO || undefined}

                                />
                            </div>

                            <div className="w-full sm:w-[180px]">
                                <FormInput
                                    type="date"
                                    name="date_to"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                    required
                                    min={watchedFromISO || ""}
                                    max={todayISO}
                                />
                            </div>

                            <div className="sm:pb-[2px]">
                                <FilterButton />
                            </div>
                        </div>

                        {/* ✅ simple validation message */}
                        {dateRangeError ? (
                            <p className="mt-2 text-xs text-rose-500 font-semibold">{dateRangeError}</p>
                        ) : null}
                    </form>
                </div>

                {/* Tabs */}
                <div className="mt-4">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>
            </div>

            <>
                {activeTab === "overview" && (
                    <EcomOverview
                        kpiResp={kpiResp}
                        kpiLoading={kpiLoading}
                        formatRoundedAmountWithCommas={formatRoundedAmountWithCommas}
                        DateInfo={DateInfo}
                        setActiveTab={setActiveTab}
                        setActiveReturnsTab={setActiveReturnsTab}
                        setActiveCustomersTab={() => setActiveTab("customers")}
                        dispatchSummaryRes={dispatchSummaryRes}
                        dispatchSummaryLoading={dispatchSummaryLoading}
                        inactiveUsersRes={returnsInactiveUsersRes}
                        filters={filters}
                        cache={LONG_CACHE}
                        inactiveUsersLoading={returnsInactiveUsersResLoading}
                    />
                )}

                {activeTab === "returns" && (
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

                        <div className="p-6 space-y-6">
                            {activeReturnsTab === "location" && (
                                <ReturnsLocationWise
                                    rows={returnsLocationWiseRes?.rows}
                                    courierRows={returnsLocationWiseRes?.courier_rows}
                                    categoryRows={returnsLocationWiseRes?.category_rows}
                                    pendingPunchingBucketRows={pendingPunchingBucketAllRes?.rows}
                                    courierTotalReturns={returnsLocationWiseRes?.courier_total_returns}
                                    courierSummary={returnsLocationWiseRes?.courier_summary}
                                    meta={returnsLocationWiseRes?.meta}
                                    loading={returnsLocationWiseLoading || kpiLoading}
                                    pendingPunchingLoading={pendingPunchingBucketAllLoading}
                                    returnsSnapshot={returnsSnapshot}
                                />
                            )}

                            {activeReturnsTab === "cancelled" && (
                                <ReturnsCancelledAfterDispatchTable
                                    filters={filters}
                                    enabled={returnsEnabled && activeReturnsTab === "cancelled"}
                                    cache={LONG_CACHE}
                                />
                            )}

                            {activeReturnsTab === "lead_time" && (
                                <ReturnsLeadTime
                                    enabled={returnsEnabled && activeReturnsTab === "lead_time"}
                                    filters={filters}
                                    cache={LONG_CACHE}
                                    data={returnsLeadTimeRes}
                                    loading={returnsLeadTimeLoading}
                                />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "customers" && (
                    <EcomCustomersTab
                        enabled={customersEnabled}
                        filters={filters}
                        cache={LONG_CACHE}
                        formatAmount={formatRoundedAmountWithCommas}
                    />
                )}

                {activeTab === "orders" && (
                    <EcomOrdersTab
                        enabled={ordersEnabled}
                        filters={filters}
                        cache={LONG_CACHE}
                        colors={COLORS}
                        formatAmount={formatRoundedAmountWithCommas}
                    />
                )}

                {/* ✅ DISCOUNTS TAB with 2 sub-tabs */}
                {activeTab === "discounts" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                {DISCOUNTS_TABS.map((m) => {
                                    const Icon = m.icon;
                                    const active = activeDiscountsTab === m.key;

                                    return (
                                        <button
                                            key={m.key}
                                            onClick={() => setActiveDiscountsTab(m.key)}
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
                            {activeDiscountsTab === "redemption" && (
                                <DiscountsRedemptionTab
                                    enabled={discountsEnabled && activeDiscountsTab === "redemption"}
                                    filters={filters}
                                    cache={LONG_CACHE}
                                    colors={COLORS}
                                    formatAmount={formatRoundedAmountWithCommas}
                                    setActiveTab={setActiveTab}
                                />
                            )}

                            {activeDiscountsTab === "issuance" && (
                                <DiscountsIssuanceTab
                                    enabled={discountsEnabled && activeDiscountsTab === "issuance"}
                                    filters={filters}
                                    cache={LONG_CACHE}
                                    formatAmount={formatRoundedAmountWithCommas}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ NEW: CUSTOMER CARE TAB */}
                {activeTab === "customer_care" && (
                    <div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                        <div
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                {CUSTOMER_CARE_TABS.map((m) => {
                                    const Icon = m.icon;
                                    const active = activeCustomerCareTab === m.key;

                                    return (
                                        <button
                                            key={m.key}
                                            onClick={() => setActiveCustomerCareTab(m.key)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                active
                                                    ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                    : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                            }`}
                                        >
                                            <Icon size={18}/>
                                            <span className="font-medium whitespace-nowrap">{m.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {activeCustomerCareTab === "cases" && (
                                <CustomerCareCases
                                    activeTab={activeTab}
                                    filters={filters}
                                />
                            )}

                            {activeCustomerCareTab === "refunds" && (
                                <CustomerCareRefunds
                                    data={ibftApprovedRes}
                                    loading={ibftApprovedLoading}
                                />
                            )}


                        </div>
                    </div>
                )}

                {activeTab === "risk" && (
                    <div className="space-y-6">
                        <p className="text-rose-500">Inprocess</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SectionCard title="COD Amount Issues" icon={AlertTriangle}>
                                {codIssuesLoading ? (
                                    <LoadingSpinner />
                                ) : !isNonEmptyArray(codIssues) ? (
                                    <EmptyState />
                                ) : (
                                    <SimpleTable
                                        columns={[
                                            { key: "Formatted_FO_Number__c", label: "FO #", mono: true, colorClass: "text-blue-600" },
                                            { key: "Status", label: "Status" },
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
                        rows={returnsInactiveUsersRes?.rows}
                        summary={returnsInactiveUsersRes?.summary}
                        loading={returnsInactiveUsersResLoading}
                    />
                )}
            </>
        </div>
    );
};

export default PulseEcomDashboard;
