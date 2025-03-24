import React, { useState, useEffect } from 'react';
import { formatNumberWithCommas } from "@helpers/formatters.js";

const fetchData = async () => {
    return {
        offline: [
            { category: 'Unstitched Women', feb25: 1135188230, feb24: 785348970, growth: '45%' },
            { category: 'Stitched Women', feb25: 614439330, feb24: 425879430, growth: '44%' },
            { category: "Men's Stitched", feb25: 19514540, feb24: 24378940, growth: '-20%' },
            { category: "Men's Unstitched", feb25: 35009550, feb24: 25356960, growth: '38%' },
            { category: 'Modest Wear', feb25: 48915190, feb24: 43044860, growth: '14%' },

        ],
        online: [
            { category: 'Unstitched Women', feb25: 366388640, feb24: 278103140, growth: '32%' },
            { category: 'Stitched Women', feb25: 61660430, feb24: 70511810, growth: '-13%' },
            { category: "Men's Stitched", feb25: 4489940, feb24: 6717700, growth: '-33%' },
            { category: "Men's Unstitched", feb25: 5972460, feb24: 5641220, growth: '6%' },
            { category: 'Modest Wear', feb25: 33328540, feb24: 13011670, growth: '50%' },

        ],
    };
};

const SalesDataTable = () => {
    const [offlineData, setOfflineData] = useState([]);
    const [onlineData, setOnlineData] = useState([]);
    const [dates, setDates] = useState({ feb25: '', feb24: '' });

    useEffect(() => {
        const getData = async () => {
            const data = await fetchData();
            setOfflineData(data.offline);
            setOnlineData(data.online);
            setDates({
                feb25: 'Feb-25',
                feb24: 'Feb-24',
            });
        };
        getData();
    }, []);

    const getGrowthColor = (growth) => {
        return growth.startsWith('-') ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-6 bg-white mt-4  rounded-lg">
            <table className="min-w-full table-auto border-collapse  border-gray-400 border">
                <thead style={{ backgroundColor: 'rgba(30, 58, 138, 0.85)', color: 'white' }}>
                <tr>
                    <th rowSpan="2" className="border border-gray-400 p-2 font-bold sticky left-0 z-50">A Class</th>
                    <th colSpan="6" className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-16 z-50">Full Price</th>
                </tr>
                <tr>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline</th>
                    <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
                </tr>
                <tr>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center sticky left-0 z-50"></th>
                    <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">Feb</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Feb</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                    <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">Feb</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Feb</th>
                    <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                </tr>
                </thead>
                <tbody>
                {offlineData.map((item, index) => (
                    <tr key={index}>
                        <td className="p-2 text-left border-b sticky left-0 border border-gray-400">{item.category}</td>
                        <td className="p-2 text-center border-b border border-gray-400">{formatNumberWithCommas(item.feb25)}</td>
                        <td className="p-2 text-center border-b border border-gray-400">{formatNumberWithCommas(item.feb24)}</td>
                        <td className={`p-2 text-center border-b border border-gray-400 ${getGrowthColor(item.growth)}`}>{item.growth}</td>
                        <td className="p-2 text-center border-b border border-gray-400">{formatNumberWithCommas(onlineData[index]?.feb25)}</td>
                        <td className="p-2 text-center border-b border border-gray-400">{formatNumberWithCommas(onlineData[index]?.feb24)}</td>
                        <td className={`p-2 text-center border-b border border-gray-400 ${getGrowthColor(onlineData[index]?.growth)}`}>{onlineData[index]?.growth}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesDataTable;

