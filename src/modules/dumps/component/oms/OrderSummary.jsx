// import React from 'react';
// import OmsDateDropdown from "@modules/dumps/component/oms/OmsDateDropdown.jsx";
// import { useForm } from "react-hook-form";
//
// const OrderSummary = () => {
//     const { control, handleSubmit, errors } = useForm();
//
//     const onSubmit = (data) => {
//         console.log(data);
//     };
//
//     return (
//         <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
//             {/* Header Section with Date Picker and Download Button */}
//             <div className="flex justify-between mb-6 items-center">
//                 {/* Date Picker Section */}
//                 <div className="flex gap-6 items-center">
//                     <OmsDateDropdown control={control} errors={errors} />
//                 </div>
//                 {/* Download Button */}
//                 <div>
//                     <button
//                         onClick={handleSubmit(onSubmit)}  // Attach form submit handler
//                         className="ti-btn ti-btn-primary !mb-0 text-white rounded-lg px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                     >
//                         <i className="ri-download-line mr-2"></i>Download
//                     </button>
//
//                 </div>
//             </div>
//
//             {/* Table Section */}
//             <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
//                 <table className="min-w-full table-auto">
//                 <thead className="bg-gray-100 border-b dark:text-gray-200 dark:bg-bodybg">
//                     <tr className="dark:text-gray-200 dark:bg-bodybg">
//                         <th className="py-3 px-6 text-left font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">File</th>
//                         <th className="py-3 px-6 text-left font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">Report Date</th>
//                         <th className="py-3 px-6 text-left font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">Report Hour</th>
//                         <th className="py-3 px-6 text-left font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">Completion Time</th>
//                         <th className="py-3 px-6 text-left font-medium text-gray-600 dark:text-gray-200 dark:bg-bodybg">Download</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {/* Add your data rows here */}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
// export default OrderSummary;
import React from 'react';
import OmsDateDropdown from "@modules/dumps/component/oms/OmsDateDropdown.jsx";
import { useForm } from "react-hook-form";

const OrderSummary = () => {
    const { control, handleSubmit, errors } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    const files = [
        { name: "oci_inv_record_20250509_1051.xlsx", time: "10 AM", url: "#"},
        { name: "oci_inv_record_20250509_1614.xlsx", time: "04 PM", url: "#"},
        { name: "oci_inv_record_20250509_1214.xlsx", time: "12 PM", url: "#"},
        { name: "oci_inv_record_20250509_1414.xlsx", time: "02 PM", url: "#"}
    ];

    return (
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            {/* Header Section with Date Picker and Download Button */}
            <div className="flex justify-between mb-6 items-center">
                {/* Date Picker Section */}
                <div className="flex gap-6 items-center">
                    <OmsDateDropdown control={control} errors={errors} />
                </div>
                {/* Download Button */}
                <div>
                    <button
                        onClick={handleSubmit(onSubmit)}  // Attach form submit handler
                        className="ti-btn ti-btn-primary !mb-0 text-white rounded-lg px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        <i className="ri-download-line mr-2"></i>Download
                    </button>
                </div>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                    <div key={index} className="bg-white rounded-md border border-gray-200 p-3 flex items-center justify-between shadow-sm dark:text-gray-200 dark:bg-bodybg">
                        <div className="flex items-center space-x-3">
                            {/* File Icon */}
                            <div className="text-sm font-bold text-gray-800 truncate max-w-xs">
                                <i className="ri-file-2-fill text-green-600 text-xl"></i>

                            </div>
                            <p className="text-sm font-bold text-gray-800 truncate max-w-xs">{file.name}</p>
                        </div>
                        <div className="text-lg text-bold text-success">{file.time}</div>
                        <div>
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ti-btn ti-btn-primary !mb-0"
                            >
                                <i className="ri-download-line"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSummary;
