import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";

const Item = ({data, isLoading, title = 'Week'}) => {
    return (
        <div className="xl:col-span-6 col-span-12">
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="box">
                    <div className="box-header justify-between">
                        <div className="box-title">
                            {title}
                        </div>
                    </div>
                    <div className="box-body !p-0">
                        <div className="p-2">
                            <ApexChart
                                columnWidth="50%"
                                chartWidth={530}
                                additionalOptions={{
                                    legend: { position: 'top' },
                                    dataLabels: {
                                        enabled: true,
                                        formatter: function (val) {
                                            return val > 0.1 ? `${val.toLocaleString()}` : '';
                                        },
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#000']
                                        },
                                    },
                                    plotOptions: {
                                        bar: {
                                            dataLabels: {
                                                position: 'top',
                                                hideOverflowingLabels: false
                                            },
                                            minHeight: 20
                                        }
                                    },
                                    chart: {
                                        toolbar: {
                                            show: true,
                                        }
                                    }
                                }}
                                labels={data.chart.categories}
                                height={330}
                                series={data.chart.series}
                                baseWidthPerCategory={2}
                            />

                            <table className="min-w-full table-auto border-collapse border border-gray-400">
                                <thead style={{
                                    backgroundColor: "#383853",
                                    color: "white",
                                    fontSize: "10px"
                                }}>
                                <tr>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Duration
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Sessions
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Add
                                        to Cart
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Checkouts
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Converted
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        colSpan="2">Abandonment %
                                    </th>
                                    <th className="bg-blue-300 border border-gray-400 p-1 text-center"
                                        rowSpan="2">Conv%
                                    </th>
                                </tr>
                                <tr>
                                    <th className="bg-blue-300 border border-gray-400 p-2 text-center">Cart</th>
                                    <th className="bg-blue-300 border border-gray-400 p-2 text-center">Checkout</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className='border border-gray-400 p-1 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.duration}</td>
                                    <td className='border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.session_start}</td>
                                    <td className='border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.add_to_carts}</td>
                                    <td className='border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.begin_checkout}</td>
                                    <td className='border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.purchase}</td>
                                    <td className='border border-gray-300 p-1 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.abandonment?.cart}</td>
                                    <td className='border border-gray-300 p-1 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.abandonment?.checkout}</td>
                                    <td className='border border-gray-300 p-1 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{data?.details?.abandonment?.conv}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="box-footer !p-0">
                        <div className="grid grid-cols-12 justify-center">
                            {data?.details?.meta_data.map((item, index) => {
                                return (
                                    <>
                                        <div className="col-span-3 pe-0 text-center" key={index}>
                                            <div className="sm:p-4 p-2">
                                                <span
                                                    className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{item.category}</span>
                                                <span className="block text-[1rem] font-semibold">{item.total}</span>
                                                <span className="block text-[1rem] font-semibold text-primary">
                                                    {item.abandonment}
                                                </span>
                                                <span className="block text-warning">
                                                    {item.reverse_abandonment}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
const UserJourneyTab = ({data, isLoading, isActive, filters}) => {
    if (!isActive) {
        return null
    }
    const {
        data: monthlyData,
        isLoading: monthlyDataLoading
    } = useFetchWithFilters('/ecom/weekly-report/user-journey/monthly/', filters);
    return (
        <>
            <div className="grid grid-cols-12 gap-x-6 mt-4">
                <Item data={data} isLoading={isLoading}/>
                <Item data={monthlyData} isLoading={monthlyDataLoading} title='Month to date'/>
            </div>
        </>
    )
}
export default UserJourneyTab