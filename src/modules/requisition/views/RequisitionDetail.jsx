// src/modules/requisition/views/RequisitionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Building,
    MapPin,
    Calendar,
    Briefcase,
    Users,
    DollarSign,
    Clock,
    CheckCircle2,
    ArrowLeft,
    FileText,
    User,
    ShieldCheck,
    Globe
} from "lucide-react";
import api from "../../../config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Notify from "@helpers/toastNotifications.js";

export default function RequisitionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [req, setReq] = useState(null);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/requisition/${id}/`);
            setReq(res?.data?.data);
        } catch (e) {
            Notify.error("Failed to load requisition details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!req) return <div className="p-10 text-center">Requisition not found.</div>;

    return (
        <div className="min-h-screen bg-bodybg p-4 md:p-8 font-inter text-defaulttextcolor">
            <div className="max-w-xxxl mx-auto">

                {/* Top Navigation & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-textmuted hover:text-primary transition-colors font-medium"
                    >
                        <ArrowLeft size={20} /> Back to List
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border shadow-sm ${
                            req.approved_at ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                        }`}>
                            {req.approved_at ? "Approved" : "Pending Approval"}
                        </span>
                        <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase shadow-sm">
                            {req.req_type}
                        </span>
                    </div>
                </div>

                {/* Main Header Card */}
                <div className="bg-white rounded-xl shadow-defaultshadow border border-defaultborder overflow-hidden mb-8">
                    <div className="h-2 bg-primary" />
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="space-y-2">
                                <span className="text-primary font-bold text-sm tracking-wider uppercase">{req.req_no}</span>
                                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                    {req.job_description?.position_title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-textmuted font-medium">
                                    <div className="flex items-center gap-1.5"><Building size={18} /> {req.company?.name}</div>
                                    <span className="hidden md:block text-gray-300">|</span>
                                    <div className="flex items-center gap-1.5"><MapPin size={18} /> {req.location?.name}</div>
                                    <span className="hidden md:block text-gray-300">|</span>
                                    <div className="flex items-center gap-1.5"><Briefcase size={18} /> {req.employment_type}</div>
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex flex-col gap-3">
                                <Link
                                    to={`/module/requisition/job-description/detail/${req.job_description_id}`}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-primary border-2 border-primary rounded-lg font-bold transition-all shadow-sm"
                                >
                                    <FileText size={18} /> View Full JD
                                </Link>
                                <a
                                    href={req.public_form_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-white rounded-lg font-bold transition-all shadow-md"
                                >
                                    <Globe size={18} /> Public Application
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Core Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Requirements Section */}
                        <div className="bg-white rounded-xl shadow-defaultshadow border border-defaultborder p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-primary" size={24} /> Candidate Requirements
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-textmuted uppercase tracking-widest">Education & Experience</h4>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: req.education_relevant_experience }}
                                    />
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-defaultborder">
                                        <p className="text-xs text-textmuted font-bold uppercase mb-1">Min. Total Experience</p>
                                        <p className="text-lg font-bold text-gray-800">{req.min_total_experience_years} Years</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-textmuted uppercase tracking-widest">Technical Skills</h4>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: req.knowledge_technical_skills }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info / Attributes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-defaultborder shadow-defaultshadow">
                                <h4 className="font-bold text-gray-800 mb-4">Hiring Workflow</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span className="text-textmuted text-sm flex items-center gap-2"><User size={16}/> Hiring Manager</span>
                                        <span className="font-semibold text-sm">{req.hiring_manager?.full_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-textmuted text-sm flex items-center gap-2"><Clock size={16}/> Deadline</span>
                                        <span className="font-semibold text-sm text-danger">{new Date(req.application_deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-defaultborder shadow-defaultshadow">
                                <h4 className="font-bold text-gray-800 mb-4">Channels</h4>
                                <div className="flex flex-wrap gap-2">
                                    {req.channels?.map(channel => (
                                        <span key={channel} className="px-3 py-1 bg-info/10 text-info border border-info/20 rounded text-xs font-bold uppercase">
                                            {channel}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Stats */}
                    <div className="space-y-6">

                        {/* Compensation Box */}
                        <div className="bg-white p-6 rounded-xl shadow-defaultshadow border border-defaultborder overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3">
                                <DollarSign size={40} className="text-primary/5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Budget & Salary</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                                    <p className="text-xs text-textmuted font-bold uppercase mb-1">Target Salary Range</p>
                                    <p className="text-xl font-extrabold text-primary">
                                        {req.target_salary_currency} {req.target_salary_min.toLocaleString()} - {req.target_salary_max.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center px-2 text-sm">
                                    <span className="text-textmuted">Budget Status:</span>
                                    <span className="font-bold text-success capitalize">{req.budget_status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white p-6 rounded-xl shadow-defaultshadow border border-defaultborder">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Position Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-textmuted text-sm">
                                        <Users size={16} /> Openings
                                    </div>
                                    <span className="font-bold text-gray-800">{req.openings} Position(s)</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-textmuted text-sm">
                                        <CheckCircle2 size={16} /> Work Mode
                                    </div>
                                    <span className="font-bold text-gray-800 capitalize">{req.work_mode}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-textmuted text-sm">
                                        <ShieldCheck size={16} /> Designation
                                    </div>
                                    <span className="font-bold text-gray-800">{req.designation?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Audit Info */}
                        <div className="p-4 border-2 border-dashed border-defaultborder rounded-xl">
                            <p className="text-[10px] text-textmuted font-bold uppercase mb-2">Requisition Timeline</p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-textmuted">Created:</span>
                                    <span className="font-medium">{new Date(req.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-textmuted">Submitted:</span>
                                    <span className="font-medium">{new Date(req.submitted_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}