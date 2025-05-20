import React from 'react';
import {formatDate} from "@helpers/dateTime.js";
const formatDateWithHijri = (gregorian, hijri) => {
    return (
        <>
            {gregorian || '-'}{" "}
            <span className="text-gray-600 ">({hijri || '-'})</span>
        </>
    );
};
const IslamicDate = ({ data }) => {
    const gregorian = data?.periods?.gregorian;
    const hijri = data?.periods?.hijri;

    return (
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                Amount in Rs.
            </p>

    <div className="p-4 bg-white  mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
        <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="bg-blue-300 border border-gray-400 p-2"></th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Current Period</th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Comparative Period</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold p-2 border border-gray-400">From</td>
                        <td className="border border-gray-400 p-2 text-center">
                            {formatDateWithHijri(
                                formatDate( gregorian?.current?.from_date),
                                hijri?.current?.from_date
                            )}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                            {formatDateWithHijri(
                                formatDate(gregorian?.comparative?.from_date),
                                hijri?.comparative?.from_date
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-gray-400">To</td>
                        <td className="border border-gray-400 p-2 text-center">
                            {formatDateWithHijri(
                                formatDate( gregorian?.current?.to_date),
                                hijri?.current?.to_date
                            )}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                            {formatDateWithHijri(
                                formatDate( gregorian?.comparative?.to_date),
                                hijri?.comparative?.to_date
                            )}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default React.memo(IslamicDate);
