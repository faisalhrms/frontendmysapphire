import { Link } from "react-router-dom";

const getUiStatus = (r) => {
    if (r?.rejected_at) return "rejected";
    if (r?.approved_at || r?.public_form_url || r?.public_form_slug) return "approved";
    if (r?.submitted_at && r?.current_approver_id) return "under_approval";
    if (r?.submitted_at) return "under_approval";
    return "draft";
};

const RequisitionSummary = ({ requisition }) => {
    const uiStatus = getUiStatus(requisition);

    return (
        <div className="box custom-box">
            <div className="box-header justify-between flex">
                <div className="box-title">Requisition Summary</div>

                {/* Edit button - ONLY if derived status is draft */}
                {uiStatus === "draft" && (
                    <Link
                        to={`/module/requisition/edit/${requisition.id}`}
                        className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
                    >
                        <i className="ri-edit-line align-middle me-1" /> Edit Requisition
                    </Link>
                )}
            </div>

            <div className="box-body">
                <h5 className="font-semibold mb-4">
                    {requisition.job_description?.position_title || "—"}
                </h5>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6">
                        <strong>Requisition No:</strong>
                        <p>{requisition.req_no || "—"}</p>
                    </div>

                    <div className="col-span-6">
                        <strong>Company:</strong>
                        <p>{requisition.company?.name || "—"}</p>
                    </div>

                    <div className="col-span-6">
                        <strong>Designation:</strong>
                        <p>{requisition.designation?.name || "—"}</p>
                    </div>

                    <div className="col-span-6">
                        <strong>Location:</strong>
                        <p>{requisition.location?.name || "—"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequisitionSummary;
