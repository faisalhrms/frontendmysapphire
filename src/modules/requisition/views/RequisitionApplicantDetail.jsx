import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useRequisitionApplicant } from "../hooks/requisitionHooks.js";

import ApplicantSummary from "../components/ApplicantSummary.jsx";
import ApplicantQualifications from "../components/ApplicantQualifications.jsx";
import ApplicantExperiences from "../components/ApplicantExperiences.jsx";
import ApplicantProfessionalCard from "../components/ApplicantProfessionalCard.jsx";
import ApplicantInterviewCard from "../components/ApplicantInterviewCard.jsx";
import ApplicantResumeCard from "../components/ApplicantResumeCard.jsx";

const RequisitionApplicantDetail = () => {
    const { requisitionId, applicationId } = useParams();
    const { applicant, loading, error } = useRequisitionApplicant(requisitionId, applicationId);

    if (loading) return <LoadingSpinner />;
    if (error || !applicant) {
        return (
            <div className="box custom-box">
                <div className="box-header"><div className="box-title">Applicant Details</div></div>
                <div className="box-body">
                    <p className="text-danger">{error || "Unable to load applicant."}</p>
                </div>
            </div>
        );
    }

    const req = applicant.requisition;

    return (
        <Fragment>
            <PageHeader
                currentpage="Applicant Details"
                title="Applicant Details"
                activepage="Requisitions"
                mainpage="Applicants"
            />

            {/* Top context (requisition) */}
            {req?.id && (
                <div className="box mb-6">
                    <div className="box-body flex flex-wrap gap-4 justify-between items-center">
                        <div>
                            <div className="text-xs text-gray-500">Requisition</div>
                            <div className="font-semibold">
                                {req?.req_no} — {req?.title}
                                {req?.company ? <span className="text-gray-500"> • {req.company}</span> : null}
                            </div>
                        </div>
                        <Link
                            to={`/module/requisition/detail/${req.id}`}
                            className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
                        >
                            <i className="ri-eye-line align-middle me-1" /> View Requisition
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 pb-5 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 space-y-6">
                    <ApplicantSummary applicant={applicant} />
                    <ApplicantQualifications items={applicant.qualifications || []} />
                    <ApplicantExperiences items={applicant.experiences || []} />
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 pb-5 space-y-6">
                    <ApplicantProfessionalCard applicant={applicant} />
                    <ApplicantInterviewCard applicant={applicant} />
                    <ApplicantResumeCard applicant={applicant} />
                </div>
            </div>
        </Fragment>
    );
};

export default RequisitionApplicantDetail;
