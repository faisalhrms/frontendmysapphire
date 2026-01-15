// src/modules/requisition/views/JobDescriptionDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Building,
    Layers,
    Calendar,
    FileText,
    Search,
    Info,
    Clock,
    ShieldCheck
} from "lucide-react";

import { useJobDesc } from "@modules/requisition/hooks/jobDescHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

export default function JobDescriptionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { jobDesc: jd, loading } = useJobDesc(id);

    if (loading) return <LoadingSpinner />;

    if (!jd && !loading) {
        return (
            <div className="p-10 text-center bg-bodybg min-h-screen">
                <div className="inline-block p-6 bg-white rounded-xl border border-defaultborder shadow-defaultshadow">
                    <p className="text-textmuted">Job Description not found.</p>
                    <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bodybg p-4 md:p-8 font-inter text-defaulttextcolor">
            <div className="max-w-4xl mx-auto">

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-textmuted hover:text-primary transition-colors font-medium group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <span className="px-3 py-1 bg-white border border-defaultborder rounded-full text-[10px] font-bold text-textmuted uppercase tracking-widest shadow-sm">
                        Ref: JD-{jd.id}
                    </span>
                </div>

                {/* Main Document Card */}
                <div className="bg-white rounded-2xl shadow-all-sides border border-defaultborder overflow-hidden">

                    {/* Visual Accent Strip */}
                    <div className="h-2 bg-gradient-to-r from-primary via-info to-purple" />

                    <div className="p-6 md:p-12">
                        {/* Title Section */}
                        <div className="border-b border-defaultborder pb-8 mb-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-3">
                                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                        {jd.position_title}
                                    </h1>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-lg text-sm font-semibold text-primary">
                                            <Building size={16} />
                                            {jd.company?.name}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-info/5 border border-info/10 rounded-lg text-sm font-semibold text-info">
                                            <Layers size={16} />
                                            {jd.department?.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-defaultborder">
                                        <FileText size={24} className="text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Details */}
                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Brief Role Overview</h2>
                                        <p className="text-xs text-textmuted font-medium uppercase tracking-tighter">Core Purpose & Responsibilities</p>
                                    </div>
                                </div>

                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                                    <div
                                        className="prose prose-slate max-w-none
                                        prose-ul:list-disc prose-ul:space-y-2 prose-ul:text-gray-700
                                        prose-p:text-gray-700 prose-p:leading-relaxed
                                        prose-strong:text-primary prose-strong:font-bold
                                        prose-em:text-info prose-em:not-italic prose-em:font-medium"
                                        dangerouslySetInnerHTML={{ __html: jd.brief_role_overview }}
                                    />
                                </div>
                            </section>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-50/50 border border-defaultborder rounded-2xl">
                                    <h3 className="text-sm font-bold text-textmuted uppercase mb-5 flex items-center gap-2">
                                        <Info size={16} className="text-info" /> Hierarchy
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-textmuted">Department</span>
                                            <span className="text-sm font-bold text-gray-800">{jd.department?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                                            <span className="text-sm text-textmuted">Sub-Department</span>
                                            <span className="text-sm font-bold text-gray-800">{jd.sub_department?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50/50 border border-defaultborder rounded-2xl">
                                    <h3 className="text-sm font-bold text-textmuted uppercase mb-5 flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" /> Timestamps
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-textmuted">Created Date</span>
                                            <span className="font-semibold">{new Date(jd.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 text-sm">
                                            <span className="text-textmuted">Last Updated</span>
                                            <span className="font-semibold flex items-center gap-1">
                                                <Clock size={14} className="text-warning" />
                                                {new Date(jd.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Meta */}
                        <div className="mt-16 pt-8 border-t border-defaultborder">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Search size={14} />
                                    </div>
                                    <p className="text-[10px] text-textmuted uppercase tracking-widest font-bold">
                                        Official Document • {jd.company?.name} • Confidential
                                    </p>
                                </div>
                                <div className="text-[10px] text-textmuted font-medium">
                                    Generated on {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}