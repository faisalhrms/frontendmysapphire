// import React, { useState, useEffect } from "react";
// import { fetchOciDumps } from "../services/dumps_services.js";
//
// const OciForm = ({data, filters }) => {
//     console.log(`this is data`,data)
//     const [filteredFiles, setFilteredFiles] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const getOciDumps = async () => {
//             if (!filters || !filters.date) {
//                 console.warn("No date filter provided");
//                 return;
//             }
//
//             setLoading(true);
//             try {
//                 const formattedDate = filters.date;
//                 console.log(`Fetching OCI dumps for date: ${formattedDate}`);
//
//                 const response = await fetchOciDumps(formattedDate);
//                 console.log("API Response:", response);
//
//                 if (response && response.data) {
//                     setFilteredFiles(response.data);
//                 } else {
//                     setFilteredFiles([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching OCI dumps:", error.response || error.message || error);
//                 setError(`Error fetching OCI dumps: ${error.message || "Unknown error"}`);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         getOciDumps();
//     }, [filters]);
//     console.log(filteredFiles)
//
//     const getFileIcon = (fileUrl) => {
//         if (fileUrl.includes("xlsx") || fileUrl.includes("xls")) {
//             return (
//                 <div className="w-full h-full bg-success/10  flex items-center justify-center rounded">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-success">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9l-6-6H9a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
//                     </svg>
//                 </div>
//             );
//         } else if (fileUrl.includes("jpg") || fileUrl.includes("png") || fileUrl.includes("jpeg") || fileUrl.includes("gif")) {
//             return (
//                 <img src={fileUrl} alt="file" className="w-full h-full object-cover rounded"/>
//             );
//         } else {
//             return (
//                 <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9l-6-6H9a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
//                     </svg>
//                 </div>
//             );
//         }
//     };
//
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="text-red-500 p-4 text-center">
//                 {error}
//             </div>
//         );
//     }
//
//     return (
//         <div className="w-full">
//             {filteredFiles.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-200">
//                         <thead>
//                         <tr>
//                             <th className="py-2 px-4 border-b text-left">File</th>
//                             <th className="py-2 px-4 border-b text-left">Report Date</th>
//                             <th className="py-2 px-4 border-b text-left">Report Hour</th>
//                             <th className="py-2 px-4 border-b text-left">Completion Time</th>
//                             <th className="py-2 px-4 border-b text-left">Download</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {filteredFiles.map((file, index) => (
//                             <tr key={index} className="hover:bg-gray-100">
//                                 <td className="py-2 px-4">
//                                     <a
//                                         href={file.file_url}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="ti-btn ti-btn-secondary ti-btn-sm"
//                                     >
//                                         <i className="ri-download-line"></i>
//                                     </a>
//
//                                 </td>
//                                 {/*<td className="py-2 px-4">{getFileIcon(file.file_url)}</td>*/}
//                                 <td className="py-2 px-4">{file.report_date}</td>
//                                 <td className="py-2 px-4">{file.report_hour}</td>
//                                 <td className="py-2 px-4">{new Date(file.report_completion_time).toLocaleString()}</td>
//                                 <td className="py-2 px-4">
//                                     <a
//                                         href={file.file_url}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="ti-btn ti-btn-secondary ti-btn-sm"
//                                     >
//                                         <i className="ri-download-line"></i>
//                                     </a>
//
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div className="flex flex-col items-center justify-center h-64 rounded-lg overflow-hidden p-8 mt-4">
//                     <img src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg" alt="No files"
//                          className="w-48 h-auto mb-6"/>
//                     <p className="font-bold text-xl text-gray-700">No Files Available for this Date</p>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default OciForm;
import React, { useState, useEffect } from "react";
import { fetchOciDumps } from "../services/dumps_services.js";


const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-success">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const OciForm = ({ data, filters }) => {
    console.log(`this is data`, data);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOciDumps = async () => {
            if (!filters || !filters.date) {
                console.warn("No date filter provided");
                return;
            }

            setLoading(true);
            try {
                const formattedDate = filters.date;
                console.log(`Fetching OCI dumps for date: ${formattedDate}`);

                const response = await fetchOciDumps(formattedDate);
                console.log("API Response:", response);

                if (response && response.data) {
                    setFilteredFiles(response.data);
                } else {
                    setFilteredFiles([]);
                }
            } catch (error) {
                console.error("Error fetching OCI dumps:", error.response || error.message || error);
                setError(`Error fetching OCI dumps: ${error.message || "Unknown error"}`);
            } finally {
                setLoading(false);
            }
        };

        getOciDumps();
    }, [filters]);

    console.log(filteredFiles);


    const getFileIcon = (fileUrl) => {
        if (fileUrl.includes("xlsx") || fileUrl.includes("xls")) {
            return <ExcelIcon />;
        } else if (fileUrl.includes("jpg") || fileUrl.includes("png") || fileUrl.includes("jpeg") || fileUrl.includes("gif")) {
            return <ImageIcon />;
        } else {
            return <DocumentIcon />;
        }
    };

    // Function to render file thumbnail
    const getFileThumbnail = (fileUrl) => {
        if (fileUrl.includes("xlsx") || fileUrl.includes("xls")) {
            return (
                <div className="w-12 h-12 bg-success/10 flex items-center justify-center rounded">
                    <ExcelIcon />
                </div>
            );
        } else if (fileUrl.includes("jpg") || fileUrl.includes("png") || fileUrl.includes("jpeg") || fileUrl.includes("gif")) {
            // For actual images, we can either show the image itself or the icon
            return (
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded overflow-hidden">
                    <ImageIcon />
                </div>
            );
        } else {
            return (
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                    <DocumentIcon />
                </div>
            );
        }
    };

    // Helper function to extract filename from URL
    const getFileName = (fileUrl) => {
        if (!fileUrl) return "Unknown file";
        const parts = fileUrl.split('/');
        return parts[parts.length - 1];
    };


    const formatFileSize = (size) => {
        return size ? size : "Unknown size";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            {filteredFiles.length > 0 ? (
                <div className="w-full bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-2">
                        {filteredFiles.map((file, index) => (
                            <div key={index} className="bg-white rounded-md border border-gray-200 p-3 flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-3">
                                    {getFileThumbnail(file.file_url)}
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                                            {getFileName(file.file_url)}
                                        </p>
                                        <div className="flex space-x-3 text-xs text-gray-500">
                                            <span>{file.report_date}</span>
                                            <span>•</span>
                                            <span>{file.report_hour}</span>
                                            <span>•</span>
                                            <span>{new Date(file.report_completion_time).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">

                                    <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 ti-btn ti-btn-secondary ti-btn-sm flex items-center justify-center rounded "
                                        download
                                    >
                                        <i className="ri-download-line"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 rounded-lg overflow-hidden p-8 mt-4">
                    <img src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg" alt="No files"
                         className="w-48 h-auto mb-6"/>
                    <p className="font-bold text-xl text-gray-700">No Files Available for this Date</p>
                </div>
            )}
        </div>
    );
};

export default OciForm;