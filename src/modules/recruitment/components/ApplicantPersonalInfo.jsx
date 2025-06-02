const ApplicantPersonalInfo = ({ applicantData }) => {
    return (
        <ul className="space-y-3">
            <li className="flex justify-between">
                <span className="text-gray-500">Father Name:</span>
                <span className="font-medium">{applicantData.father_name}</span>
            </li>
            <li className="flex justify-between">
                <span className="text-gray-500">City:</span>
                <span className="font-medium capitalize">{applicantData.city}</span>
            </li>
            <li className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium text-right max-w-[200px]">
                    {applicantData.home_address}
                </span>
            </li>
            <li className="mt-4 pt-4 border-t">
                <div className="text-gray-500 mb-2">Remarks:</div>
                <p className="font-medium">{applicantData.remarks}</p>
            </li>
        </ul>
    );
};

export default ApplicantPersonalInfo;