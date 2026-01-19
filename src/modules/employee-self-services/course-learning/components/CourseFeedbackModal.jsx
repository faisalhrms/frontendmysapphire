import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import { Star, Shield, MessageSquare, X, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import Notify from "@helpers/toastNotifications.js";

const RatingRow = ({ label, name, value, onChange, error, helper }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="group space-y-4 py-4 transition-all border-b border-zinc-100 last:border-0">
            <div className="flex items-start justify-between gap-3 px-1">
                <div className="min-w-0">
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 leading-none mb-1">{label}</label>
                    {helper && (
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{helper}</p>
                    )}
                </div>
                <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest ${value ? 'text-zinc-900' : 'text-zinc-300'}`}>
                    {value ? `${value} / 5` : "Pending"}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                    const active = value === n;
                    const isLit = (hover || value) >= n;

                    return (
                        <button
                            key={n}
                            type="button"
                            onMouseEnter={() => setHover(n)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => onChange(name, n)}
                            className={`
                                relative h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200
                                ${active
                                ? "bg-zinc-900 border-zinc-900 shadow-xl scale-105 z-10"
                                : "bg-white border-zinc-200 hover:border-zinc-900 hover:shadow-md"}
                                focus:outline-none
                            `}
                        >
                            <Star
                                size={18}
                                strokeWidth={active ? 3 : 2}
                                className={`transition-colors duration-200 ${
                                    active
                                        ? "fill-white text-white"
                                        : isLit ? "fill-zinc-900 text-zinc-900" : "text-zinc-200"
                                }`}
                            />
                            {active && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="flex items-center gap-1 text-danger animate-in slide-in-from-left-2">
                    <AlertCircle size={10} strokeWidth={3} />
                    <p className="text-[9px] font-black uppercase tracking-tighter">{error.message}</p>
                </div>
            )}
        </div>
    );
};

const SectionCard = ({ title, icon, children }) => {
    return (
        <div className="relative rounded-[2rem] border-2 border-zinc-900 bg-white p-8 shadow-xl overflow-hidden group dark:text-gray-200 dark:bg-bodybg
">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {icon}
            </div>
            <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4 dark:text-gray-200 dark:bg-bodybg
">
                <div className="text-zinc-900">
                    {icon}
                </div>
                <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.3em] dark:text-gray-200 dark:bg-bodybg
">{title}</h4>
            </div>
            {children}
        </div>
    );
};

const CourseFeedbackModal = ({ open, enrollmentId, onSubmitted }) => {
    const [submitting, setSubmitting] = useState(false);

    const { register, setValue, watch, handleSubmit, setError, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            overall_rating: null,
            content_quality: null,
            role_relevance: null,
            learning_objectives_met: null,
            platform_experience: null,
            engagement_interactivity: null,
            technical_issues: "none",
            issue_details: "",
            improvement_suggestion: "",
        },
        mode: "onSubmit",
    });

    const technicalIssues = watch("technical_issues");
    const overall = watch("overall_rating");

    const showIssueDetails = useMemo(() => technicalIssues === "minor" || technicalIssues === "major", [technicalIssues]);

    const setRating = (field, val) => {
        setValue(field, val, { shouldValidate: true });
        clearErrors(field);
    };

    const submit = async (form) => {
        if (!enrollmentId) return;

        const required = ["overall_rating", "content_quality", "role_relevance", "learning_objectives_met", "platform_experience"];
        let ok = true;
        required.forEach(f => {
            if (!form[f]) { setError(f, { type: "manual", message: "Required Field" }); ok = false; }
        });

        if (Number(form.overall_rating) <= 2 && !form.improvement_suggestion?.trim()) {
            setError("improvement_suggestion", { type: "manual", message: "Critique Required for low rating" });
            ok = false;
        }

        if (!ok) return;

        try {
            setSubmitting(true);
            const res = await api.post("/lms/course-enrollment-feedback/", { enrollment_id: enrollmentId, ...form });
            Notify.success("Data Synthesized. Thank you.");
            onSubmitted?.(res?.data?.data);
        } catch (e) {
            Notify.error("Transmission Error.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="fixed inset-0 bg-white/80 backdrop-blur-l animate-in fade-in duration-500" />

            <div className="relative w-full max-w-5xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">

                <div className="relative overflow-hidden rounded-[3rem] bg-zinc-50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border-2 border-zinc-900">

                    {/* Header */}
                    <div className="bg-zinc-900 p-10 flex items-center justify-between text-white">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-zinc-900 shadow-2xl">
                                <Zap size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">Module Evaluation</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Telemetry Channel Open</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit(submit)} className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-10 dark:text-gray-200 dark:bg-bodybg
">

                        <SectionCard title="Performance Audit" icon={<Star size={24} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                <RatingRow label="Module Satisfaction" helper="General course experience" name="overall_rating" value={overall} onChange={setRating} error={errors.overall_rating} />
                                <RatingRow label="Curriculum Quality" helper="Structure and clarity" name="content_quality" value={watch("content_quality")} onChange={setRating} error={errors.content_quality} />
                                <RatingRow label="Industrial Relevance" helper="Applicability to your role" name="role_relevance" value={watch("role_relevance")} onChange={setRating} error={errors.role_relevance} />
                                <RatingRow label="Objective Completion" helper="Were learning goals achieved?" name="learning_objectives_met" value={watch("learning_objectives_met")} onChange={setRating} error={errors.learning_objectives_met} />
                                <RatingRow label="Interactivity Index" helper="Engagement and focus level" name="engagement_interactivity" value={watch("engagement_interactivity")} onChange={setRating} error={errors.engagement_interactivity}/>
                                <RatingRow label="System Experience" helper="LMS performance and UX" name="platform_experience" value={watch("platform_experience")} onChange={setRating} error={errors.platform_experience} />
                            </div>
                        </SectionCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <SectionCard title="Technical Integrity" icon={<Shield size={24} />}>
                                <div className="relative">
                                    <select
                                        {...register("technical_issues")}
                                        className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-zinc-900 focus:border-zinc-900 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="none">01 // Seamless Execution</option>
                                        <option value="minor">02 // Minor Anomalies</option>
                                        <option value="major">03 // Critical Blockers</option>
                                    </select>
                                </div>
                            </SectionCard>

                            <SectionCard title="Refinement Logic" icon={<MessageSquare size={24} />}>
                                <textarea
                                    {...register("improvement_suggestion")}
                                    rows={1}
                                    placeholder="INPUT SUGGESTIONS..."
                                    className="w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50 px-6 py-5 text-[11px] font-black uppercase tracking-widest focus:border-zinc-900 outline-none transition-all min-h-[64px]"
                                />
                                {errors.improvement_suggestion && <p className="mt-3 text-[9px] font-black text-danger uppercase tracking-widest">{errors.improvement_suggestion.message}</p>}
                            </SectionCard>
                        </div>

                        {showIssueDetails && (
                            <div className="animate-in slide-in-from-top-6 duration-500">
                                <SectionCard title="Anomaly Logs" icon={<AlertCircle size={24} />}>
                                    <textarea
                                        {...register("issue_details")}
                                        rows={3}
                                        placeholder="PROVIDE TECHNICAL DETAILS..."
                                        className="w-full rounded-2xl border-2 border-zinc-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-8 focus:ring-zinc-900/5 transition-all"
                                    />
                                </SectionCard>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="p-10 bg-white border-t-2 border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                            Validation Required
                        </div>
                        <button
                            type="submit"
                            onClick={handleSubmit(submit)}
                            disabled={submitting}
                            className={`
                                w-full md:w-auto px-16 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all border-b-4 border-black/20
                                ${submitting ? "bg-zinc-100 text-zinc-400 border-0" : "bg-zinc-900 text-white hover:bg-emerald-600 hover:shadow-2xl active:scale-95"}
                            `}
                        >
                            {submitting ? "Processing..." : "Submit"}
                            {!submitting && <CheckCircle2 size={18} strokeWidth={3} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseFeedbackModal);