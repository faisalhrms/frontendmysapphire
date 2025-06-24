import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const InventoryRecon = ({}) => {
    const { data, isLoading } = useFetchWithFilters('/ecom/inventory-recon');
    return (
        <>
            <PageHeader currentpage="Inventory Recon" activepage="Ecom" mainpage="Inventory Recon"/>
            <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
                <div style={{maxHeight: '650px', overflowY: 'auto'}}>
                    <table className="min-w-full table-auto border-collapse border border-gray-400">
                        <thead style={{
                            backgroundColor: "#383853",
                            color: "white",
                            position: "sticky",
                            top: 0,
                            zIndex: 10
                        }}>
                        <tr>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">Web Status</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">SFCC Status</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">Status LessEC4</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">SKU Count</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">D365 Quantity</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">OCI Quantity</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">Difference</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            data?.length > 0 && (data?.map((row, index) => (
                                    <tr key={index} className={row.web_status === 'Grand Total' ? 'bg-gray-300 font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg' : ''}>
                                        <td className="px-4 py-2 border">{row.web_status}</td>
                                        <td className="px-4 py-2 border">{row.sfcc_status}</td>
                                        <td className="px-4 py-2 border text-center">{row.status ? <span className='badge !rounded-full bg-primary/10 text-primary'>{row.status}</span> : ''}</td>
                                        <td className="px-4 py-2 border text-right">{row.sku_count}</td>
                                        <td className="px-4 py-2 border text-right">{row.d365_quantity}</td>
                                        <td className="px-4 py-2 border text-right">{row.oci_quantity}</td>
                                        <td className="px-4 py-2 border text-right">{row.difference}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
};

export default InventoryRecon;
