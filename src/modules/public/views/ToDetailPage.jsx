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

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Compact Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h1 className="text-xl font-bold text-gray-900">
                            Transfer Order Details
                        </h1>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs font-medium text-blue-900">Document View</span>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 mb-3">
                    <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                            Upon scanning of Delivery Note QR Code, the following details will be displayed for that delivery note.
                        </p>
                    </div>
                </div>

                {/* Delivery Note Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Delivery Note Number</p>
                            <p className="text-base font-bold text-gray-900">
                                {data?.delivery_note_no ?? '-'}
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

                {/* Table Section */}
                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-base font-bold text-gray-900">Order Items</h2>
                            <p className="text-sm text-gray-600">
                                {(data?.items ?? []).length} item{(data?.items ?? []).length !== 1 ? 's' : ''} found
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Sr. No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Transfer Order No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Carton Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">SKU</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">SKU Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">TO Comments</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                {(data?.items ?? []).length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center" colSpan={6}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-3 bg-gray-100 rounded-full">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">No Records Found</p>
                                                    <p className="text-xs text-gray-500 mt-1">There are no items associated with this transfer order number</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.items.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                        {row.sr_no}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-medium text-gray-900">{row.transfer_order_no ?? '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-700">{row.carton_number ?? '-'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm font-semibold text-gray-900">{row.sku}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-emerald-100 text-emerald-800">
                                                        {row.sku_qty}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-600">{row.to_comments ?? '-'}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}