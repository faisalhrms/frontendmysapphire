import React from 'react';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "@components/Avatar.jsx";
import { Mail, Building, MapPin, User, Star, Shield } from 'lucide-react';

const LineManagerProfile = ({
                                totalObjectives,
                                totalWeightage,
                                coverBg = "bg-success",
                                coverPadding = "p-6"
                            }) => {
    const userData = useSelector((state) => state.auth.user);

    return (
        <div className="xxl:col-span-4 xl:col-span-12 col-span-12 overflow-auto">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">

                <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/3 rounded-full translate-y-16 -translate-x-16"></div>

                    <div className="absolute top-20 left-20 w-4 h-4 bg-white/15 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-32 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-300"></div>
                </div>

                <div className="relative z-10 p-4">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 relative group">
                            <div className="relative">
                                <Avatar
                                    avatar={userData.avatar}
                                    size="xxl"
                                    parentClasses="w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-100 border-4 border-white/30 shadow-2xl backdrop-blur-sm"
                                    backgroundColor="bg-gradient-to-br from-white to-gray-100"
                                    full_name={userData.full_name || 'N/A'}
                                />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl border-4 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
                                    {userData.full_name}
                                </h1>
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-colors">
                                    {userData.employee.emp_code}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-blue-200" />
                                <p className="text-sm text-white/90">
                                    {userData.employee.position.name}
                                </p>
                            </div>
                            

                            <div className="flex flex-wrap gap-6 text-white/80">
                                <div className="flex items-center gap-3 group/item hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover/item:bg-white/30 transition-colors">
                                        <Building className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm">{userData.employee.company.name}</span>
                                </div>
                                <div className="flex items-center gap-3 group/item hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover/item:bg-white/30 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm">{userData.employee.location.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors group">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                <Mail className="w-4 h-4" />
                            </div>
                            Contact Information
                        </h3>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <Mail className="w-6 h-6 text-white"/>
                            </div>
                            <div className="flex-1">
                                <span className="text-white/90 text-sm">{userData.email}</span>
                                <p className="text-white/60 text-sm">Primary Email</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">
                                    {userData?.objective?.total_weightage}%
                                </div>
                                <div className="text-sm text-white">Total Weightage</div>
                            </div>


                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default LineManagerProfile;
