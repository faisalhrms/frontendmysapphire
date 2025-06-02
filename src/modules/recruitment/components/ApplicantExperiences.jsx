const ApplicantExperiences = ({ experiences }) => {
    if (!experiences || experiences.length === 0) {
        return <div className="text-center text-gray-500 py-4">No work experience added</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Years in Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Experience
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {experiences.map((exp, index) => (
                    <tr key={exp.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {exp.company_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {exp.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {exp.years_in_role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {exp.total_experience_years}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantExperiences;