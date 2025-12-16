import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { getBadgeClasses } from "@helpers/badges.js";

const ApplicantSummary = ({ applicant }) => {
    const fullName =
        [applicant.first_name, applicant.last_name].filter(Boolean).join(" ") || "—";

    return (
        <div className="box custom-box">
            <div className="box-header justify-between">
                <div className="box-title">Applicant Summary</div>
                <span className={getBadgeClasses(applicant.status)}>
          {toTitleCase((applicant.status || "").replaceAll("_", " "))}
        </span>
            </div>

            <div className="box-body">
                <div className="flex items-center gap-3 mb-6">
                    <Avatar
                        avatar={null}
                        full_name={fullName}
                        size="lg"
                        parentClasses="bg-primary/10 !fill-primary"
                    />
                    <div>
                        <h5 className="font-semibold mb-1">{fullName}</h5>
                        <div className="text-xs text-gray-500">
                            Applied on {formatDate(applicant.created_at) || "—"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6">
                        <strong>Email:</strong>
                        <p>{applicant.email || "—"}</p>
                    </div>
                    <div className="col-span-6">
                        <strong>Mobile:</strong>
                        <p>{applicant.mobile_number || "—"}</p>
                    </div>
                    <div className="col-span-6">
                        <strong>CNIC:</strong>
                        <p>{applicant.cnic_number || "—"}</p>
                    </div>
                    <div className="col-span-6">
                        <strong>Date of Birth:</strong>
                        <p>{formatDate(applicant.date_of_birth) || "—"}</p>
                    </div>
                    <div className="col-span-6">
                        <strong>City:</strong>
                        <p>{applicant.city || "—"}</p>
                    </div>
                    <div className="col-span-6">
                        <strong>Address:</strong>
                        <p>{applicant.home_address || "—"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantSummary;
