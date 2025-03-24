//
// import React, { useEffect, useState } from 'react';
// import { fetchGrossSaleBeforeReturnData } from "../../services/wiseside_services.js";
//
// function OnlineGrossSaleBeforeReturn({ filters }) {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         if (filters.date_from && filters.date_to) {
//             setLoading(true);
//             fetchGrossSaleBeforeReturnData(filters.date_from, filters)
//                 .then((responseData) => {
//                     setData(responseData);
//                     setLoading(false);
//                 })
//                 .catch((error) => {
//                     console.error('Error fetching data:', error);
//                     setLoading(false);
//                 });
//         }
//     }, [filters]);
//
//     const formatNumber = (num) => {
//         return num.toLocaleString();
//     };
//
//     return (
//         <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
//             <table className="min-w-full table-auto border-collapse border border-gray-400">
//                 <thead style={{
//                     backgroundColor: "rgba(30, 58, 138, 0.85)",
//                     color: "white",
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 10
//                 }}>
//                 <tr>
//                     <th className="px-4 py-2 border border-gray-400">Date</th>
//                     <th className="px-4 py-2 border border-gray-400">Day</th>
//                     <th className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
//                     <th className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
//                     <th className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {loading ? (
//                     <tr>
//                         <td colSpan="5" className="text-center py-4">Loading...</td>
//                     </tr>
//                 ) : (
//                     data.map((row, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                             <td className="px-4 py-2 border text-center border-gray-400">{row.date}</td>
//                             <td className="px-4 py-2 border  text-center  border-gray-400">{row.day}</td>
//                             <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.full_price)}</td>
//                             <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.discounted)}</td>
//                             <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.total)}</td>
//                         </tr>
//                     ))
//                 )}
//                 </tbody>
//                 <tfoot>
//                 <tr className="bg-gray-200 font-bold">
//                     <td colSpan="2"
//                         className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">Total
//                     </td>
//                     <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
//                         {formatNumber(data.reduce((acc, row) => acc + row.full_price, 0))}
//                     </td>
//                     <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
//                         {formatNumber(data.reduce((acc, row) => acc + row.discounted, 0))}
//                     </td>
//                     <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
//                         {formatNumber(data.reduce((acc, row) => acc + row.total, 0))}
//                     </td>
//                 </tr>
//                 </tfoot>
//             </table>
//             <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
//                 <p>*Omni Added in E-Store and Excluded from B&M.
//                 </p>
//             </div>
//         </div>
//     );
// }
//
// export default OnlineGrossSaleBeforeReturn;
import React, { useEffect, useState } from 'react';
import { fetchGrossSaleBeforeReturnData } from "../../services/wiseside_services.js";

function OnlineGrossSaleBeforeReturn({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (filters.date_from && filters.date_to) {
            setLoading(true);
            fetchGrossSaleBeforeReturnData(filters.date_from, filters)
                .then((responseData) => {
                    setData(responseData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [filters]);

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
                <table className="min-w-full table-auto border-collapse border border-gray-400">
                    <thead style={{
                        backgroundColor: "#0b3588",
                        color: "white",
                        position: "sticky",
                        top: 0,
                        zIndex: 10
                    }}>
                    <tr>
                        <th className="px-4 py-2 border border-gray-400">Date</th>
                        <th className="px-4 py-2 border border-gray-400">Day</th>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Loading...</td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border text-center border-gray-400">{row.date}</td>
                                <td className="px-4 py-2 border text-center border-gray-400">{row.day}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.full_price)}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.discounted)}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right">{formatNumber(row.total)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                    <tfoot>
                    <tr className="bg-gray-200 font-bold">
                        <td colSpan="2"
                            className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">Total
                        </td>
                        <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumber(data.reduce((acc, row) => acc + row.full_price, 0))}
                        </td>
                        <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumber(data.reduce((acc, row) => acc + row.discounted, 0))}
                        </td>
                        <td className="px-4 py-2 text-right border border-gray-400 font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumber(data.reduce((acc, row) => acc + row.total, 0))}
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
                <p>*Omni Added in E-Store and Excluded from B&M.</p>
            </div>
        </div>
    );
}

export default OnlineGrossSaleBeforeReturn;