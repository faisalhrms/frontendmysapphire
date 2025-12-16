// src/modules/requisition/views/PublicRequisitionApply.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@config/axiosConfig.js";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import PublicDynamicFormHeader from "@modules/forms/components/PublicDynamicFormHeader.jsx";

const schema = z.object({
    first_name: z.string().min(1, "First Name is required"),
    last_name: z.string().min(1, "Last Name is required"),
    cnic_number: z.string().min(5, "CNIC is required"),
    date_of_birth: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    home_address: z.string().optional().nullable(),
    email: z.string().email("Valid email required"),
    mobile_number: z.string().min(6, "Mobile number is required"),
    total_experience_years: z.coerce.number().min(0, "Must be ≥ 0"),
    current_job_title: z.string().optional().nullable(),
    expected_salary: z.coerce.number().optional().nullable(),
    notice_period_days: z.coerce.number().optional().nullable(),
    portfolio_url: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal(""))
        .nullable(),
    qualifications: z
        .array(
            z.object({
                degree: z.string().min(1, "Degree is required"),
                institution: z.string().min(1, "Institution is required"),
                year_completed: z.coerce
                    .number()
                    .int()
                    .min(1900)
                    .max(2100)
                    .optional()
                    .nullable(),
                order_index: z.coerce.number().int().min(1).optional(),
            })
        )
        .optional()
        .default([]),
    experiences: z
        .array(
            z.object({
                company: z.string().min(1, "Company is required"),
                designation: z.string().min(1, "Designation is required"),
                years_in_role: z.coerce.number().min(0, "Must be ≥ 0"),
                order_index: z.coerce.number().int().min(1).optional(),
            })
        )
        .optional()
        .default([]),
});

const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/rtf",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/jpg",
];
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

const pretty = (s) => (s ? s.replaceAll("-", " ") : "");

const PublicRequisitionApply = () => {
    const { slug } = useParams();

    const [meta, setMeta] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [metaError, setMetaError] = useState("");
    const primaryColor = "#673ab7";

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeError, setResumeError] = useState("");
    const fileRef = useRef(null);

    const [submitted, setSubmitted] = useState(false);
    const [serverMessage, setServerMessage] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [isStepBusy, setIsStepBusy] = useState(false);

    const getDefaultValues = () => ({
        first_name: "",
        last_name: "",
        cnic_number: "",
        date_of_birth: "",
        city: "",
        home_address: "",
        email: "",
        mobile_number: "",
        total_experience_years: 0,
        current_job_title: "",
        expected_salary: "",
        notice_period_days: "",
        portfolio_url: "",
        qualifications: [{ degree: "", institution: "", year_completed: "", order_index: 1 }],
        experiences: [{ company: "", designation: "", years_in_role: 0, order_index: 1 }],
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
        reset, // used by Clear
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaultValues(),
        mode: "onChange",
    });

    const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({
        control,
        name: "qualifications",
    });
    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control,
        name: "experiences",
    });

    const steps = [
        { title: "Personal", fields: ["first_name", "last_name", "cnic_number", "date_of_birth", "city", "home_address"] },
        { title: "Contact", fields: ["email", "mobile_number"] },
        {
            title: "Professional",
            fields: ["total_experience_years", "current_job_title", "expected_salary", "notice_period_days"],
        },
        { title: "Attachments", fields: [] },
        { title: "Qualifications", fields: ["qualifications"] },
        { title: "Experiences", fields: ["experiences"] },
        { title: "Review", fields: [] },
    ];
    const ATTACHMENTS_STEP_INDEX = 3;

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingMeta(true);
                const { data } = await api.get(`/employment-applications/public/requisition/${slug}/`);
                if (mounted) setMeta(data?.data || null);
            } catch (e) {
                if (mounted) setMetaError(e?.response?.data?.message || "Unable to load job details.");
            } finally {
                if (mounted) setLoadingMeta(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [slug]);

    const applicationClosed = useMemo(() => {
        if (!meta?.application_deadline) return false;
        try {
            const today = new Date();
            const deadline = new Date(meta.application_deadline);
            deadline.setHours(23, 59, 59, 999);
            return today > deadline;
        } catch {
            return false;
        }
    }, [meta]);

    const buildPayload = (values) => ({
        first_name: values.first_name,
        last_name: values.last_name,
        cnic_number: values.cnic_number,
        date_of_birth: values.date_of_birth || null,
        city: values.city || "",
        home_address: values.home_address || "",
        email: values.email.trim().toLowerCase(),
        mobile_number: values.mobile_number,
        total_experience_years: values.total_experience_years === "" ? 0 : Number(values.total_experience_years),
        current_job_title: values.current_job_title || null,
        expected_salary: values.expected_salary === "" ? null : Number(values.expected_salary),
        notice_period_days: values.notice_period_days === "" ? null : Number(values.notice_period_days),
        portfolio_url: values.portfolio_url || null,
        qualifications: (values.qualifications || [])
            .filter((q) => q.degree || q.institution)
            .map((q, idx) => ({
                degree: q.degree,
                institution: q.institution,
                year_completed: q.year_completed === "" || q.year_completed == null ? null : Number(q.year_completed),
                order_index: q.order_index || idx + 1,
            })),
        experiences: (values.experiences || [])
            .filter((e) => e.company || e.designation)
            .map((e, idx) => ({
                company: e.company,
                designation: e.designation,
                years_in_role: e.years_in_role === "" || e.years_in_role == null ? 0 : Number(e.years_in_role),
                order_index: e.order_index || idx + 1,
            })),
    });

    const validateResume = (file) => {
        if (!file) return "Please attach your resume (PDF/DOC/DOCX/RTF/TXT/PNG/JPG).";
        if (!ALLOWED_RESUME_TYPES.includes(file.type))
            return "Unsupported file type. Please upload PDF/DOC/DOCX/RTF/TXT/PNG/JPG.";
        if (file.size > MAX_RESUME_BYTES) return "File too large (max 10MB).";
        return "";
    };

    const onFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        setResumeFile(f);
        setResumeError(validateResume(f));
    };

    const scrollToFirstError = (fieldNames) => {
        const firstErrName = (fieldNames || []).find((f) => !!errors?.[f]);
        if (!firstErrName) return;
        const el = document.querySelector(`[name="${firstErrName}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleNext = async () => {
        try {
            setIsStepBusy(true);
            const currentFields = steps[currentStep].fields || [];
            const ok = currentFields.length ? await trigger(currentFields) : true;
            if (!ok) {
                scrollToFirstError(currentFields);
                setIsStepBusy(false);
                return;
            }
            if (currentStep === ATTACHMENTS_STEP_INDEX) {
                const err = validateResume(resumeFile);
                if (err) {
                    setResumeError(err);
                    setIsStepBusy(false);
                    return;
                }
            }
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } finally {
            setIsStepBusy(false);
        }
    };

    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleClear = () => {
        reset(getDefaultValues());
        setCurrentStep(0);
        setResumeFile(null);
        setResumeError("");
        setServerMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSubmit = async (values) => {
        try {
            setServerMessage("");
            const err = validateResume(resumeFile);
            if (err) {
                setCurrentStep(ATTACHMENTS_STEP_INDEX);
                setResumeError(err);
                return;
            }
            const payload = buildPayload(values);
            const formData = new FormData();
            formData.append("payload", JSON.stringify(payload));
            formData.append("resume_file", resumeFile);

            const res = await api.post(
                `/employment-applications/public/requisition/${slug}/apply/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setSubmitted(true);
            setServerMessage(res?.data?.message || "Your application has been submitted successfully.");
        } catch (e) {
            const msg = e?.response?.data?.message || e?.response?.data?.errors || e?.message || "Submission failed.";
            const text = typeof msg === "string" ? msg : "Submission failed.";
            setServerMessage(text);
            alert(text);
        }
    };

    if (loadingMeta) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f2ff] p-4">
                <div className="animate-spin h-10 w-10 rounded-full border-2 border-gray-400 border-t-transparent" />
            </div>
        );
    }

    if (metaError) {
        return (
            <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <PublicDynamicFormHeader
                        title="This job is unavailable"
                        description={metaError}
                        type="danger"
                        color="#e6533c"
                    />
                    <div className="mt-4 text-center">
                        <Link to="/" className="ti-btn ti-btn-primary">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (applicationClosed) {
        return (
            <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <PublicDynamicFormHeader
                        title="Applications Closed"
                        description="The deadline for this role has passed. Please check other openings."
                        type="danger"
                        color="#e6533c"
                    />
                    <div className="mt-4 text-center">
                        <Link to="/" className="ti-btn ti-btn-primary">Browse Careers</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <PublicDynamicFormHeader
                        title={meta?.title || pretty(slug)}
                        description={serverMessage || "Thank you for your submission! We have received your application."}
                        type="success"
                        color="#26bf94"
                    />
                    {/* Intentionally no redirect button on success */}
                </div>
            </div>
        );
    }

    // ------- Step content blocks -------
    const PersonalStep = () => (
        <div className="space-y-4">
            <FormInput name="first_name" control={control} errors={errors} placeholder="First Name" is_required />
            <FormInput name="last_name" control={control} errors={errors} placeholder="Last Name" is_required />
            <FormInput name="cnic_number" control={control} errors={errors} placeholder="CNIC Number" is_required />
            <FormInput type="date" name="date_of_birth" control={control} errors={errors} placeholder="Date of Birth" />
            <FormInput name="city" control={control} errors={errors} placeholder="City" />
            <FormTextarea name="home_address" control={control} errors={errors} placeholder="Home Address" rows={2} />
        </div>
    );

    const ContactStep = () => (
        <div className="space-y-4">
            <FormInput type="email" name="email" control={control} errors={errors} placeholder="Email Address" is_required />
            <FormInput name="mobile_number" control={control} errors={errors} placeholder="Mobile Number" is_required />
        </div>
    );

    const ProfessionalStep = () => (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <FormInput
                    type="number"
                    step="0.01"
                    name="total_experience_years"
                    control={control}
                    errors={errors}
                    placeholder="Total Experience (Y)"
                    is_required
                />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <FormInput name="current_job_title" control={control} errors={errors} placeholder="Current Job Title" />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <FormInput type="number" name="expected_salary" control={control} errors={errors} placeholder="Expected Salary" />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <FormInput type="number" name="notice_period_days" control={control} errors={errors} placeholder="Notice Period (days)" />
            </div>
        </div>
    );

    const AttachmentsStep = () => (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <label className="block text-sm text-gray-700 mb-1">Resume / CV *</label>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.rtf,.txt,.png,.jpg,.jpeg"
                    onChange={onFileChange}
                    className="form-control"
                />
                {resumeFile && (
                    <p className="text-xs text-gray-600 mt-1">
                        Selected: <strong>{resumeFile.name}</strong> • {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                )}
                {resumeError ? <p className="text-danger text-xs mt-1">{resumeError}</p> : null}
                <p className="text-xs text-gray-400 mt-1">Max 10MB. Allowed: PDF/DOC/DOCX/RTF/TXT/PNG/JPG.</p>
            </div>

            <div className="col-span-12">
                <FormInput
                    name="portfolio_url"
                    control={control}
                    errors={errors}
                    placeholder="LinkedIn / Portfolio URL (optional)"
                />
            </div>
        </div>
    );

    const QualificationsStep = () => (
        <div>
            <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Add your degrees and institutions (latest first).</p>
                <button
                    type="button"
                    className="ti-btn ti-btn-success ti-btn-md"
                    onClick={() =>
                        appendQual({
                            degree: "",
                            institution: "",
                            year_completed: "",
                            order_index: (qualFields?.length || 0) + 1,
                        })
                    }
                >
                    <i className="ri-add-line" /> Add
                </button>
            </div>
            {qualFields?.length ? (
                qualFields.map((f, idx) => (
                    <div key={f.id} className="grid grid-cols-12 gap-4 items-end mb-3">
                        <div className="col-span-12 md:col-span-4">
                            <FormInput name={`qualifications.${idx}.degree`} control={control} errors={errors} placeholder="Degree" />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <FormInput
                                name={`qualifications.${idx}.institution`}
                                control={control}
                                errors={errors}
                                placeholder="Institution"
                            />
                        </div>
                        <div className="col-span-8 md:col-span-3">
                            <FormInput
                                type="number"
                                name={`qualifications.${idx}.year_completed`}
                                control={control}
                                errors={errors}
                                placeholder="Year Completed"
                            />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                            {idx > 0 && (
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-danger ti-btn-sm w-full"
                                    onClick={() => removeQual(idx)}
                                >
                                    <i className="bi bi-trash3-fill" />
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No qualifications added yet.</p>
            )}
        </div>
    );

    const ExperiencesStep = () => (
        <div>
            <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600 text-sm">Add relevant roles you’ve held.</p>
                <button
                    type="button"
                    className="ti-btn ti-btn-success ti-btn-md"
                    onClick={() =>
                        appendExp({
                            company: "",
                            designation: "",
                            years_in_role: 0,
                            order_index: (expFields?.length || 0) + 1,
                        })
                    }
                >
                    <i className="ri-add-line" /> Add
                </button>
            </div>
            {expFields?.length ? (
                expFields.map((f, idx) => (
                    <div key={f.id} className="grid grid-cols-12 gap-4 items-end mb-3">
                        <div className="col-span-12 md:col-span-4">
                            <FormInput name={`experiences.${idx}.company`} control={control} errors={errors} placeholder="Company" />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <FormInput
                                name={`experiences.${idx}.designation`}
                                control={control}
                                errors={errors}
                                placeholder="Designation"
                            />
                        </div>
                        <div className="col-span-8 md:col-span-3">
                            <FormInput
                                type="number"
                                step="0.01"
                                name={`experiences.${idx}.years_in_role`}
                                control={control}
                                errors={errors}
                                placeholder="Years in Role"
                            />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                            {idx > 0 && (
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-danger ti-btn-sm w-full"
                                    onClick={() => removeExp(idx)}
                                >
                                    <i className="bi bi-trash3-fill" />
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No experiences added yet.</p>
            )}
        </div>
    );

    const ReviewStep = () => (
        <div className="grid grid-cols-12 gap-4 text-sm">
            <div className="col-span-12 md:col-span-6">
                <div className="font-semibold mb-1">Personal</div>
                <div className="text-gray-600">
                    {watch("first_name")} {watch("last_name")}
                    <br />
                    CNIC: {watch("cnic_number") || "—"}
                    <br />
                    DOB: {watch("date_of_birth") || "—"}
                    <br />
                    City: {watch("city") || "—"}
                </div>
            </div>
            <div className="col-span-12 md:col-span-6">
                <div className="font-semibold mb-1">Contact</div>
                <div className="text-gray-600">
                    Email: {watch("email") || "—"}
                    <br />
                    Mobile: {watch("mobile_number") || "—"}
                </div>
            </div>
            <div className="col-span-12 md:col-span-6">
                <div className="font-semibold mb-1 mt-3 md:mt-0">Professional</div>
                <div className="text-gray-600">
                    Exp: {watch("total_experience_years") || 0} yrs
                    <br />
                    Title: {watch("current_job_title") || "—"}
                    <br />
                    Expected: {watch("expected_salary") || "—"}
                    <br />
                    Notice: {watch("notice_period_days") || "—"} days
                </div>
            </div>
            <div className="col-span-12 md:col-span-6">
                <div className="font-semibold mb-1 mt-3 md:mt-0">Links</div>
                <div className="text-gray-600">
                    Portfolio: {watch("portfolio_url") || "—"}
                    <br />
                    Resume: {resumeFile ? resumeFile.name : <span className="text-danger">Missing</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <PublicDynamicFormHeader
                    title={meta?.title || pretty(slug)}
                    description={`Ref: ${meta?.req_no || "—"}${meta?.company?.name ? ` • ${meta.company.name}` : ""}`}
                    currentStep={currentStep}
                    steps={steps}
                    color={primaryColor}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        {currentStep === 0 && <PersonalStep />}
                        {currentStep === 1 && <ContactStep />}
                        {currentStep === 2 && <ProfessionalStep />}
                        {currentStep === 3 && <AttachmentsStep />}
                        {currentStep === 4 && <QualificationsStep />}
                        {currentStep === 5 && <ExperiencesStep />}
                        {currentStep === 6 && <ReviewStep />}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-4 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={isStepBusy}
                                        className="text-white px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {isStepBusy ? "Validating..." : "Next"}
                                    </button>
                                ) : (
                                    <FormButton
                                        isLoading={isSubmitting}
                                        label={isSubmitting ? "Submitting..." : "Submit"}
                                        className="text-white px-6 py-2 rounded text-sm font-medium"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                )}
                            </div>

                            {/* Clear button (no redirect) */}
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>

                        {serverMessage && !submitted && <div className="text-sm text-warning mt-3">{serverMessage}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublicRequisitionApply;
