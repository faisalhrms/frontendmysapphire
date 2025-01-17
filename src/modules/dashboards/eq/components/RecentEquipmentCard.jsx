// src/modules/dashboards/equipment/components/RecentEquipmentCard.jsx

import React from "react";
import { getBadgeClasses } from "@helpers/badges.js"; // Define badge styles based on status
import { toTitleCase } from "@helpers/formatters.js";
import Avatar from "@components/Avatar.jsx";
import { formatDate } from "@helpers/dateTime.js";
import Tooltip from "@components/Tooltip.jsx";
import { Link } from "react-router-dom";
import AvatarList from "@components/AvatarList.jsx";

const RecentEquipmentCard = ({ equipments }) => {
    return (
        <div className="xl:col-span-4 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">
                        Recent Equipments
                    </div>
                </div>
                <div className="box-body box max-h-96 overflow-y-auto">
                    <ul className="list-none equipments-maintask-card">
                        {equipments && equipments.length > 0 ? (
                            equipments.map((equipment, index) => (
                                <li key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="me-2 leading-none">
                                                <Avatar
                                                    avatar={equipment.custodian ? equipment.custodian.avatar : null}
                                                    size='md'
                                                    parentClasses='bg-primary/10 !fill-primary'
                                                />
                                            </div>
                                            <div>
                                                <Tooltip
                                                    id={`recent-equipment-tooltip-${equipment.id}`}
                                                    text={`(${equipment.serial_no}) ${equipment.description}`}
                                                    tooltipContent={`Click To View Equipment: ${equipment.serial_no}`}
                                                >
                                                    <Link
                                                        to={`/module/inventory/equipment/detail/${equipment.id}`}
                                                        className="font-semibold text-[.875rem] block text-truncate equipment-list-title mb-0">
                                                        {equipment.description}
                                                    </Link>
                                                </Tooltip>
                                                <span className="text-[#8c9097] dark:text-white/50 opacity-[0.6] inline-block">{equipment.purchase_date ? formatDate(equipment.purchase_date) : 'N/A'}</span>
                                                <AvatarList users={equipment.custodian ? [equipment.custodian] : []} size='xs' />
                                                <p className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{equipment.specs}</p>
                                            </div>
                                        </div>
                                        <div className={getBadgeClasses(equipment.status)}>
                                            {toTitleCase(equipment.status.replace('_', ' '))}
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>No recent equipments available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RecentEquipmentCard;
