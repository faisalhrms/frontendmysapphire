import React, {useCallback, useMemo, useState} from "react";
import useFilters from "@hooks/useFilters.js";
import {getPastDate, getPastDateTime} from "@helpers/dateTime.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

import useSalesforceSyncTime from "@modules/ecom/hooks/useSalesforceSyncTime.js";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";

import IconTabs from "@components/IconTabs.jsx";
import SalesForceOrderStatusTable from "@modules/sf-order-exceptions/components/SalesForceOrderStatusTable.jsx";
import HourlyOrderReport from "@modules/sf-order-exceptions/components/HourlyOrderReport.jsx";

const SalesForceOrderStatusReport = () => {
    const [activeTab, setActiveTab] = useState("fo_status_summary");

    const {startOfToday, now} = getPastDateTime()
    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'from_dt',defaultValue: startOfToday},
                    { name: 'to_dt',defaultValue: now},
                    { name: 'date',defaultValue: getPastDate(0)},
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const { data, isLoading, refetch } = useFetchWithFilters(
        activeTab === "fo_status_summary" ? '/reporting/sf/order-status/' :
            activeTab === "hourly_order_report" ? '/reporting/sf/order-status/hourly/' :
                '', filters
    );
    const onSubmit = useCallback(
        (formData) => {
            setFilters(formData);
        },
        []
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <PageHeader currentpage="Salesforce Order Status" activepage="Salesforce" mainpage="Order Order Status"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="box custom-box">
                            <div className="box-body p-4">
                                <div className="flex items-center justify-between gap-4">
                                    {
                                        activeTab === "fo_status_summary" ?
                                            <>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <FormInput
                                                        type="datetime-local"
                                                        name="from_dt"
                                                        control={control}
                                                        errors={errors}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <FormInput
                                                        type="datetime-local"
                                                        name="to_dt"
                                                        control={control}
                                                        errors={errors}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="flex items-center gap-4 flex-1">
                                                    <FormInput
                                                        type="date"
                                                        name="date"
                                                        control={control}
                                                        errors={errors}
                                                    />
                                                </div>
                                            </>
                                    }
                                    <FilterButton/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <>

                <IconTabs
                    tabs={[
                        {
                            id: "fo_status_summary",
                            label: "FO Status Summary",
                            icon: <i className="bi bi-graph-up"></i>,
                            content: (
                                <SalesForceOrderStatusTable data={data}
                                                            isLoading={isLoading}
                                                            isActive={'fo_status_summary' === activeTab}/>
                            ),
                        },
                        {
                            id: "hourly_order_report",
                            label: "Hourly Order Summary",
                            icon: <i className="bi bi-clock-history"></i>,
                            content: (
                                <HourlyOrderReport data={data}
                                                   isLoading={isLoading}
                                                   isActive={'hourly_order_report' === activeTab}/>
                            ),
                        },
                    ]}
                    onTabChange={handleTabChange}
                />
                {/*<div className='grid grid-cols-12 gap-x-4'>*/}
                {/*    <div className='xl:col-span-8 col-span-12'>*/}
                {/*        <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">*/}
                {/*            <table className="w-full border-collapse">*/}
                {/*                <thead>*/}
                {/*                <tr className="text-white bg-[#383853]">*/}
                {/*                    <th colSpan="6"*/}
                {/*                        className="bg-blue-300 border border-gray-400 p-2 text-center">FO*/}
                {/*                        Status Summary*/}
                {/*                    </th>*/}
                {/*                </tr>*/}
                {/*                <tr className="text-white bg-[#383853]">*/}
                {/*                    <th*/}
                {/*                        className="bg-blue-300 border border-gray-400 p-2 text-center">Status*/}
                {/*                    </th>*/}
                {/*                    <th*/}
                {/*                        className="bg-blue-300 border border-gray-400 p-2 text-center">FO Count*/}
                {/*                    </th>*/}
                {/*                    <th*/}
                {/*                        className="bg-blue-300 border border-gray-400 p-2 text-center">Quantity*/}
                {/*                    </th>*/}
                {/*                    <th*/}
                {/*                        className="bg-blue-300 border border-gray-400 p-2 text-center">Amount*/}
                {/*                    </th>*/}
                {/*                </tr>*/}
                {/*                </thead>*/}
                {/*                <tbody>*/}
                {/*                {isLoading ? (*/}
                {/*                    <tr>*/}
                {/*                        <td colSpan="4" className="text-center py-4"><LoadingSpinner/></td>*/}
                {/*                    </tr>*/}
                {/*                ) : (*/}
                {/*                    data?.order_status_summary?.map((row, index) => (*/}
                {/*                        <tr*/}
                {/*                            key={index}*/}
                {/*                            className={*/}
                {/*                                row.status === "Grand Total"*/}
                {/*                                    ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black"*/}
                {/*                                    : ""*/}
                {/*                            }*/}
                {/*                        >*/}
                {/*                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">*/}
                {/*                                {row?.status}*/}
                {/*                            </td>*/}
                {/*                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*/}
                {/*                                {formatNumberWithCommas(row?.orders)}*/}
                {/*                            </td>*/}
                {/*                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*/}
                {/*                                {formatNumberWithCommas(row?.qty)}*/}
                {/*                            </td>*/}
                {/*                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*/}
                {/*                                {formatNumberWithCommas(row?.amount)}*/}
                {/*                            </td>*/}
                {/*                        </tr>*/}
                {/*                    ))*/}
                {/*                )}*/}

                {/*                </tbody>*/}
                {/*            </table>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    /!*<div className='xl:col-span-4 col-span-12'>*!/*/}
                {/*    /!*    <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">*!/*/}
                {/*    /!*        <table className="w-full border-collapse">*!/*/}
                {/*    /!*            <thead>*!/*/}
                {/*    /!*            <tr className="text-white bg-[#383853]">*!/*/}
                {/*    /!*                <th colSpan="6"*!/*/}
                {/*    /!*                    className="bg-blue-300 border border-gray-400 p-2 text-center">Order Summary Recon*!/*/}
                {/*    /!*                </th>*!/*/}
                {/*    /!*            </tr>*!/*/}
                {/*    /!*            </thead>*!/*/}
                {/*    /!*            <tbody>*!/*/}
                {/*    /!*            {isLoading ? (*!/*/}
                {/*    /!*                <tr>*!/*/}
                {/*    /!*                    <td colSpan="4" className="text-center py-4"><LoadingSpinner/></td>*!/*/}
                {/*    /!*                </tr>*!/*/}
                {/*    /!*            ) : (*!/*/}
                {/*    /!*                data?.order_status_summary?.map((row, index) => (*!/*/}
                {/*    /!*                    <tr*!/*/}
                {/*    /!*                        key={index}*!/*/}
                {/*    /!*                        className={*!/*/}
                {/*    /!*                            row.status === "Grand Total"*!/*/}
                {/*    /!*                                ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black"*!/*/}
                {/*    /!*                                : ""*!/*/}
                {/*    /!*                        }*!/*/}
                {/*    /!*                    >*!/*/}
                {/*    /!*                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">*!/*/}
                {/*    /!*                            {row?.status}*!/*/}
                {/*    /!*                        </td>*!/*/}
                {/*    /!*                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*!/*/}
                {/*    /!*                            {formatNumberWithCommas(row?.orders)}*!/*/}
                {/*    /!*                        </td>*!/*/}
                {/*    /!*                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*!/*/}
                {/*    /!*                            {formatNumberWithCommas(row?.qty)}*!/*/}
                {/*    /!*                        </td>*!/*/}
                {/*    /!*                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">*!/*/}
                {/*    /!*                            {formatNumberWithCommas(row?.amount)}*!/*/}
                {/*    /!*                        </td>*!/*/}
                {/*    /!*                    </tr>*!/*/}
                {/*    /!*                ))*!/*/}
                {/*    /!*            )}*!/*/}

                {/*    /!*            </tbody>*!/*/}
                {/*    /!*        </table>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</div>*/}

            </>
        </>
    );
};

export default SalesForceOrderStatusReport;
