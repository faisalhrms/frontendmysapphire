import {Link} from "react-router-dom";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";

const EquipmentSummary = ({id,equipmentData}) => {
    return (
        <>
            <div className="box custom-box">
                <div className="box-header justify-between flex">
                    <div className="box-title">Equipment Details</div>
                    <div>
                        <Link
                            to={`/module/equipment/edit/${id}`}

                            className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary  btn-wave"
                        >
                            <i className="ri-edit-line align-middle me-1 font-semibold"></i>Edit Equipment
                        </Link>


                    </div>
                    <div>
                        <Link
                            to={`/module/Equipment/reassign/${id}`}

                            className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary  btn-wave"
                        >
                            <i className="ri-refresh-line align-middle me-1 font-semibold"></i>Re Assign Equipment
                        </Link>


                    </div>
                </div>
                <div className="box-body">
                    <h5 className="font-semibold mb-4 task-title">Custodian: {equipmentData.custodian.full_name}</h5>
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-6 col-span-12">
                            <div className="text-[.9375rem] font-semibold mb-2">Description:</div>
                            <p className="text-[#8c9097] dark:text-white/50 task-description">{equipmentData.description}</p>

                        </div>
                        <div className="xl:col-span-6 col-span-12">
                            <div className="text-[.9375rem] font-semibold mb-2">Specification:</div>
                            <p className="text-[#8c9097] dark:text-white/50 task-description">{equipmentData.specs}</p>

                        </div>

                    </div>
                </div>
                <div className="box-footer">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Status</span>
                            <span className="block text-[.875rem] font-semibold">
                                {toTitleCase(equipmentData.department.name)}

                            </span>
                        </div>
                        <div>
                                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        Equipment Purchase Date
                                    </span>
                            <span
                                className="block text-[.875rem] font-semibold">{formatDate(equipmentData.purchase_date)|| "-"}</span>
                        </div>
                        <div>
                                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        Equipment HandOver Date
                                    </span>
                            <span
                                className="block text-[.875rem] font-semibold">{formatDate(equipmentData.handover_date)|| "-"}</span>
                        </div>
                        <div>
                                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        Equipment Maturity Date
                                    </span>
                            <span
                                className="block text-[.875rem] font-semibold">{formatDate(equipmentData.maturity_date)|| "-"}</span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default EquipmentSummary