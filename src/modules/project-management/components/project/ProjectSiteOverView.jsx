import React, { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    FileText, Package, DollarSign, Users, TrendingUp,
    Calendar, Award, CheckCircle, Info
} from 'lucide-react';
import api from "@config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ProjectSiteOverView = ({ id }) => {
    const fetchCivilDetail = async () => {
        const res = await api.get(`pms/projects/${id}/civil-detail`);
        return res.data?.data;
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['projectCivilDetail', id],
        queryFn: fetchCivilDetail,
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    // ---------- helpers (not hooks) ----------
    const formatCurrency = (amount, currency = 'PKR') => {
        const n = Number(amount || 0);
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2
            }).format(n);
        } catch {
            return `${currency} ${n.toFixed(2)}`;
        }
    };
    const formatDate = (d) => {
        if (!d) return 'N/A';
        try {
            return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return d;
        }
    };
    const statusPill = (status) => {
        switch (status) {
            case 'open':       return 'bg-warning text-white';
            case 'awarded':    return 'bg-success text-white';
            case 'cancelled':  return 'bg-danger text-white';
            case 'submitted':  return 'bg-info text-white';
            case 'draft':
            default:           return 'bg-secondary text-white';
        }
    };
    const pretty = (s='') => s.split('_').map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(' ');

    // ---------- MEMOS ----------
    const totals = data?.totals ?? {};
    const boqs = data?.boqs ?? [];

    const vendorStatusData = useMemo(() => {
        const breakdown = totals.vendor_status_breakdown || {};
        return Object.entries(breakdown).map(([status, count]) => ({
            name: pretty(status),
            value: count
        }));
    }, [totals]);

    // use theme-like palette (primary/info/success/violet teal etc.)
    const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#14B8A6', '#A78BFA'];

    const boqChartData = useMemo(() => {
        return (boqs || []).map((b, idx) => ({
            name: b.boq_no ? `${b.boq_no}` : `BOQ ${idx + 1}`,
            amount: Number(b.total_amount || 0),
            items: Number(b.items_count || 0),
            currency: b.currency || 'PKR'
        }));
    }, [boqs]);

    // ---------- early returns ----------
    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-10">
                <div className="bg-danger/10 border border-danger rounded-lg p-6 max-w-lg mx-auto">
                    <div className="flex items-center justify-center mb-2">
                        <Info className="w-5 h-5 text-danger mr-2" />
                        <h3 className="text-base font-semibold text-danger">
                            Unable to load civil details
                        </h3>
                    </div>
                    <p className="text-danger/90 text-sm">
                        {error?.message || 'Something went wrong.'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 rounded-lg bg-danger text-white text-sm hover:opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <div className="max-w-sm mx-auto">
                    <i className="ri-file-list-line text-gray-400 text-4xl mb-4 block"></i>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No civil details available
                    </h3>
                </div>
            </div>
        );
    }

    // ---------- render ----------
    return (
        <div className="space-y-6 pb-8 md:pb-12">
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total BOQs – keep gradient in dark mode too */}
                <div className="bg-primary-gradient rounded-lg shadow-lg p-6 text-white border border-primary/30">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FileText className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-3xl font-bold">{totals.boqs ?? 0}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/80">Total BOQs</p>
                </div>

                {/* Total Tenders */}
                <div className="rounded-lg p-6 border border-success/30 bg-success/10">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-success rounded-lg">
                            <Package className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-3xl font-bold text-success">
              {totals.tenders ?? 0}
            </span>
                    </div>
                    <p className="mt-2 text-sm text-success">Total Tenders</p>
                </div>

                {/* Total BOQ Amount */}
                <div className="rounded-lg p-6 border border-info/30 bg-info/10">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-info rounded-lg">
                            <DollarSign className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-3xl font-bold text-info">
              {totals.boq_total_amount || 0}
            </span>
                    </div>
                    <p className="mt-2 text-sm text-info">Total BOQ Amount</p>
                </div>

                {/* Total Vendor Submissions (unique gradient, dark-safe) */}
                <div
                    className="rounded-lg p-6 text-white shadow-lg border border-white/10
             bg-gradient-to-br from-fuchsia-600 via-pink-600 to-rose-600"
                    aria-label="Total Vendor Submissions"
                >
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Users className="w-6 h-6 text-white"/>
                        </div>
                        <span className="text-3xl font-bold">
      {vendorStatusData.reduce((a, c) => a + (c.value || 0), 0)}
    </span>
                    </div>
                    <p className="mt-2 text-sm text-white/80">Total Vendor Submissions</p>
                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="bg-white dark:bg-bodybg rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary"/>
                        BOQ Financial Overview
                    </h3>
                    {boqChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={boqChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12}/>
                                <YAxis stroke="#6B7280" fontSize={12}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value, name, entry) => {
                                        if (name === 'amount') return [formatCurrency(value, entry?.payload?.currency || 'PKR'), 'Amount'];
                                        return [value, 'Items'];
                                    }}
                                />
                                <Legend/>
                                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Amount"/>
                                <Bar dataKey="items" fill="#10B981" radius={[8, 8, 0, 0]} name="Items"/>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No BOQ
                            data</div>
                    )}
                </div>

                <div
                    className="bg-white dark:bg-bodybg rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-success"/>
                        Vendor Status Distribution
                    </h3>
                    {vendorStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={vendorStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {vendorStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">No vendor
                            status data</div>
                    )}
                </div>
            </div>

            {/* BOQs + Tender/Vendors */}
            {(boqs || []).map((boq, index) => (
                <div key={boq.id}
                     className="bg-white dark:bg-bodybg rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-indigo-600 p-4">
                        <div className="flex items-center justify-between">
                            {/* LEFT: title + BOQ no + buttons (title colors unchanged) */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{boq.title}</h3>
                                    <p className="text-white/80 text-sm mt-1">
                                        {boq.boq_no || `BOQ ${index + 1}`}
                                    </p>
                                </div>

                                {boq.tender && (
                                    <div className="flex items-center gap-2 ml-2">
                                        {boq.tender.status !== "draft" && (
                                            <Link
                                                to={`/module/civil/tender/comparison/${boq.tender.id}`}
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-info text-white hover:opacity-90"
                                                title="View Comparison Report"
                                            >
                                                View Comparison Report
                                            </Link>
                                        )}
                                        <Link
                                            to={`/module/civil/tender/detail/${boq.tender.id}`}
                                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-success text-white hover:opacity-90"
                                            title="View Tender Detail"
                                        >
                                            View Tender Detail
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT: finalized badge (unchanged) */}
                            {boq.is_finalized && (
                                <span
                                    className="px-4 py-2 bg-success text-white rounded-full text-sm font-semibold flex items-center">
      <CheckCircle className="w-4 h-4 mr-1"/>
      Finalized
    </span>
                            )}
                        </div>

                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div
                                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Total
                                    Amount</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                                    {formatCurrency(boq.total_amount, boq.currency)}
                                </p>
                            </div>
                            <div
                                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Items
                                    Count</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{boq.items_count || 0}</p>
                            </div>
                            <div
                                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Version</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{boq.version}</p>
                            </div>
                        </div>

                        {!!boq.description && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">{boq.description}</p>
                            </div>
                        )}

                        {boq.tender && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                <div className="flex items-center mb-4">
                                    <Award className="w-5 h-5 mr-2 text-warning"/>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                                        Associated Tender
                                    </h4>
                                </div>

                                {/* tokenized tender block */}
                                <div className="rounded-lg p-4 mb-4 border border-warning/30 bg-warning/10">
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Left side: title + tender number */}
                                        <div>
                                            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                                                {boq.tender.title}
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {boq.tender.tender_no}
                                            </p>
                                        </div>

                                        {/* Right side: view button + status pill */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/module/civil/boq/detail/${id}`}
                                                title="View BOQ"
                                                className="ti-btn ti-btn-success ti-btn-sm flex items-center justify-center"
                                            >
                                                <i className="ri-eye-line"></i>
                                            </Link>
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusPill(
                                                    boq.tender.status
                                                )}`}
                                            >
      {pretty(boq.tender.status)}
    </span>
                                        </div>
                                    </div>


                                    {!!boq.tender.description && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{boq.tender.description}</p>
                                    )}

                                    <div className="flex items-center flex-wrap gap-6 text-sm">
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <Calendar className="w-4 h-4 mr-1"/>
                                            <span>Start: {formatDate(boq.tender.started_at)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <Calendar className="w-4 h-4 mr-1"/>
                                            <span>End: {formatDate(boq.tender.ended_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {Array.isArray(boq.tender.vendors) && boq.tender.vendors.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Vendors ({boq.tender.vendors.length})
                                        </h5>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {boq.tender.vendors.map((v) => (
                                                <div
                                                    key={v.id}
                                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {(v?.vendor?.full_name || '?').charAt(0)}
                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-gray-200">
                                                                    {v?.vendor?.full_name || 'Unknown'}
                                                                </p>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {v?.vendor?.email || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                v.status === 'awarded'
                                                                    ? 'bg-success/10 text-success border border-success/30'
                                                                    : v.status === 'submitted'
                                                                        ? 'bg-info/10 text-info border border-info/30'
                                                                        : v.status === 'rejected'
                                                                            ? 'bg-danger/10 text-danger border border-danger/30'
                                                                            : v.status === 'under_negotiation'
                                                                                ? 'bg-warning/10 text-warning border border-warning/30'
                                                                                : 'bg-secondary/10 text-secondary border border-secondary/30'
                                                            }`}>
                              {pretty(v.status) || 'N/A'}
                            </span>
                                                    </div>

                                                    <div
                                                        className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                        <div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Amount</p>
                                                            <p className="font-semibold text-gray-900 dark:text-gray-200">
                                                                {formatCurrency(v?.total_amount || 0, boq.currency || 'PKR')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Submitted</p>
                                                            <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
                                                                {v?.submitted_at ? formatDate(v.submitted_at) : '—'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {!!v?.notes && (
                                                        <div
                                                            className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{v.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default memo(ProjectSiteOverView);
