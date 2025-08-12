import React from 'react';
import { useSelector } from "react-redux";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";
import Avatar from "@components/Avatar.jsx";

const ProfileSidebar = ({
                            coverBg = "bg-success",
                            coverPadding = "p-6"
                        }) => {
    const userData = useSelector((state) => state.auth.user);

    return (
        <div className="xxl:col-span-4 xl:col-span-12 col-span-12 sticky top-0 h-screen overflow-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-body !p-0">

                            <div  className={`flex items-start gap-4 ${coverPadding} `}    style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                <div className="flex-shrink-0">
                                    <Avatar
                                        avatar={userData.avatar}
                                        size="xxl"
                                        parentClasses="me-4 p-1"
                                        backgroundColor="bg-primary border"
                                        full_name={userData.full_name || 'N/A'}
                                    />
                                </div>

                                <div className="flex-grow main-profile-info">
                                    <div className="flex items-center justify-between">
                                        <h6 className="font-semibold mb-1 text-white text-[1rem]">
                                            {userData.full_name} ({userData.employee.emp_code})
                                        </h6>
                                    </div>
                                    <p className="mb-1 text-white opacity-70">
                                        {userData.employee.position.name}
                                    </p>
                                    <p className="text-[0.75rem] text-white mb-6 opacity-50">
                                        <span className="me-4 inline-flex">
                                            <i className="ri-building-line me-1 align-middle"></i>
                                            {userData.employee.company.name}
                                        </span>
                                        <span className="inline-flex">
                                            <i className="ri-map-pin-line me-1 align-middle"></i>
                                            {userData.employee.location.name}
                                        </span>
                                    </p>
                                    <div className="flex mb-0">
                                        <div className="me-6">
                                            <p className="font-bold text-[1rem] text-white text-shadow mb-0">
                                                {formatDate(userData.employee.service_started_at)}
                                            </p>
                                            <p className="mb-0 text-[.6875rem] opacity-50 text-white">
                                                Service started date
                                            </p>
                                        </div>
                                        <div className="me-6">
                                            <p className="font-bold text-[1rem] text-white text-shadow mb-0">
                                                {userData.is_active ? "Active" : "Not Active"}
                                            </p>
                                            <p className="mb-0 text-[.6875rem] opacity-50 text-white">
                                                Service status
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                <p className="text-[.9375rem] mb-2 font-semibold">Contact Information :</p>
                                <div className="text-[#8c9097] dark:text-white/50">
                                    <p className="mb-2 flex items-center">
                                        <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-mail-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.email}
                                    </p>
                                    <p className="mb-2 flex items-center">
                                        <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-phone-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.employee.phone}
                                    </p>
                                    <p className="mb-2 flex items-center">
                                        <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-map-pin-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.employee.city?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Line Manager Info */}
                            {userData?.line_manager && (
                                <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                    <p className="text-[.9375rem] mb-2 font-semibold">Line Manager :</p>
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            <div className="flex items-start gap-3">
                                                {/* Manager Avatar Left */}
                                                <div className="flex-shrink-0">
                                                    <Avatar avatar={userData?.line_manager?.avatar} />
                                                </div>
                                                {/* Manager Info Right */}
                                                <div className="flex-grow font-semibold">
                                                    <p className="mb-0 leading-none">
                                                        {userData?.line_manager?.full_name}
                                                    </p>
                                                    <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50 opacity-70">
                                                        {userData?.line_manager?.email}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/module/users/edit/${userData?.line_manager?.id}`}
                                                    className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Other Information */}
                            <div className="p-6">
                                <p className="text-[.9375rem] mb-2 font-semibold">Other Information :</p>
                                <ul className="list-group">
                                    <li className="list-group-item flex flex-wrap items-center">
                                        <div className="me-2 font-semibold">Emp code :</div>
                                        <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                            {userData.employee.emp_code}
                                        </span>
                                    </li>
                                    <li className="list-group-item flex flex-wrap items-center">
                                        <div className="me-2 font-semibold">Father name :</div>
                                        <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                            {userData.employee.father_name}
                                        </span>
                                    </li>
                                    <li className="list-group-item flex flex-wrap items-center">
                                        <div className="me-2 font-semibold">Gender :</div>
                                        <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                            {userData.employee.gender === "M" ? "Male" : "Female"}
                                        </span>
                                    </li>
                                    <li className="list-group-item flex flex-wrap items-center">
                                        <div className="me-2 font-semibold">Department :</div>
                                        <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                            {userData?.employee.department.name}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
