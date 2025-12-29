const ApplicantProfessionalCard = ({ applicant }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Professional</div>
            </div>

            <div className="box-body !p-0">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr>
                        <td><strong>Current Title:</strong></td>
                        <td>{applicant.current_job_title || "—"}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Experience:</strong></td>
                        <td>
                            {(applicant.total_experience_years ?? applicant.total_experience_years === 0)
                                ? `${applicant.total_experience_years} yrs`
                                : "—"}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Expected Salary:</strong></td>
                        <td>
                            {(applicant.expected_salary ?? applicant.expected_salary === 0)
                                ? applicant.expected_salary
                                : "—"}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Notice Period:</strong></td>
                        <td>
                            {(applicant.notice_period_days ?? applicant.notice_period_days === 0)
                                ? `${applicant.notice_period_days} days`
                                : "—"}
                        </td>
                    </tr>

                    {/* ✅ NEW: Audit fields */}
                    <tr>
                        <td><strong>IP Address:</strong></td>
                        <td className="truncate max-w-[180px]" title={applicant.ip_address || ""}>
                            {applicant.ip_address || "—"}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>User Agent:</strong></td>
                        <td className="truncate max-w-[180px]" title={applicant.user_agent || ""}>
                            {applicant.user_agent || "—"}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicantProfessionalCard;
