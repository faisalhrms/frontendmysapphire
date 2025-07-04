import React, {useState} from 'react';
import { formatNumberWithCommas } from "@helpers/formatters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import TbodyShimmer from "@components/TbodyShimmer.jsx";
import AnimatedMascot from "@components/AnimatedMascot.jsx";
import api from "@config/axiosConfig.js";

const ExecutiveSummaryTable = ({ type = 'rco', title, filters, rows = 4, downloadEndpoint, reportName }) => {
    const { data, isLoading } = useFetchWithFilters(
        `/ecom/pending-liabilities/executive-summary/${type}/`, filters, { refetchOnWindowFocus: false }
    );
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await api.get(downloadEndpoint, {
                params: {
                    ...filters
                },
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = `${reportName}.csv`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) filename = match[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download file.");
        }finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg relative">
            {isLoading && <AnimatedMascot />}
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th
                            colSpan="2"
                            className="bg-blue-300 border border-gray-400 p-2 text-center font-normal relative"
                        >
                            {title}
                            {downloadEndpoint && (
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`absolute right-2 top-1 text-black hover:text-blue-700 ${
                                        isDownloading ? "cursor-not-allowed opacity-50" : ""
                                    }`}
                                    title={isDownloading ? "Downloading..." : "Download CSV"}
                                >
                                    {isDownloading ? (
                                        <i className="ri-loader-4-line animate-spin text-lg text-success" />
                                    ) : (
                                        <i className="ri-download-2-line text-lg text-primary" />
                                    )}
                                </button>
                            )}

                        </th>
                    </tr>
                    </thead>
                    {isLoading ? (
                        <TbodyShimmer rows={rows} columns={2} />
                    ) : (
                        <tbody>
                        {data?.map((row, index) => (
                            <tr key={index} className={`dark:text-gray-200 dark:bg-bodybg text-black ${row?.classes}`}>
                                <td className="border border-gray-400 p-2 whitespace-nowrap">
                                    {row?.label}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold">
                                    {formatNumberWithCommas(row?.value)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

export default ExecutiveSummaryTable;
