
import React, { useState, useEffect } from 'react';
import { fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT } from "../../services/wiseside_services.js";

const SalesDataTable = () => {
    const [data, setData] = useState({
        lastDay: [],
        mtd: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format

    // Fetch both last day and MTD data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const lastDayResult = await fetchSaleMtdLdDataLD(currentDate);
                const mtdResult = await fetchSaleMtdLdDataMT(currentDate);

                setData({
                    lastDay: lastDayResult || [],
                    mtd: mtdResult || []
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentDate]);

    const formatNumber = (num) => {
        if (num === undefined || num === null) return '';
        return num.toLocaleString();
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

    const lastDayData = data.lastDay?.[0]?.regions?.[0]?.stores || [];
    const mtdData = data.mtd?.[0]?.regions?.[0]?.stores || [];

    return (
        <div className="w-full mt-4 bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Last Day Sales Table */}
                <div className="mt-4 p-4 shadow-lg">
                    <h2 className="text-center text-xl font-bold">Last Day Sales</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                            <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">SaleType (Map)</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                            </tr>
                            <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Store Name</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center font-bold">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {lastDayData.length > 0 ? (
                                lastDayData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="border border-gray-300 px-2 py-1 font-semibold">{row.store_name}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.fullprice_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.fullprice_sale_value)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.discounted_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.discounted_sale_value)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.total_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.total_sale_value)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="border border-gray-300 px-2 py-4 text-center">No data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MTD Sales Table */}
                <div className="bg-white p-4 shadow-lg">
                    <h2 className="text-center text-xl font-bold">MTD Sales</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                            <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">SaleType (Map)</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                            </tr>
                            <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Store Name</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center font-bold">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {mtdData.length > 0 ? (
                                mtdData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="border border-gray-300 px-2 py-1 font-semibold">{row.store_name}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.fullprice_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.fullprice_sale_value)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.discounted_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.discounted_sale_value)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.total_sale_qty)}</td>
                                        <td className="border border-gray-300 px-2 py-1 text-right">{formatNumber(row.total_sale_value)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="border border-gray-300 px-2 py-4 text-center">No data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDataTable;
