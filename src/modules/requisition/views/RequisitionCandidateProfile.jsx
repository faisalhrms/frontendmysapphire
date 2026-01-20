// src/modules/requisition/views/CandidateProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../../config/axiosConfig.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Notify from "@helpers/toastNotifications.js";

import {
    Briefcase,
    MapPin,
    Mail,
    Phone,
    FileText,
    Linkedin,
    User,
    Calendar,
    Clock,
    TrendingUp,
    Star,
    Building,
    ExternalLink,
    History,
} from "lucide-react";

const getStatusStyles = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
        case "interviewed":
            return "bg-purple/10 text-purple border-purple/20";
        case "submitted":
            return "bg-info/10 text-info border-info/20";
        case "rejected":
            return "bg-danger/10 text-danger border-danger/20";
        case "hired":
            return "bg-success/10 text-success border-success/20";
        default:
            return "bg-gray-200 text-gray-700 border-gray-300";
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatRound = (value) => {
    if (!value) return "—";
    const v = String(value).toLowerCase();
    const m = v.match(/^round_(\d+)$/);
    if (m) return `Round ${m[1]}`;
    return String(value).replaceAll("_", " ");
};

export default function CandidateProfile() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [payload, setPayload] = useState(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/requisition/applicants/candidate-profile/`, {
                params: { application_id: applicationId },
            });
            const data = res?.data?.data;
            setPayload(data);
        } catch (e) {
            Notify.error(e?.response?.data?.errors || "Failed to load candidate profile.");
            setPayload(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [applicationId]);

    const candidate = payload?.candidate || null;
    const applications = payload?.applications || [];
    const total_applications = payload?.total_applications ?? applications.length ?? 0;
    const total_interviews = payload?.total_interviews ?? 0;
    const avg_interview_rating = payload?.avg_interview_rating ?? null;

    const initials = useMemo(() => {
        const f = candidate?.first_name?.[0] || candidate?.full_name?.[0] || "?";
        const l = candidate?.last_name?.[0] || candidate?.full_name?.split(" ")?.[1]?.[0] || "";
        return `${f}${l}`.toUpperCase();
    }, [candidate]);

    if (loading) return <LoadingSpinner />;

    if (!candidate) {
        return (
            <div className="p-6">
                <div className="bg-white border border-defaultborder rounded-xl p-6">
                    <p className="text-defaulttextcolor">Candidate not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bodybg p-6 md:p-10 font-inter text-defaulttextcolor">
            {/* Header Section */}
            <div className="max-w-xxl mx-auto bg-white rounded-xl shadow-defaultshadow border border-defaultborder overflow-hidden mb-8">
                {/* Banner using primary to purple gradient */}
                <div className="h-32 bg-gradient-to-r from-primary to-purple relative" />

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-10 mb-6 gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-all-sides flex-shrink-0">
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-500">
                                {initials}
                            </div>
                        </div>

                        {/* Name & Title Block */}
                        <div className="flex-1 text-center mt-12 md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 leading-none">{candidate.full_name}</h1>
                            <div className="text-textmuted font-medium flex flex-wrap justify-center md:justify-start items-center gap-2 mt-2">
                                <span className="flex items-center gap-1.5"><Briefcase size={16} /> {candidate.current_job_title || "—"}</span>
                                <span className="hidden md:inline text-gray-300">|</span>
                                <span className="flex items-center gap-1.5"><MapPin size={16} /> {candidate.city || "—"}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                            {candidate.resume_file_url && (
                                <a
                                    href={candidate.resume_file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-defaultborder"
                                >
                                    <FileText size={18} /> Resume
                                </a>
                            )}
                            {candidate.portfolio_url && (
                                <a
                                    href={candidate.portfolio_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    <Linkedin size={18} /> Portfolio
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-defaultborder pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                <Mail size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-textmuted font-semibold uppercase">Email</span>
                                <span className="text-sm font-medium break-all">{candidate.email || "—"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                <Phone size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-textmuted font-semibold uppercase">Mobile</span>
                                <span className="text-sm font-medium">{candidate.mobile_number || "—"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                <User size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-textmuted font-semibold uppercase">CNIC</span>
                                <span className="text-sm font-medium">{candidate.cnic_number || "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-xxl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-defaultshadow border border-defaultborder">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <span className="text-textmuted text-sm">Experience</span>
                                <span className="font-bold text-gray-800">
                                    {Math.floor(candidate.total_experience_years || 0)} Years
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <span className="text-textmuted text-sm">Applications</span>
                                <span className="font-bold text-gray-800">{total_applications}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                                <span className="text-textmuted text-sm">Interviews</span>
                                <span className="font-bold text-gray-800">{total_interviews}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                                <span className="text-warning text-sm font-medium flex items-center gap-2">
                                    <Star size={14} fill="currentColor" /> Avg. Rating
                                </span>
                                <span className="font-bold text-warning">{avg_interview_rating ?? "N/A"} / 5.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main History Column */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Application History</h2>
                        <span className="px-3 py-1 bg-gray-200 text-textmuted text-xs font-bold rounded-full">
                            {applications.length} Found
                        </span>
                    </div>

                    <div className="space-y-4">
                        {applications.map((app) => {
                            const requisitionId = app?.requisition?.id;
                            const reqNo = app?.requisition?.req_no || "—";
                            const title = app?.requisition?.title || "—";

                            return (
                                <div key={app.id} className="bg-white rounded-xl p-6 shadow-defaultshadow border border-defaultborder hover:shadow-all-sides transition-shadow relative overflow-hidden group">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${app.is_shortlisted ? "bg-success" : "bg-gray-300"}`} />

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pl-3">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusStyles(app.status)}`}>
                                                    {app.status || "—"}
                                                </span>
                                            </div>
                                            <div className="text-sm text-textmuted flex items-center gap-2 flex-wrap">
                                                <Building size={14} />
                                                {app?.requisition?.company?.name || "—"}
                                                <span>•</span>
                                                {app?.job_description?.department?.name || "—"}
                                            </div>
                                        </div>

                                        {app.ai_score != null && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-textmuted font-bold uppercase">AI Match</span>
                                                <div className="flex items-center gap-1 text-success font-bold">
                                                    <TrendingUp size={16} /> {app.ai_score}%
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 border-t border-defaultborder pt-4">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-textmuted">
                                                    <Clock size={15} />
                                                    Applied: {formatDate(app.created_at)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-textmuted">
                                                    <User size={15} />
                                                    Hiring Manager: <span className="font-medium text-gray-800">{app?.requisition?.hiring_manager?.full_name || "—"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                                                {requisitionId && (
                                                    <>
                                                        <Link to={`/module/requisition/detail/${requisitionId}`} className="text-xs font-semibold px-2 py-1.5 rounded bg-gray-100 hover:bg-gray-200 border border-defaultborder text-gray-700 inline-flex items-center gap-1.5 transition-colors">
                                                            <ExternalLink size={14} /> Requisition
                                                        </Link>
                                                        <button onClick={() => navigate(`/module/requisition/${requisitionId}/applicants/${app.id}/interviews`)} className="text-xs font-semibold px-2 py-1.5 rounded bg-info/10 hover:bg-info/20 border border-info/20 text-info inline-flex items-center gap-1.5 transition-colors">
                                                            <History size={14} /> History
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-100 rounded-lg p-3">
                                            {app.last_interview ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-textmuted uppercase">Last Interview</span>
                                                        <span className="text-xs px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded">
                                                            {app.last_interview.status || "—"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-800 capitalize">
                                                        {formatRound(app.last_interview.round)} ({app.last_interview.interview_type || "—"})
                                                    </p>
                                                    <p className="text-xs text-textmuted">{formatDate(app.last_interview.scheduled_at)}</p>
                                                    {app.average_interview_rating != null && (
                                                        <div className="mt-2 pt-2 border-t border-defaultborder flex items-center gap-1 text-sm font-semibold text-gray-700">
                                                            <Star size={14} className="text-warning fill-warning" />
                                                            Rating: {app.average_interview_rating}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col justify-center items-center text-gray-400 text-sm py-4">
                                                    <Calendar size={20} className="mb-1 opacity-50" />
                                                    <span>No interviews yet</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}