import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import FailureSummaryTable from "@modules/sf-order-exceptions/components/FailureSummaryTable.jsx";
import {formatNumberWithCommas} from "@helpers/formatters.js";
import useSalesforceSyncTime from "@modules/ecom/hooks/useSalesforceSyncTime.js";

const SalesForceOrderExceptionReport = () => {
    const { syncTime, errorMessage } = useSalesforceSyncTime();

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date',defaultValue: getPastDate(0)},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading, refetch } = useFetchWithFilters(
        '/reporting/sf/order-exception/', filters
    );
    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );
    return (
        <>
            <PageHeader currentpage="Salesforce Order Exceptions" activepage="Salesforce"
                        mainpage="Order Exceptions"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OrderExceptionFilter control={control} errors={errors}/>
            </form>
                    <>
                        {syncTime && (
                            <div className="error-message text-primary p-2 rounded-lg text-right text-black ">
                                <p>{syncTime}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="error-message alert alert-primary p-2 rounded-lg shadow-md text-center text-black mb-2">
                                <p>{errorMessage}</p>
                            </div>
                        )}
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                        <div className='grid grid-cols-12 gap-x-4'>
                            <div className='xl:col-span-6 col-span-12'>
                                <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="text-white bg-[#383853]">
                                            <th colSpan="6"
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Order
                                                Summary
                                            </th>
                                        </tr>
                                        <tr className="text-white bg-[#383853]">
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Activated
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Created
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">On Hold
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Order
                                                With Exception
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Grand
                                                Total
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data?.order_summary?.map((row, index) => (
                                            <tr
                                                key={index}
                                                className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.activated)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.created)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.on_hold)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.order_with_exception)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.total)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="text-white bg-[#383853]">
                                            <th colSpan="6"
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Fulfilment
                                                Orders
                                            </th>
                                        </tr>
                                        <tr className="text-white bg-[#383853]">
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Allocated
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">CN
                                                Exceptions
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Exception
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">On Hold
                                            </th>
                                            <th
                                                className="bg-blue-300 border border-gray-400 p-2 text-center">Grand
                                                Total
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data?.fulfilment_order_summary?.map((row, index) => (
                                            <tr
                                                key={index}
                                                className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.allocated)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.cn_exception)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.exception)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.on_hold)}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{formatNumberWithCommas(row?.total)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='xl:col-span-6 col-span-12'>
                                <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                                    <div className='grid grid-cols-12 gap-x-2'>
                                        <FailureSummaryTable title="SO Invoiced" data={data?.so_invoicing_failure_summary}/>
                                        <FailureSummaryTable title="SO Cancel" data={data?.so_cancellation_failure_summary}/>
                                        <FailureSummaryTable title="RO Creation" data={data?.ro_creation_failure_summary}/>
                                        <FailureSummaryTable title="SO Creation" data={data?.so_creation_failure_summary}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </>
        </>
    );
};

export default SalesForceOrderExceptionReport;
