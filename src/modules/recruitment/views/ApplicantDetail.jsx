import { Fragment } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useApplicant } from "@modules/recruitment/hooks/recruitmentHooks.js";
import ApplicantSummary from "@modules/recruitment/components/ApplicantSummary.jsx";
import ApplicantPersonalInfo from "@modules/recruitment/components/ApplicantPersonalInfo.jsx";
import ApplicantQualifications from "@modules/recruitment/components/ApplicantQualifications.jsx";
import ApplicantExperiences from "@modules/recruitment/components/ApplicantExperiences.jsx";
import ApplicantReferrals from "@modules/recruitment/components/ApplicantReferrals.jsx";
import ApplicantAttachments from "@modules/recruitment/components/ApplicantAttachments.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";

const ApplicantDetail = () => {
    const { id } = useParams();
    const { applicantData, isLoading } = useApplicant(id);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!applicantData) {
        return <div className="text-center p-10">Applicant not found</div>;
    }

    return (
        <Fragment>
            <PageHeader
                currentpage="Applicant Details"
                title="Applicant Details"
                activepage="Recruitment"
                mainpage="Applicant"
            />

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12">
                    <ApplicantSummary applicantData={applicantData} />

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">Qualifications</div>
                        </div>
                        <div className="box-body">
                            <ApplicantQualifications
                                qualifications={applicantData.qualifications}
                            />
                        </div>
                    </div>

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">Work Experience</div>
                        </div>
                        <div className="box-body">
                            <ApplicantExperiences
                                experiences={applicantData.experiences}
                            />
                        </div>
                    </div>

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">Referrals</div>
                        </div>
                        <div className="box-body">
                            <ApplicantReferrals
                                referrals={applicantData.referrals}
                            />
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-3 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Personal Information</div>
                        </div>
                        <div className="box-body">
                            <ApplicantPersonalInfo
                                applicantData={applicantData}
                            />
                        </div>
                    </div>

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">Recommended Positions</div>
                        </div>
                        <div className="box-body">
                            <div className="flex flex-wrap gap-2">
                                {applicantData.recommended_positions?.map(position => (
                                    <span
                                        key={position.id}
                                        className="badge bg-primary/10 text-primary rounded-full px-3 py-1"
                                    >
                                        {position.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">
                                Attachments
                                <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
                                    {applicantData.attachments?.length || 0}
                                </span>
                            </div>
                        </div>
                        <div className="box-body">
                            <ApplicantAttachments
                                attachments={applicantData.attachments}
                            />
                        </div>
                    </div>

                    <div className="box mt-6">
                        <div className="box-header">
                            <div className="box-title">Application Details</div>
                        </div>
                        <div className="box-body">
                            <ul className="space-y-3">
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium capitalize">
                                        {applicantData.status}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Created At:</span>
                                    <span className="font-medium">
                                        {formatDate(applicantData.created_at)}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Created By Location:</span>
                                    <span className="font-medium">
                                        {applicantData.created_by_location?.name}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Preferred Location:</span>
                                    <span className="font-medium">
                                        {applicantData.preferred_store_location?.name}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ApplicantDetail;