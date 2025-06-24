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

                    >
                    <table className="w-full border-collapse max-h-[600px]">
                        <thead style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            backgroundColor: "#383853"
                        }}>
                        <tr className="text-white">
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Hour</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">
                                New users
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Returning
                                users
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Total
                                users
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Bounce
                                rate
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Add to
                                carts
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Checkouts</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Ecommerce
                                purchases
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Ecommerce
                                revenue
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">User key event rate</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Sessions</th>
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
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.sessions}</td>
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
