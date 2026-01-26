import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import FailureSummaryTable from "@modules/sf-order-exceptions/components/FailureSummaryTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";

const SalesForceOrderExceptionTable = ({ data, isLoading, isActive = true }) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
       <>
           <ReportSyncTime />
           <div className="grid grid-cols-12 gap-x-4">
               {/* Left Column: Order Summary and Fulfilment Orders */}
               <div className="xl:col-span-6 col-span-12">
                   {/* Order Summary Table */}
                   <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                       <div className="overflow-auto">
                           <table className="w-full border-collapse">
                               <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#383853" }}>
                               <tr className="text-white">
                                   <th colSpan="6" className="bg-blue-300 border border-gray-400 p-2 text-center">
                                       Order Summary
                                   </th>
                               </tr>
                               <tr className="text-white">
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Month</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Created</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Activated</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">On Hold</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Order With
                                       Exception
                                   </th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Grand Total</th>
                               </tr>
                               </thead>
                               <tbody>
                               {data?.order_summary?.map((row, index) => (
                                   <tr
                                       key={index}
                                       className={row.month_year === "Grand Total" ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}
                                   >
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">
                                           {row?.month_year}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.created)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.activated)}
                                       </td>

                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.on_hold)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.order_with_exception)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-danger text-right">
                                           {formatNumberWithCommas(row?.total)}
                                       </td>
                                   </tr>
                               ))}
                               </tbody>
                           </table>
                       </div>
                   </div>

                   {/* Fulfilment Orders Table */}
                   <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                       <div className="overflow-auto">
                           <table className="w-full border-collapse">
                               <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#383853" }}>
                               <tr className="text-white">
                                   <th colSpan="6" className="bg-blue-300 border border-gray-400 p-2 text-center">
                                       Fulfilment Orders
                                   </th>
                               </tr>
                               <tr className="text-white">
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Month</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Allocated</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">CN Exceptions</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Exception</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">On Hold</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Grand Total</th>
                               </tr>
                               </thead>
                               <tbody>
                               {data?.fulfilment_order_summary?.map((row, index) => (
                                   <tr
                                       key={index}
                                       className={row.month === "Grand Total" ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}
                                   >
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">
                                           {row?.month}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.allocated)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.cn_exception)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.exception)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                           {formatNumberWithCommas(row?.on_hold)}
                                       </td>
                                       <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-danger text-right">
                                           {formatNumberWithCommas(row?.total)}
                                       </td>
                                   </tr>
                               ))}
                               </tbody>
                           </table>
                       </div>
                   </div>

                   {/* Whatsapp Summary */}
                   <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                       <div className="overflow-auto">
                           <table className="w-full border-collapse">
                               <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#383853" }}>
                               <tr className="text-white">
                                   <th colSpan="6" className="bg-blue-300 border border-gray-400 p-2 text-center">
                                       WhatsApp Summary
                                   </th>
                               </tr>
                               <tr className="text-white">
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Status</th>
                                   <th className="bg-blue-300 border border-gray-400 p-2 text-center">Count</th>
                               </tr>
                               </thead>
                               <tbody>
                               {data?.whatsapp_summary?.map((row, index) => (
                                   <tr
                                       key={index}
                                   >
                                       <td className={`border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg ${row?.status === 'Error' ? 'text-danger' : 'text-black'}`}>
                                           {row?.status}
                                       </td>
                                       <td className={`border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-right ${row?.status === 'Error' ? 'text-danger' : 'text-black'}`}>
                                           {formatNumberWithCommas(row?.count)}
                                       </td>
                                   </tr>
                               ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               </div>

               {/* Right Column: Failure Summary Tables */}
               <div className="xl:col-span-6 col-span-12">
                   <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                       <div className="grid grid-cols-12 gap-x-2">
                           <div className="xl:col-span-3 col-span-12">
                               <FailureSummaryTable title="SO Creation" data={data?.so_creation_failure_summary} />
                           </div>
                           <div className="xl:col-span-3 col-span-12">
                               <FailureSummaryTable title="SO Invoiced" data={data?.so_invoicing_failure_summary} />
                           </div>
                           <div className="xl:col-span-3 col-span-12">
                               <FailureSummaryTable title="SO Cancel" data={data?.so_cancellation_failure_summary} />
                           </div>
                           <div className="xl:col-span-3 col-span-12">
                               <FailureSummaryTable title="RO Creation" data={data?.ro_creation_failure_summary} />
                           </div>
                       </div>
                       <div className="grid grid-cols-12 gap-x-2 mt-8">
                           <div className="xl:col-span-6 col-span-12">
                               <FailureSummaryTable title="Orders with partial FO" data={data?.order_with_pfo_summary} />
                           </div>
                           <div className="xl:col-span-6 col-span-12">
                               <FailureSummaryTable title="Orders with no FO" data={data?.order_with_no_fo_summary} />
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </>
    );
};

export default SalesForceOrderExceptionTable;