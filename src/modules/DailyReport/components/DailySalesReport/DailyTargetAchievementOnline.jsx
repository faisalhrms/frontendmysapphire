import React from 'react';

const DailyTargetAchievementOnline = () => {

    const data = [
        { date: '2025-03-01', day: 'Monday', actualSale:'80',  achPercentage: -80, positionNum: 1 },
        { date: '2025-03-02', day: 'Tuesday', achPercentage: 15.4, positionNum: 2 },
        { date: '2025-03-03', day: 'Wednesday', achPercentage: 90, positionNum: 3 },
        { date: '2025-03-04', day: 'Thursday', achPercentage: 36.1, positionNum: 4 },
    ];

    const getAchColor = (achPercentage) => {
        return achPercentage < 0 ? 'text-danger' : 'text-success';
    };

    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? <i className="ri-arrow-down-s-line"></i> : <i className="ri-arrow-up-s-line"></i>; // Down arrow for negative, up arrow for positive
    };



    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                    <th rowSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                    <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Store Type</th>
                    <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline</th>
                    <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                </tr>
                <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>

                    <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                </tr>
                <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Date</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Day</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>


                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.date}</td>
                        <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.day}</td>
                        <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.actualSale}</td>
                        <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.achPercentage}</td>
                        <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.achPercentage)}`}>
                            {getAchIcon(row.achPercentage)} {row.achPercentage}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DailyTargetAchievementOnline;
