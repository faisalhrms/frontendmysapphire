const ApplicantQualifications = ({ qualifications }) => {
    if (!qualifications || qualifications.length === 0) {
        return <div className="text-center text-gray-500 py-4">No qualifications added</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Years Completed
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {qualifications.map((qual, index) => (
                    <tr key={qual.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {qual.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {qual.institution}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {qual.years_completed}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantQualifications;