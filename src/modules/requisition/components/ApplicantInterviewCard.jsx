import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

const ApplicantInterviewCard = ({ applicant }) => {
    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Interview & Status</div>
            </div>
            <div className="box-body !p-0">
                <table className="table whitespace-nowrap min-w-full">
                    <tbody>
                    <tr>
                        <td><strong>Status:</strong></td>
                        <td>{toTitleCase((applicant.status || "").replaceAll("_", " "))}</td>
                    </tr>
                    <tr>
                        <td><strong>Rating:</strong></td>
                        <td>{applicant.rating ?? "—"}</td>
                    </tr>
                    <tr>
                        <td><strong>Interview Type:</strong></td>
                        <td>{toTitleCase(applicant.interview_type || "") || "—"}</td>
                    </tr>
                    <tr>
                        <td><strong>Scheduled At:</strong></td>
                        <td>{formatDate(applicant.interview_scheduled_at) || "—"}</td>
                    </tr>
                    <tr>
                        <td><strong>Link/Location:</strong></td>
                        <td>{applicant.interview_link_or_location || "—"}</td>
                    </tr>
                    <tr>
                        <td><strong>Notes:</strong></td>
                        <td>{applicant.internal_notes || "—"}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicantInterviewCard;
