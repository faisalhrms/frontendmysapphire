import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";

const HourTrafficRate = ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <>
            <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6 overflow-auto"
                     // style={{ maxHeight: '800px' }}
                    >
                    <table className="w-full border-collapse">
                        <thead style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            backgroundColor: "#383853"
                        }}>
                        <tr className="text-white">
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Hour</th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">
                                <div className="flex items-center">
                                    <span className="mr-1"></span>
                                    New users
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Returning
                                users
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Total
                                users
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Bounce
                                rate
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Add to
                                carts
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Checkouts</th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Ecommerce
                                purchases
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium border-r border-gray-300">Ecommerce
                                revenue
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">User key event rate</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && data.length > 0 &&
                            data?.map((item, sourceIndex) => (
                                <React.Fragment key={`source-${sourceIndex}`}>
                                    <tr className={`dark:text-gray-200 dark:bg-bodybg text-black ${item.hour === 'Total' ? 'bg-[#949eb7] font-bold' : ''}`}>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black'>{item.hour}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.new_users}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.returning_users}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.total_users}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.bounce_rate}%</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.add_to_carts}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.checkouts}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.ecommerce_purchases}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.gross_purchase_revenue}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.engagement_rate}%</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default HourTrafficRate;
