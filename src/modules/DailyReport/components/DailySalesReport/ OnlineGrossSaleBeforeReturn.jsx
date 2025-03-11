
import React from 'react';

const data = [
    { date: '1', day: 'Sat', fullPrice: '3,463,076', discounted: '1,503,920', total: '4,967,002' },
    { date: '2', day: 'Sun', fullPrice: '5,987,700', discounted: '891,961', total: '6,879,681' },
    { date: '3', day: 'Mon', fullPrice: '11,014,497', discounted: '890,719', total: '11,905,216' },
    { date: '4', day: 'Tue', fullPrice: '7,802,557', discounted: '3,626,454', total: '11,429,011' },
    { date: '5', day: 'Wed', fullPrice: '6,207,660', discounted: '3,602,867', total: '9,810,527' },
    { date: '6', day: 'Thu', fullPrice: '10,209,049', discounted: '894,571', total: '11,103,598' },
    { date: '7', day: 'Fri', fullPrice: '13,416,817', discounted: '372,085', total: '13,788,902' },
    { date: '8', day: 'Sat', fullPrice: '12,391,431', discounted: '312,463', total: '12,703,692' },
];

function OnlineGrossSaleBeforeReturn() {
    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <table className="min-w-full table-auto border-collapse border border-gray-400">
                <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                    <th rowSpan="" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                    <th rowSpan="" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                    <th rowSpan="" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                    <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                    <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                    <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                </tr>
                <tr>
                    <th className="px-4 py-2 border border-gray-400">Month</th>
                    <th className="px-4 py-2 border border-gray-400">Date</th>
                    <th className="px-4 py-2 border border-gray-400">Day</th>
                    <th className="px-4 py-2 border border-gray-400">Actual</th>
                    <th className="px-4 py-2 border border-gray-400">Actual</th>
                    <th className="px-4 py-2 border border-gray-400">Actual</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-400">Feb</td>
                        <td className="px-4 py-2 border border-gray-400">{row.date}</td>
                        <td className="px-4 py-2 border border-gray-400">{row.day}</td>
                        <td className="px-4 py-2 border border-gray-400">{row.fullPrice}</td>
                        <td className="px-4 py-2 border border-gray-400">{row.discounted}</td>
                        <td className="px-4 py-2 border border-gray-400">{row.total}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr style={{  color: "black" }}>
                    <td colSpan="2" className="px-4 py-2 text-right border border-gray-400 font-bold">Total</td>
                    <td className="px-4 py-2 border border-gray-400">{'489,439,253'}</td>
                    <td className="px-4 py-2 border border-gray-400">{'49,468,707'}</td>
                    <td className="px-4 py-2 border border-gray-400">{'538,907,960'}</td>
                </tr>
                <tr style={{ color: "black"}}>
                    <td colSpan="1" className="px-4 py-2 text-right border border-gray-400 font-bold">Total</td>
                    <th rowSpan="" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                    <td className="px-4 py-2 border border-gray-400">{'489,439,253'}</td>
                    <td className="px-4 py-2 border border-gray-400">{'49,468,707'}</td>
                    <td className="px-4 py-2 border border-gray-400">{'538,907,960'}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default OnlineGrossSaleBeforeReturn;
