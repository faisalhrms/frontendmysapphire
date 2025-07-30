import { getBadgeClasses } from "@helpers/badges.js";
import { toTitleCase, formatAmountWithCommas } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";

const EquipmentOtherDetails = ({ equipmentData }) => {
    return (
        <>
    <div className="box">
        <div className="box-header justify-between">
            <div className="box-title">More Asset Details</div>
            <Link
                aria-label="toggle"
                className="hs-collapse-toggle inline-flex items-center gap-x-2"
                to="#"
                id="other-equipment-detail-collapse"
                data-hs-collapse="#other-equipment-detail-collapse-body"
            >
                <svg
                    className="hs-collapse-open:rotate-180 w-2.5 h-2.5"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </Link>
        </div>

        <div
            id="other-equipment-detail-collapse-body"
            className="hs-collapse w-full overflow-hidden transition-[height] duration-300"
            aria-labelledby="other-equipment-detail-collapse"
        >
            <div className="box-body !p-0">
                <div className="table-responsive">
                    <table className="table whitespace-nowrap min-w-full">
                        <tbody>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Previous Custodian:</span></td>
                            <td>{equipmentData.previous_custodian || "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Exception Approved By:</span></td>
                            <td>
                                {equipmentData.exception_approval_granted_by
                                    ? equipmentData.exception_approval_granted_by.full_name
                                    : "—"}
                            </td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Verified:</span></td>
                            <td>
                 <span
                     className={`badge ${
                         equipmentData.verified
                             ? "bg-green/10 text-success"
                             : "bg-danger/10 text-danger"
                     }`}
                 >
  {equipmentData.verified ? "Yes" : "No"}
</span>

                            </td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Antivirus Installed:</span></td>
                            <td>
                  <span className={getBadgeClasses(equipmentData.antivirus.toString())}>
                    {equipmentData.antivirus ? "Yes" : "No"}
                  </span>
                            </td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Store‑Comm Ready:</span></td>
                            <td>
                  <span className={getBadgeClasses(equipmentData.store_comm_ready.toString())}>
                    {equipmentData.store_comm_ready ? "Yes" : "No"}
                  </span>
                            </td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Warranty Expires:</span></td>
                            <td>{formatDate(equipmentData.warranty_expire) || "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Remarks:</span></td>
                            <td>{equipmentData.remarks || "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Maintenance History:</span></td>
                            <td>{equipmentData.maintenance_history || "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Laptop Model:</span></td>
                            <td>{equipmentData.laptop_model || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Processor:</span></td>
                            <td>{equipmentData.processor || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">RAM:</span></td>
                            <td>{equipmentData.ram || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Hard Disk:</span></td>
                            <td>{equipmentData.hard_disk || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Screen Size:</span></td>
                            <td>{equipmentData.screen_size || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Mouse:</span></td>
                            <td>{equipmentData.mouse || "—"}</td>
                        </tr>
                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Accessories:</span></td>
                            <td>{equipmentData.accessories || "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Quantity:</span></td>
                            <td>{equipmentData.quantity ?? "—"}</td>
                        </tr>

                        <tr className="border-b border-defaultborder">
                            <td><span className="font-semibold">Paid by Employee:</span></td>
                            <td>
                                {equipmentData.price_paid_by_employee != null
                                    ? formatAmountWithCommas(equipmentData.price_paid_by_employee)
                                    : "—"}
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};


export default EquipmentOtherDetails;
