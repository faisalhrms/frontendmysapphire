import { formatDate } from "@helpers/dateTime.js";

const ApplicantSummary = ({ applicantData }) => {
    return (
        <div className="box">
            <div className="box-body">
                <div className="flex items-center">
                    <div className="me-4">
                        <div className="avatar avatar-rounded bg-primary/10 text-primary p-3">
                            <span className="text-xl font-bold">
                                {applicantData.full_name[0]}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-xl font-bold">{applicantData.full_name}</h2>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div>
                                <span className="text-gray-500 me-1">CNIC:</span>
                                <span className="font-medium">{applicantData.cnic}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 me-1">Status:</span>
                                <span className="font-medium capitalize">
                                    {applicantData.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 me-1">Applied:</span>
                                <span className="font-medium">
                                    {formatDate(applicantData.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-auto">
                        <span className="badge bg-primary/10 text-primary rounded-full px-3 py-1">
                            Applicant #{applicantData.id}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="border rounded-lg p-4">
                        <div className="text-gray-500">Email</div>
                        <div className="font-medium mt-1">{applicantData.email}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-gray-500">Mobile</div>
                        <div className="font-medium mt-1">{applicantData.mobile_number}</div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="text-gray-500">Date of Birth</div>
                        <div className="font-medium mt-1">
                            {formatDate(applicantData.date_of_birth)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantSummary;