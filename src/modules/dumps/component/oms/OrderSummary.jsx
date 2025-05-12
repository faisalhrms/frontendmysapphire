import React from 'react';
import { useForm } from "react-hook-form";
import OmsDateDropdown from "@modules/dumps/component/oms/OmsDateDropdown.jsx";

const OrderSummary = ({data , setFilters}) => {
    const { control, handleSubmit, errors } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    const handleDateChange = (dates) => {
        console.log(dates); 
        setFilters(dates);
    };


    const getFileThumbnail = (fileUrl) => {


        return <div className="w-16 h-20 bg-success/10 flex items-center justify-center rounded">
            <img src="https://res.cloudinary.com/dsarj6ihu/image/upload/v1746883233/h_cp7cmg.png" alt="Excel Icon"
                 className="w-8 h-8 text-success"/>
        </div>
    };

    const getFileName = (fileUrl) => {
        if (!fileUrl) return "Unknown file";
        const parts = fileUrl.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">

            <div className="flex justify-between mb-6 items-center">

                <div className="flex gap-6 items-center">
                    <OmsDateDropdown control={control} errors={errors} onDateChange={handleDateChange}/>
                </div>

                <div>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="ti-btn ti-btn-primary !mb-0 text-white rounded-lg px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        <i className="ri-download-line mr-2"></i>Download
                    </button>
                </div>
            </div>

            <div className="w-full">
                {data && data?.length > 0 ? (<div className="w-full bg-gray-50 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="grid grid-cols-3 gap-2">
                        {data?.map((file, index) => (<div key={index}
                                                          className="bg-white rounded-md border border-gray-200  flex items-center justify-between shadow-sm dark:text-gray-200 dark:bg-bodybg">
                            <div className="flex items-center space-x-3">
                                {getFileThumbnail(file.file_url)}
                                <div>
                                    <p className="text-sm font-bold text-gray-800 truncate max-w-xs dark:text-gray-200 dark:bg-bodybg">
                                        {getFileName(file.file_url)}
                                    </p>
                                    <div className="flex space-x-3 text-xs ">
                                        <span className="text-lg text-bold text-success"> {file.report_hour}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 m-4">

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
            </div>
        </div>
    );
};

export default OrderSummary;
