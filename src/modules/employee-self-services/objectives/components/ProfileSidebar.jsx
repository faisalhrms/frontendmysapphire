import React from 'react';
import { useSelector } from "react-redux";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";
import Avatar from "@components/Avatar.jsx";
import {Calendar, Target, User} from "lucide-react";

const ProfileSidebar = ({
                            totalObjectives,
                            totalWeightage,
                            coverBg = "bg-success",
                            coverPadding = "p-6"
                        }) => {
    const userData = useSelector((state) => state.auth.user);

    return (
        <div className="xxl:col-span-4 xl:col-span-12 col-span-12 sticky top-0 h-screen overflow-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                    <div className="relative">
                        <div className="absolute inset-0 opacity-5"
                             style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}></div>
                        <div className="relative px-8 py-8">
                            <div className="flex items-start justify-between">
                                {/* Left Section - User Info */}
                                <div className="flex items-start space-x-6">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            {data.user.avatar ? (
                                                <img
                                                    src={data.user.avatar.medium_url}
                                                    alt={data.user.full_name}
                                                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div
                                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                                    style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                                    {data.user.full_name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                            <div
                                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                                <Target className="w-4 h-4 text-blue-600"/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                                Performance Objectives {data.year}
                                            </h1>
                                            <p className="text-slate-600 mt-1">
                                                Annual Key Result Areas & Performance Indicators
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-10 h-10 bg-info/50 rounded-xl flex items-center justify-center">
                                                    <User className="w-5 h-5 text-info"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Employee</p>
                                                    <p className="font-semibold text-slate-900">{data.user.full_name}</p>
                                                    <p className="text-xs text-slate-500">{data.user.emp_code} • {data.user.position}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-emerald-600"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Department</p>
                                                    <p className="font-semibold text-slate-900">{data.user.department}</p>
                                                    <p className="text-xs text-slate-500">{data.user.designation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Status & Actions */}
                                <div className="flex flex-col items-end space-y-4">
                                    {/* Status Badge */}
                                    <div
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${statusConfig.color}`}>
                                        <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`}/>
                                        <span className="font-semibold text-sm">{statusConfig.label}</span>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900">{data.total_weightage}%</div>
                                        <div className="text-sm text-slate-500">Total Weightage</div>
                                    </div>

                                    {/* Current Approver */}
                                    {data.current_approver && (
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Pending Approval</p>
                                            <p className="font-semibold text-sm text-slate-900">{data.current_approver.full_name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
