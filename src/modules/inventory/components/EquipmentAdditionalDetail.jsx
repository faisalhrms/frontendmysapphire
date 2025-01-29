import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {Link} from "react-router-dom";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";

const EquipmentAdditionalDetail = ({equipmentData}) => {
    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">
                        Equipment Additional Details
                    </div>
                    <Link aria-label="anchor" className="hs-collapse-toggle inline-flex items-center gap-x-2 "
                          to="#" id="additional-equipment-detail-collapse"
                          data-hs-collapse="#additional-equipment-detail-collapse-heading">
                        <svg className="hs-collapse-open:rotate-180 w-2.5 h-2.5" width="16" height="16"
                             viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </Link>
                </div>
                <div id="additional-equipment-detail-collapse-heading"
                     className="hs-collapse w-full overflow-hidden transition-[height] duration-300"
                     aria-labelledby="additional-equipment-detail-collapse">
                    <div className="box-body !p-0">
                        <div className="table-responsive">
                            <table className="table whitespace-nowrap min-w-full">
                                <tbody>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold"> Equipment Code :</span></td>
                                    <td>{equipmentData.code}</td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold"> Equipment Site :</span></td>
                                    <td>{equipmentData.equipment_site?.name}</td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Status :</span></td>

                                <td > <span className={getBadgeClasses(equipmentData.status)}> { toTitleCase(equipmentStatuses.find(status => status.value === equipmentData.status)?.label ||
                                    "-")}
                                </span></td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Equipment Type :</span></td>
                                    <td>
                                        <span
                                            >{equipmentData.equipment_type?.name}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Location :</span></td>
                                    <td>
                                        <span
                                            className={getBadgeClasses(equipmentData?.priority)}>{toTitleCase(equipmentData?.location?.name)}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Serial No :</span></td>
                                    <td>
                                        <span
                                        >{toTitleCase(equipmentData?.serial_no)}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Part No :</span></td>
                                    <td>
                                        <span
                                        >{toTitleCase(equipmentData?.part_no) || "----"}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-defaultborder">
                                    <td><span className="font-semibold">Asset No :</span></td>
                                    <td>
                                        <span
                                        >{toTitleCase(equipmentData?.asset_code) || "----"}</span>
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

export default EquipmentAdditionalDetail;
