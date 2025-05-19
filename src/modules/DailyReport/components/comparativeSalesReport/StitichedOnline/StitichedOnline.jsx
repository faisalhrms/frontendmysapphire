import { useState } from 'react';

export default function OnlineStitiched() {
    return (
        <div className="w-full overflow-x-auto bg-white" >
            <table className="w-full border-collapse">

                <thead>
                <tr>
                    <th className="bg-green-700 text-white font-medium text-center p-2 border border-gray-300" colSpan={19}>
                        Stitched Women
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-2 font-medium" rowSpan={2}>Full Price</th>
                    <th className="border border-gray-300 p-2 text-center font-medium" colSpan={3}>Eid - 1</th>

                    <th className="border border-gray-300 p-2 text-center font-medium" colSpan={3}>Summer 1</th>
                    <th className="border border-gray-300 p-2 text-center font-medium" colSpan={3}>Intermix</th>
                    <th className="border border-gray-300 p-2 text-center font-medium" colSpan={3}>Others</th>


                    <th className="border border-gray-300 p-2 text-center font-medium" colSpan={3}>Total</th>
                </tr>
                <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-1 text-center">CY</th>
                    <th className="border border-gray-300 p-1 text-center">LY</th>
                    <th className="border border-gray-300 p-1 text-center">Growth%</th>


                    <th className="border border-gray-300 p-1 text-center">CY</th>
                    <th className="border border-gray-300 p-1 text-center">LY</th>
                    <th className="border border-gray-300 p-1 text-center">Growth%</th>


                    <th className="border border-gray-300 p-1 text-center">CY</th>
                    <th className="border border-gray-300 p-1 text-center">LY</th>
                    <th className="border border-gray-300 p-1 text-center">Growth%</th>


                    <th className="border border-gray-300 p-1 text-center">CY</th>
                    <th className="border border-gray-300 p-1 text-center">LY</th>
                    <th className="border border-gray-300 p-1 text-center">Growth%</th>


                    <th className="border border-gray-300 p-1 text-center">CY</th>
                    <th className="border border-gray-300 p-1 text-center">LY</th>
                    <th className="border border-gray-300 p-1 text-center">Growth%</th>
                </tr>

                {/* Row 3 - Dates */}
                <tr className="bg-blue-100 text-xs">
                    <td className="border border-gray-300 p-1"></td>

                    {/* Eid - 1 dates */}
                    <td className="border border-gray-300 p-1 text-center">21-Feb-25</td>
                    <td className="border border-gray-300 p-1 text-center">08-Mar-24</td>
                    <td className="border border-gray-300 p-1"></td>

                    {/* Summer 1 dates */}
                    <td className="border border-gray-300 p-1 text-center">07-Feb-25</td>
                    <td className="border border-gray-300 p-1 text-center">16-Feb-24</td>
                    <td className="border border-gray-300 p-1"></td>

                    {/* Intermix dates */}
                    <td className="border border-gray-300 p-1 text-center">24-Jan-25</td>
                    <td className="border border-gray-300 p-1 text-center">26-Jan-24</td>
                    <td className="border border-gray-300 p-1"></td>

                    {/* Others dates */}
                    <td className="border border-gray-300 p-1"></td>
                    <td className="border border-gray-300 p-1"></td>
                    <td className="border border-gray-300 p-1"></td>

                    {/* Total dates */}
                    <td className="border border-gray-300 p-1"></td>
                    <td className="border border-gray-300 p-1"></td>
                    <td className="border border-gray-300 p-1"></td>
                </tr>


                <tr>
                    <td  className="border border-gray-300 p-1 font-medium">Total</td>


                </tr>

                <tr >
                  
                    <td className="border border-gray-300 p-1 bg-red-100 font-medium text-center">
                        <select className="w-full bg-red-100 text-center font-medium border-none appearance-none">
                            <option value="CY">CY</option>

                        </select>
                    </td>
                    <td className="border border-gray-300 p-1 bg-red-100 font-medium text-center">
                        <select className="w-full bg-red-100 text-center font-medium border-none appearance-none">
                            <option value="LY">LY</option>

                        </select>
                    </td>

                </tr>


                {[1, 2, 3, 4].map((row) => (
                    <tr key={row}>
                        <td className="border border-gray-300 p-2"></td>
                        <td className="border border-gray-300 p-2"></td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}