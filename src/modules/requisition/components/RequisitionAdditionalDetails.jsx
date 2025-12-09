import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

const RequisitionAdditionalDetails = ({ requisition }) => {
    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">Additional Details</div>
            </div>

            <div className="box-body !p-0">
                <div className="table-responsive">
                    <table className="table whitespace-nowrap min-w-full">
                        <tbody>
                        <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                                    <span className={getBadgeClasses(requisition.status)}>
                                        {toTitleCase(requisition.status.replaceAll("_", " "))}
                                    </span>
                            </td>
                        </tr>

                        <tr>
                            <td><strong>Type:</strong></td>
                            <td>{toTitleCase(requisition.req_type)}</td>
                        </tr>

                        <tr>
                            <td><strong>Employment Type:</strong></td>
                            <td>{toTitleCase(requisition.employment_type)}</td>
                        </tr>

                        <tr>
                            <td><strong>Work Mode:</strong></td>
                            <td>{toTitleCase(requisition.work_mode)}</td>
                        </tr>

                        <tr>
                            <td><strong>Openings:</strong></td>
                            <td>{requisition.openings}</td>
                        </tr>

                        <tr>
                            <td><strong>Application Deadline:</strong></td>
                            <td>{formatDate(requisition.application_deadline) || "—"}</td>
                        </tr>

                        <tr>
                            <td><strong>Channels:</strong></td>
                            <td>{requisition.channels?.join(", ") || "—"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequisitionAdditionalDetails;
