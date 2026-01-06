const ApplicantResumeCard = ({ applicant }) => {
    const hasResume = !!applicant.resume_file_url;
    const hasPortfolio = !!applicant.portfolio_url;

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Resume & Links</div>
            </div>

            <div className="box-body !p-0">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr>
                        <td><strong>Resume:</strong></td>
                        <td>
                            {hasResume ? (
                                <a
                                    href={applicant.resume_file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    View Resume
                                </a>
                            ) : (
                                "—"
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Portfolio:</strong></td>
                        <td>
                            {hasPortfolio ? (
                                <a
                                    href={applicant.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    Open Link
                                </a>
                            ) : (
                                "—"
                            )}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicantResumeCard;
