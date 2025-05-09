import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";


const OciFilter = ({ filters }) => {
    const { user } = useSelector((state) => state.auth);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 1);
    const nextTwoDays = new Date(today);
    nextTwoDays.setDate(today.getDate() + 2);

    const files = [
        { id: 1, file_name: "kinza", file_extension: "jpg", file_size: 112355, date: "2025-05-01" },
        { id: 2, file_name: "sapphire", file_extension: "png", file_size: 2099, date: "2025-05-02" },
        { id: 3, file_name: "IGP OSP DOCUMENT", file_extension: "jpg", file_size: 100045, date: "2025-05-03" },
        { id: 4, file_name: "IGP OSP DOCUMENT", file_extension: "jpg", file_size: 100045, date: "2025-05-04" },
        { id: 5, file_name: "wefhjkjlkmjkkvmvjfoimfnfkvfv fnbvoivkmfbovfbpfvdvkjv", file_extension: "", file_size: 67900, date: "2025-05-05" },
        { id: 6, file_name: "kinza", file_extension: "jpg", file_size: 112355, date: "2025-05-05" },
        { id: 7, file_name: "KINZA", file_extension: "jpg", file_size: 112355, date: "2025-05-06" }
    ];

    useEffect(() => {
        const filtered = files.filter((file) => {
            const fileDate = new Date(file.date);
            return fileDate >= pastDate && fileDate <= nextTwoDays;
        });
        setFilteredFiles(filtered);
    }, [filters]);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
        else return (bytes / 1048576).toFixed(2) + " MB";
    };

    const generateFile = (file) => {
        if (file.file_extension === "jpg" || file.file_extension === "png") {
            return `<img src="/api/placeholder/60/60" class="w-full h-full object-cover rounded" />`;
        } else {
            return `<div class="w-full h-full bg-gray-100 flex items-center justify-center rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-500">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9l-6-6H9a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
        </div>`;
        }
    };

    return (
        <div className="">
            {filteredFiles.length > 0 ? (
                <PerfectScrollbar className={`box-body max-h-100 text-defaulttextcolor text-defaultsize !py--10 !px-4 ps--active-y`}>
                    <div className="p-4">
                        <div className="space-y-3">
                            <div className="max-h-screen overflow-y-auto">
                                {filteredFiles.map((file) => (
                                    <div key={file.id} className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all mb-4 dark:text-gray-200 dark:bg-bodybg">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: generateFile(file) }} />
                                        </div>
                                        <div className="flex-1 min-w-0 px-4">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.file_name}{file.file_extension && `.${file.file_extension}`}
                                            </p>
                                            <div className="text-xs text-gray-400 mt-1">
                                                <span>{formatFileSize(file.file_size)}</span>
                                                <span className="ml-3">{file.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PerfectScrollbar>
            ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100%-60px)] rounded-lg overflow-hidden p-8 mt-4">
                    <img src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg" alt="No files" className="w-48 h-auto mb-6" />
                    <p className="font-bold text-xl text-gray-700">No Files Available for this Date</p>
                </div>
            )}
        </div>
    );
};

export default OciFilter;

