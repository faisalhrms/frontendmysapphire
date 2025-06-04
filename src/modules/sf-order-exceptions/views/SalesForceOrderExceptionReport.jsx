import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import OrderExceptionFilter from "@modules/sf-order-exceptions/components/OrderExceptionFilter.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const SalesForceOrderExceptionReport = () => {
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'date',defaultValue: getPastDate()},
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
            <PageHeader currentpage="Sales Force Order Exceptions" activepage="Sales Force"
                        mainpage="Order Exceptions"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <OrderExceptionFilter control={control} errors={errors}/>
            </form>
                {
                    isLoading ?
                        <LoadingSpinner/>
                        :
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
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.activated}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.created}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.on_hold}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.order_with_exception}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
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
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.allocated}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.cn_exception}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.exception}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.on_hold}</td>
                                                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='xl:col-span-6 col-span-12'>
                                <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                                    <div className='grid grid-cols-12 gap-x-2'>
                                        <div className='xl:col-span-3 col-span-12'>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="text-white bg-[#383853]">
                                                    <th colSpan="2"
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">SO
                                                        Invoiced
                                                    </th>
                                                </tr>
                                                <tr className="text-white bg-[#383853]">
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                                    </th>
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Count
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data?.so_invoicing_failure_summary?.map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='xl:col-span-3 col-span-12'>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="text-white bg-[#383853]">
                                                    <th colSpan="2"
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">SO
                                                        Cancel
                                                    </th>
                                                </tr>
                                                <tr className="text-white bg-[#383853]">
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                                    </th>
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Count
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data?.so_cancellation_failure_summary?.map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='xl:col-span-3 col-span-12'>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="text-white bg-[#383853]">
                                                    <th colSpan="2"
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">RO
                                                        Creation
                                                    </th>
                                                </tr>
                                                <tr className="text-white bg-[#383853]">
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                                    </th>
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Count
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data?.ro_creation_failure_summary?.map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='xl:col-span-3 col-span-12'>
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="text-white bg-[#383853]">
                                                    <th colSpan="2"
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">SO
                                                        Creation
                                                    </th>
                                                </tr>
                                                <tr className="text-white bg-[#383853]">
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Month
                                                    </th>
                                                    <th
                                                        className="bg-blue-300 border border-gray-400 p-2 text-center">Count
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data?.so_creation_failure_summary?.map((row, index) => (
                                                    <tr
                                                        key={index}
                                                        className={row.month === "Grand Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">{row?.month}</td>
                                                        <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">{row?.total}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </>
            );
            };

            export default SalesForceOrderExceptionReport;
