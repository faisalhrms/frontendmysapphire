import {Link} from "react-router-dom";
import Avatar from "@components/Avatar.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import {calculateEffort, formatDate} from "@helpers/dateTime.js";

const EquipmentSummary = (equipment) => {
    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Equipment Summary</div>
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-2">
                            <Link
                                to={`/module/equipment/edit/${equipment?.id}`}
                                className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                                <i className="ri-edit-line font-semibold align-middle"></i> Edit Equipment
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="box-body">
                    <h5 className="font-semibold mb-4 task-title text-[1.25rem]">
                        {equipment.name}
                    </h5>
                    <div className="text-[.9375rem] font-semibold mb-2">Project Description :</div>
                    <p className="text-[#8c9097] dark:text-white/50 task-description">{equipment?.description}</p>
                </div>
                <div className="box-footer">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Assigned By</span>
                            <div className="flex items-center flex-wrap">
                                <div className="me-2 leading-none">
                                    <Avatar avatar={equipment?.castodian?.avatar}/>
                                </div>
                                <span
                                    className="block text-[.875rem] dark:text-defaulttextcolor/70 font-semibold">  {toTitleCase(equipment?.castodian?.full_name || 'Unknown Custodian')}
    </span>
                            </div>
                        </div>
                        <div>
                            <span
                                className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Assigned Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70">{formatDate(equipment.started_at)}</span>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Due Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70">{formatDate(equipment.ended_at)}</span>
                        </div>
                        <div className="task-details-progress">
                            <span
                                className="block text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1">Progress</span>
                            <div className="flex items-center flex-wrap">
                                <div className="progress progress-xs progress-animate flex-grow me-2"
                                     style={{width: '70%'}}>
                                    <div className="progress-bar bg-primary"></div>
                                </div>
                                <div className="text-[#8c9097] dark:text-white/50 text-[.6875rem]">0%</div>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Efforts</span>
                            <span
                                className="block text-[.875rem]  dark:text-defaulttextcolor/70 font-semibold">{calculateEffort(equipment?.started_at, equipment?.ended_at)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export default EquipmentSummary