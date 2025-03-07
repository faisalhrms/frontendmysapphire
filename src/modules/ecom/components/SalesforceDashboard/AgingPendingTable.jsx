

import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const AgingPendingTable = ({ title, headers, data, totals = [], noteText = "", loading, onCellClick }) => {
    const renderNoteText = (note) => {
        if (!note) return null;

        const formattedText = note
            .replace(/Unapproved:/g, '<p><strong style="color: black;">Unapproved:</strong>')
            .replace(/Approved:/g, '<p><strong style="color: black;">Approved:</strong>')
            .replace(/Not Picked:/g, '<p><strong style="color: black;">Not Picked:</strong>')
            .replace(/In-Transit:/g, '<p><strong style="color: black;">In-Transit:</strong>');

        return (
            <div className="mt-4 text-xs text-right p-2 border text-gray-800 border-gray-300 rounded bg-white">
                <div dangerouslySetInnerHTML={{ __html: formattedText }} />
            </div>
        );
    };

    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-sm font-bold text-black px-4 py-2 rounded-t bg-yellow-300">{title}</h2>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-400">
                        <thead className="bg-gray-200 text-black text-sm">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="text-xs font-bold py-2 border border-gray-400">{header}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody className="text-sm">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                    {Object.entries(row).map(([key, cell], cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            onClick={() => onCellClick(row)} // Pass the row to the parent on click
                                            className={`py-2 px-4 border border-gray-400 ${cellIndex !== 0 ? "text-right" : "text-left"}`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        </tbody>

                        {totals.length > 0 && (
                            <tfoot>
                            <tr className="font-bold text-black bg-gray-200">
                                {totals.map((total, index) => (
                                    <td
                                        key={index}
                                        className={`py-2 px-4 border border-gray-200 ${index !== 0 ? "text-right" : "text-left"}`}
                                    >
                                        {total}
                                    </td>
                                ))}
                            </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            )}

            {renderNoteText(noteText)}
        </div>
    );
};

AgingPendingTable.propTypes = {
    title: PropTypes.string.isRequired,
    headers: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    totals: PropTypes.array,
    noteText: PropTypes.string,
    loading: PropTypes.bool,
    onCellClick: PropTypes.func.isRequired,
};

export default AgingPendingTable;