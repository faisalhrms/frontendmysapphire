import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";

const SourceBasedPerformanceTab = ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    return (
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                MTD
            </p>

            <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6">
                    <table className="w-full border-collapse max-h-[800px]">
                        <thead style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            backgroundColor: "#383853"
                        }}>
                        <tr className="text-white bg-[#383853]">
                            <th className="bg-blue-300 border border-gray-300 p-2 text-center" rowSpan="2">Source/Medium</th>
                            <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">CY</th>
                            <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">LY</th>
                            <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">growth%</th>
                        </tr>
                        <tr className="text-white bg-[#4d5875]">
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Revenue</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Sessions</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Conv%</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Revenue</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Sessions</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Conv%</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Revenue</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Sessions</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Conv%</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((source, sourceIndex) => (
                                    <React.Fragment key={`source-${sourceIndex}`}>
                                    <tr className={`font-bold dark:text-gray-200 dark:bg-bodybg text-black ${source.name === 'Grand Total' ? 'bg-[#949eb7]' : 'bg-warning/10'}`}>
                                            <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black'>{source.name}</td>
                                            <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{source.cy.revenue}</td>
                                            <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{source.cy.session}</td>
                                            <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{source.cy.conv}%</td>
                                            <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{source.ly.revenue}</td>
                                            <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{source.ly.session}</td>
                                            <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{source.ly.conv}%</td>
                                            <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{source.growth.revenue}%</td>
                                            <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{source.growth.session}%</td>
                                            <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{source.growth.conv}%</td>
                                        </tr>
                                        {
                                            source.mediums?.map((medium, mediumIndex) => (
                                                <tr key={`medium-${sourceIndex}-${mediumIndex}`}>
                                                    <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black pl-4'>{medium.name}</td>
                                                    <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{medium.cy.revenue}</td>
                                                    <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{medium.cy.session}</td>
                                                    <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{medium.cy.conv}%</td>
                                                    <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{medium.ly.revenue}</td>
                                                    <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{medium.ly.session}</td>
                                                    <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{medium.ly.conv}%</td>
                                                    <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{medium.growth.revenue}%</td>
                                                    <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{medium.growth.session}%</td>
                                                    <td className='border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black'>{medium.growth.conv}%</td>
                                                </tr>
                                            ))
                                        }
                                    </React.Fragment>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default SourceBasedPerformanceTab