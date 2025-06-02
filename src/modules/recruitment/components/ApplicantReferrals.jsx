const ApplicantReferrals = ({ referrals }) => {
    if (!referrals || referrals.length === 0) {
        return <div className="text-center text-gray-500 py-4">No referrals added</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Store Location
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((ref, index) => (
                    <tr key={ref.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {ref.referrer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {ref.referrer_designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {ref.referrer_store_location?.name || "N/A"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantReferrals;