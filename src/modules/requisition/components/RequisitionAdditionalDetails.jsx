import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";

const getUiStatus = (r) => {
    if (r?.rejected_at) return "rejected";
    if (r?.approved_at || r?.public_form_url || r?.public_form_slug) return "approved";
    if (r?.submitted_at && r?.current_approver_id) return "under_approval";
    if (r?.submitted_at) return "under_approval";
    return "draft";
};

const money = (n) => {
    if (n === null || n === undefined || n === "") return "—";
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return num.toLocaleString();
};

const RequisitionAdditionalDetails = ({ requisition }) => {
    const uiStatus = getUiStatus(requisition);

    const salary =
        requisition.target_salary_min || requisition.target_salary_max
            ? `${requisition.target_salary_currency || ""} ${money(
                requisition.target_salary_min
            )} - ${money(requisition.target_salary_max)}`
            : "—";

    const currentApprover =
        requisition.current_approver?.full_name ||
        requisition.current_approver?.email ||
        (requisition.current_approver_id ? `#${requisition.current_approver_id}` : "—");

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
                            <td>
                                <strong>Approval:</strong>
                            </td>
                            <td>
                  <span className={getBadgeClasses(uiStatus)}>
                    {toTitleCase(uiStatus.replaceAll("_", " "))}
                  </span>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Current Approver:</strong>
                            </td>
                            <td>{currentApprover}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Type:</strong>
                            </td>
                            <td>{toTitleCase(requisition.req_type || "—")}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Employment Type:</strong>
                            </td>
                            <td>{toTitleCase(requisition.employment_type || "—")}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Work Mode:</strong>
                            </td>
                            <td>{toTitleCase(requisition.work_mode || "—")}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Openings:</strong>
                            </td>
                            <td>{requisition.openings ?? "—"}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Budget Status:</strong>
                            </td>
                            <td>{toTitleCase(requisition.budget_status || "—")}</td>
                        </tr>

                        {requisition.budget_status === "unbudgeted" && (
                            <tr>
                                <td>
                                    <strong>Unbudgeted Reason:</strong>
                                </td>
                                <td>{requisition.unbudgeted_reason || "—"}</td>
                            </tr>
                        )}

                        <tr>
                            <td>
                                <strong>Salary Range:</strong>
                            </td>
                            <td>{salary}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Application Deadline:</strong>
                            </td>
                            <td>{requisition.application_deadline || "—"}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Channels:</strong>
                            </td>
                            <td>{requisition.channels?.join(", ") || "—"}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Submitted At:</strong>
                            </td>
                            <td>{requisition.submitted_at ? formatDate(requisition.submitted_at) : "—"}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Approved At:</strong>
                            </td>
                            <td>{requisition.approved_at ? formatDate(requisition.approved_at) : "—"}</td>
                        </tr>

                        <tr>
                            <td>
                                <strong>Rejected At:</strong>
                            </td>
                            <td>{requisition.rejected_at ? formatDate(requisition.rejected_at) : "—"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RequisitionAdditionalDetails;
