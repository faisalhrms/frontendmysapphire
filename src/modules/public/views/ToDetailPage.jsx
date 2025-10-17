import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from "@components/LoadingSpinner.jsx";

export default function ToDetailPage() {
    const { sdn_id } = useParams();
    const sdnId = Number(sdn_id || 19);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!sdnId) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/public/transfer-order-details/`,
                    {
                        params: { sdn_id: sdnId },
                        withCredentials: false,
                        timeout: 20000,
                    }
                );
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sdnId]);

    const totalQuantity = (data?.items ?? []).reduce((sum, item) => sum + (item.sku_qty || 0), 0);
    const transferOrderNo = data?.items?.[0]?.transfer_order_no || '-';

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <a href="/transfer-orders" className="text-primary hover:text-primary transition-colors">Transfer Orders</a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-600">{transferOrderNo}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium">Details</span>
                    </nav>
                </div>

                {/* Header Section with Actions */}
                <div className=" p-5 mb-4">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Transfer Order Details
                            </h1>
                            <p className="text-sm text-gray-600">
                                View and manage transfer order information
                            </p>
                        </div>

                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium text-red-800">
                                {error?.message || 'Failed to load data. Please try again.'}
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/50 rounded-lg">
                                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Transfer Order</p>
                                        <p className="text-lg font-bold text-gray-900">{transferOrderNo}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Delivery Note</p>
                                        <p className="text-lg font-bold text-gray-900">{data?.delivery_note_no ?? '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink/50 rounded-lg">
                                        <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Items</p>
                                        <p className="text-lg font-bold text-gray-900">{(data?.items ?? []).length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Quantity</p>
                                        <p className="text-lg font-bold text-gray-900">{totalQuantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b bg-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {(data?.items ?? []).length} item{(data?.items ?? []).length !== 1 ? 's' : ''} in this order
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            Sr. No
                                        </th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            Transfer Order No
                                        </th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                Carton Number
                                            </div>
                                        </th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                SKU
                                            </div>
                                        </th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                Quantity
                                            </div>
                                        </th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                Comments
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {(data?.items ?? []).length === 0 ? (
                                        <tr>
                                            <td className="px-5 py-12 text-center" colSpan={7}>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 bg-gray-100 rounded-full">
                                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold text-gray-900">No Items Found</p>
                                                        <p className="text-sm text-gray-500 mt-1">There are no items in this transfer order</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.items.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <span className="text-sm font-medium text-gray-900">{row.sr_no}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm font-medium text-gray-900">{row.transfer_order_no ?? '-'}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900 font-mono">{row.carton_number ?? '-'}</span>
                                                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Copy carton number">
                                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-semibold bg-primary/10 text-primary border border-blue-200">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {row.sku}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                        </svg>
                                                        {row.sku_qty}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {row.to_comments ? (
                                                        <span className="text-sm text-gray-700">{row.to_comments}</span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">No comments</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}