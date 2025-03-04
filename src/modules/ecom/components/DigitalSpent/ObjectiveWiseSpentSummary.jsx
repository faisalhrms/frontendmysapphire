import React, { useMemo } from "react";

const ObjectiveWiseSpentSummary = ({ filters = {}, loading }) => {
    const data = [
        {
            name: "Local",
            lastDay: { googleAds: 1005806, metaAds: 1597894, total: 2603700 },
            mtd: { googleAds: 19374632, metaAds: 27816757, total: 47191389 },
            subCategories: [
                { name: "Conversion", lastDay: { googleAds: 959610, metaAds: 1538731, total: 2498342 }, mtd: { googleAds: 17645844, metaAds: 24596866, total: 42242710 }},
                { name: "Awareness", lastDay: { googleAds: 46196, metaAds: 38013, total: 84190 }, mtd: { googleAds: 1728787, metaAds: 1757309, total: 3486097 }},
                { name: "Traffic", lastDay: { googleAds: 21149, metaAds: 21149, total: 21149 }, mtd: { googleAds: 0, metaAds: 1462583, total: 1462583 }},
            ],
        },
        {
            name: "UK",
            lastDay: { googleAds: 33664, metaAds: 101012, total: 134676 },
            mtd: { googleAds: 1203239, metaAds: 2789788, total: 3993026 },
            subCategories: [
                { name: "Conversion", lastDay: { googleAds: 31561, metaAds: 99349, total: 130910 }, mtd: { googleAds: 1053342, metaAds: 2317813, total: 3371155 }},
                { name: "Traffic", lastDay: { googleAds: 2102, metaAds: 1663, total: 3766 }, mtd: { googleAds: 49871, metaAds: 471974, total: 521845 }},
                { name: "Awareness", lastDay: { googleAds: 0, metaAds: 0, total: 0 }, mtd: { googleAds: 100026, metaAds: 0, total: 100026 }},
            ],
        },
        {
            name: "International",
            lastDay: { googleAds: 31122, metaAds: 73237, total: 104359 },
            mtd: { googleAds: 2046198, metaAds: 1904753, total: 3950952 },
            subCategories: [
                {
                    name: "Conversion",
                    lastDay: { googleAds: 31122, metaAds: 70661, total: 101783 },
                    mtd: { googleAds: 1768516, metaAds: 1476930, total: 3245436 },
                },
                {
                    name: "Traffic",
                    lastDay: { googleAds: 0, metaAds: 2576, total: 2576 },
                    mtd: { googleAds: 311343, metaAds: 0, total: 311343 },
                },
                {
                    name: "Awareness",
                    lastDay: { googleAds: 0, metaAds: 0, total: 0 },
                    mtd: { googleAds: 277682, metaAds: 116480, total: 394162 },
                },
            ],
        },
    ];

    const totals = {
        lastDay: { googleAds: 1070592, metaAds: 1772143, total: 2842735 },
        mtd: { googleAds: 22624069, metaAds: 32511928, total: 55135367 },
    };

    const filteredData = useMemo(() => {
        if (!data) return []; // Ensure data is defined
        if (!filters || Object.keys(filters).length === 0) return data;

        return data.map(region => ({
            ...region,
            subCategories: region.subCategories.filter(sub =>
                filters.objective?.toLowerCase ? sub.name.toLowerCase().includes(filters.objective.toLowerCase()) : true
            ),
        })).filter(region => region.subCategories.length > 0);
    }, [filters]);

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
                </div>
            ) : (
                <table className="min-w-full border border-gray-300 shadow-md">
                    <thead>
                    <tr className="bg-gray-400 text-black text-sm">
                        <th rowSpan="2" className="px-4 py-2 border">Name Origin</th>
                        <th colSpan="3" className="px-4 py-2 border">Last Day</th>
                        <th colSpan="3" className="px-4 py-2 border">MTD</th>
                    </tr>
                    <tr className="bg-gray-400 text-black text-sm">
                        <th className="px-4 py-2 border">GoogleAds</th>
                        <th className="px-4 py-2 border">MetaAds</th>
                        <th className="px-4 py-2 border">Total</th>
                        <th className="px-4 py-2 border">GoogleAds</th>
                        <th className="px-4 py-2 border">MetaAds</th>
                        <th className="px-4 py-2 border">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((region, idx) => (
                        <React.Fragment key={idx}>
                            <tr className="bg-yellow-100 font-bold">
                                <td className="px-4 py-2 border">{region.name}</td>
                                <td className="px-4 py-2 border text-right">{region.lastDay.googleAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{region.lastDay.metaAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{region.lastDay.total.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{region.mtd.googleAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{region.mtd.metaAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-right">{region.mtd.total.toLocaleString()}</td>
                            </tr>
                            {region.subCategories.map((sub, subIdx) => (
                                <tr key={subIdx} className="bg-gray-50">
                                    <td className="px-4 py-2 border pl-2">{sub.name}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.googleAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.metaAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.total.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.googleAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.metaAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    <tr className="bg-gray-400 text-black font-bold">
                        <td className="px-4 py-2 border">Total</td>
                        <td className="px-4 py-2 border text-right">{totals.lastDay.googleAds.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-right">{totals.lastDay.metaAds.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-right">{totals.lastDay.total.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-right">{totals.mtd.googleAds.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-right">{totals.mtd.metaAds.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-right">{totals.mtd.total.toLocaleString()}</td>
                    </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ObjectiveWiseSpentSummary;
