import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import useDarkModeForm from "@redux/common/useDarkModeForm.js";

export default function CartonDetailPage() {
    const { id } = useParams();
    const isDark = useDarkModeForm();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/public/transfer-order/carton/${id}/details/`,
                    {
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
    }, [id]);

    const items = useMemo(() => (Array.isArray(data?.items) ? data.items : []), [data]);

    const uniqueProducts = useMemo(() => {
        const products = items.map(i => i?.product_name).filter(Boolean);
        return new Set(products).size;
    }, [items]);

    return (
        <div className={`min-h-screen py-4 px-3 sm:px-4 lg:px-6 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <nav className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : ''}`}>
                        <a className="text-primary hover:text-primary transition-colors">Carton</a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {data?.carton_no}
                        </span>
                    </nav>
                </div>
                <div className={`p-5 pl-0 mb-4 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg' : ''}`}>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                Carton Details
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                View carton items and details information
                            </p>
                        </div>
                    </div>
                </div>
                {isLoading && (
                    <div className={`rounded-lg shadow-sm border p-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <LoadingSpinner />
                    </div>
                )}
                {error && (
                    <div className={`rounded-lg shadow-sm border p-4 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50' : 'bg-white border-red-200'}`}>
                        <div className={`flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-200'}`}>
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                                {error?.message || 'Failed to load data. Please try again.'}
                            </p>
                        </div>
                    </div>
                )}
                {!isLoading && !error && (
                    <>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className={`rounded-lg shadow-sm border p-4 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Carton
                                            Number</p>
                                        <p className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}
                                           title={data?.carton_no}>
                                            {data?.carton_no ?? '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-lg shadow-sm border p-4 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total
                                            Quantity</p>
                                        <p className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{data?.total_qty}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-lg shadow-sm border p-4 ${isDark ? 'dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink/50 rounded-lg">
                                        <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total
                                            SKUs</p>
                                        <p className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{items.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg shadow-sm border overflow-hidden ${
                                isDark
                                    ? "dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50"
                                    : "bg-white border-gray-200"
                            }`}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">
                                            Sr. No
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-64">
                                            Product Code
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-64">
                                            Product Name
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Color
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-32">
                                            List Price
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Attribute
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-80">
                                            Carton Number
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody
                                        className={`divide-y ${
                                            isDark
                                                ? "dark:text-gray-200 dark:bg-bodybg border border-gray-200 bg-gray-50"
                                                : "divide-gray-200 bg-white"
                                        }`}
                                    >
                                    {items.length === 0 ? (
                                        <tr>
                                            <td className="px-5 py-12 text-center" colSpan={10}>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div
                                                        className={`p-4 rounded-full ${
                                                            isDark ? "bg-gray-700" : "bg-gray-100"
                                                        }`}
                                                    >
                                                        <svg
                                                            className={`w-10 h-10 ${
                                                                isDark ? "text-gray-400" : "text-gray-400"
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className={`text-base font-semibold ${
                                                                isDark ? "text-gray-100" : "text-gray-900"
                                                            }`}
                                                        >
                                                            No Items Found
                                                        </p>
                                                        <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                                                        >
                                                            There are no items in this carton
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className={`hover:${
                                                    isDark ? "bg-gray-700" : "bg-gray-50"
                                                } transition-colors`}
                                            >
                                                <td className="px-5 py-4"><span className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{row.sr_no}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className={`text-sm font-mono ${isDark ? "text-gray-100" : "text-gray-900"}`}>{row.product_code ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{row.product_name ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{row.category ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-semibold bg-primary/10 text-primary ">{row.size_code ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-semibold bg-primary/5 text-primary ">{row.color_code ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-semibold bg-primary/5 text-primary ">{row.list_price ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                           <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{row.attribute ?? "-"}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{Number(row.qty) || 0}</span>
                                                </td>
                                                <td className="px-5 py-4"><span className={`text-sm font-mono ${isDark ? "text-gray-100" : "text-gray-900"}`}>{row.carton_number ?? "-"}</span>
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