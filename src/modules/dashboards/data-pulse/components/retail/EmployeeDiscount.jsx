import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import { IdCard, MailX, Copy, Users, Search, Layers, ShoppingBag } from "lucide-react";

import EmployeeDiscountCardsTable
    from "@modules/dashboards/data-pulse/components/retail/EmployeeDiscountCardsTable.jsx";

import EmployeeDiscountShoppingMTDTable
    from "@modules/dashboards/data-pulse/components/retail/EmployeeDiscountShoppingMTDTable.jsx";

const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

const EmptyState = ({ label = "No Data Available" }) => (
    <div className="h-[260px] flex flex-col items-center justify-center text-slate-400 text-sm italic">
        <Users size={28} className="mb-2 opacity-20" />
        {label}
    </div>
);

const fmtInt = (v) => (Number(v) || 0).toLocaleString("en-US");

const SectionCard = ({ children }) => (
    <div className="bg-white p-6 dark:text-gray-200 dark:bg-bodybg">{children}</div>
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
            {(rows || []).map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {columns.map((c) => (
                        <td
                            key={c.key}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${c.mono ? "font-mono" : ""} ${
                                c.align === "right" ? "text-right tabular-nums" : "text-left"
                            } ${c.strong ? "font-semibold" : ""} ${c.colorClass || "text-gray-700 dark:text-gray-300"}`}
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

const EMP_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/employee/overview/",
    byClassification: "/dashboard/data-pulse/retail/employee/by-classification/",
    duplicates: "/dashboard/data-pulse/retail/employee/duplicate-cards/",
};

const EmployeeDiscount = ({ filters, enabled }) => {
    const tabs = useMemo(
        () => [
            { id: "classifications", label: "By Classifications", icon: Layers },
            { id: "duplicate_cards", label: "Duplicate Cards", icon: Copy },
            { id: "active_cards", label: "Active Discount Cards", icon: IdCard },
            { id: "discount_shopping_mtd", label: "Discount Shopping (MTD)", icon: ShoppingBag }, // NEW
        ],
        []
    );

    const [activeTab, setActiveTab] = useState("classifications");

    const { data: overviewResp, isLoading: overviewLoading } = useFetchWithFilters(
        EMP_ENDPOINTS.overview,
        filters,
        { enabled: !!enabled }
    );

    const { data: clsResp, isLoading: clsLoading } = useFetchWithFilters(
        EMP_ENDPOINTS.byClassification,
        filters,
        { enabled: !!enabled }
    );

    const { data: dupResp, isLoading: dupLoading } = useFetchWithFilters(
        EMP_ENDPOINTS.duplicates,
        filters,
        { enabled: !!enabled }
    );

    const cards = overviewResp || {};
    const byClassification = clsResp || [];
    const duplicates = dupResp || [];

    const [q, setQ] = useState("");

    const filteredDuplicates = useMemo(() => {
        const safe = Array.isArray(duplicates) ? duplicates : [];
        const needle = (q || "").trim().toLowerCase();
        if (!needle) return safe;

        return safe.filter((r) => {
            const hay = [r.person_key, r.email, r.knownas, r.name, r.classification, r.accountnums]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return hay.includes(needle);
        });
    }, [duplicates, q]);

    const clsColumns = useMemo(
        () => [
            { key: "classification", label: "Classification", strong: true },
            {
                key: "total_active_employee_cards",
                label: "Active Cards",
                align: "right",
                strong: true,
                render: (r) => fmtInt(r.total_active_employee_cards),
            },
            {
                key: "employees_without_email",
                label: "No Email",
                align: "right",
                render: (r) => fmtInt(r.employees_without_email),
            },
            {
                key: "employees_with_duplicate_cards",
                label: "Employees w/ Duplicate Cards",
                align: "right",
                render: (r) => fmtInt(r.employees_with_duplicate_cards),
            },
        ],
        []
    );

    const dupColumns = useMemo(
        () => [
            { key: "classification", label: "Class", mono: true, colorClass: "text-blue-600" },
            { key: "name", label: "Name", strong: true },
            { key: "knownas", label: "Known As", mono: true },
            { key: "email", label: "Email", render: (r) => r.email || "-" },
            {
                key: "cards_count",
                label: "Cards",
                align: "right",
                strong: true,
                render: (r) => fmtInt(r.cards_count),
            },
            {
                key: "accountnums",
                label: "AccountNums",
                render: (r) => <span className="whitespace-normal break-words">{r.accountnums || "-"}</span>,
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={IdCard}
                    title="Active Employee Cards"
                    value={overviewLoading ? "..." : fmtInt(cards.total_active_employee_cards)}
                    isLoading={overviewLoading}
                />
                <StatCard
                    icon={MailX}
                    title="Employees Without Email"
                    value={overviewLoading ? "..." : fmtInt(cards.employees_without_email)}
                    isLoading={overviewLoading}
                />
                <StatCard
                    icon={Copy}
                    title="Employees With Duplicate Cards"
                    value={overviewLoading ? "..." : fmtInt(cards.employees_with_duplicate_cards)}
                    isLoading={overviewLoading}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((m) => {
                            const Icon = m.icon;
                            const active = activeTab === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveTab(m.id)}
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

                {activeTab === "classifications" && (
                    <SectionCard>
                        {clsLoading ? (
                            <LoadingSpinner />
                        ) : !isNonEmptyArray(byClassification) ? (
                            <EmptyState label="No classification data found" />
                        ) : (
                            <SimpleTable columns={clsColumns} rows={byClassification} />
                        )}
                    </SectionCard>
                )}

                {activeTab === "duplicate_cards" && (
                    <SectionCard>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="relative w-full max-w-md">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search name / knownas / email / accountnum..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none
                           focus:ring-2 focus:ring-primary/30 dark:bg-bodybg dark:border-gray-700"
                                />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Showing <span className="font-semibold">{filteredDuplicates.length}</span> / {duplicates.length}
                            </div>
                        </div>

                        {dupLoading ? (
                            <LoadingSpinner />
                        ) : !isNonEmptyArray(filteredDuplicates) ? (
                            <EmptyState label="No duplicate employees found" />
                        ) : (
                            <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
                                <SimpleTable columns={dupColumns} rows={filteredDuplicates} />
                            </div>
                        )}
                    </SectionCard>
                )}

                {activeTab === "active_cards" && <EmployeeDiscountCardsTable />}

                {activeTab === "discount_shopping_mtd" && <EmployeeDiscountShoppingMTDTable filters={filters} />}
            </div>
        </div>
    );
};

export default EmployeeDiscount;
