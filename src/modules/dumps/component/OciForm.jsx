import React from "react";


const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-success">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>);

const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>);

const OciForm = ({dumps}) => {
    const getFileThumbnail = (fileUrl) => {
        if (fileUrl.includes("xlsx") || fileUrl.includes("xls")) {
            return (<div className="w-12 h-12 bg-success/10 flex items-center justify-center rounded">
                    <ExcelIcon/>
                </div>);
        } else if (fileUrl.includes("jpg") || fileUrl.includes("png") || fileUrl.includes("jpeg") || fileUrl.includes("gif")) {
            return (<div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded overflow-hidden">
                    <ImageIcon/>
                </div>);
        } else {
            return (<div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                    <DocumentIcon/>
                </div>);
        }
    };

    const getFileName = (fileUrl) => {
        if (!fileUrl) return "Unknown file";
        const parts = fileUrl.split('/');
        return parts[parts.length - 1];
    };

    return (<div className="w-full">
            {dumps && dumps.length > 0 ? (<div className="w-full bg-gray-50 p-4 dark:text-gray-200 dark:bg-bodybg">
                    <div className="grid grid-cols-3 gap-2">
                        {dumps.map((file, index) => (<div key={index}
                                                          className="bg-white rounded-md border border-gray-200 p-3 flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-3">
                                    {getFileThumbnail(file.file_url)}
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 truncate max-w-xs">
                                            {getFileName(file.file_url)}
                                        </p>
                                        <div className="flex space-x-3 text-xs ">
                                            <span className="text-lg text-bold text-success"> {file.report_hour}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">

                                    <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ti-btn ti-btn-primary !mb-0"
                                        download
                                    >
                                        <i className="ri-download-line"></i>
                                    </a>
                                </div>
                            </div>))}
                    </div>
                </div>) : (
                <div className="flex flex-col items-center justify-center h-64 rounded-lg overflow-hidden p-8 mt-4">
                    <img src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg" alt="No files"
                         className="w-48 h-auto mb-6"/>
                    <p className="font-bold text-xl text-gray-700">No Files Available for this Date</p>
                </div>)}
        </div>);
};

export default OciForm;