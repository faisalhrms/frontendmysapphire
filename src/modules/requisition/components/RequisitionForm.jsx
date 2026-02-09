import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";

import { formatOptions } from "@helpers/formatters.js";
import requisitionSchema from "@modules/requisition/schemas/requisitionSchema.js";
import { useRequisitionForm } from "@modules/requisition/hooks/requisitionHooks.js";

import JobDescFormModal from "@modules/requisition/models/JobDescFormModal.jsx";

// --- enums ---
const reqTypeOptions = [
    { value: "new", label: "New" },
    { value: "replacement", label: "Replacement" },
    { value: "additional", label: "Additional" },
];
const employmentTypeOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "contract", label: "Contract" },
    { value: "intern", label: "Intern" },
    { value: "consultant", label: "Consultant" },
];
const workModeOptions = [
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
];
const budgetStatusOptions = [
    { value: "budgeted", label: "Budgeted" },
    { value: "unbudgeted", label: "Unbudgeted" },
];
const channelOptions = [
    { value: "website", label: "Company Website" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "indeed", label: "Indeed" },
    { value: "glassdoor", label: "Glassdoor" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter/X" },
];
const preventDuplicateOptions = [
    { value: false, label: "No (Allow re-apply)" },
    { value: true, label: "Yes (Prevent duplicate by Job Description)" },
];

const buildDefaults = (requisitionData, companyIdFromUser) => ({
    company_id: requisitionData?.company?.id ?? companyIdFromUser ?? null,

    job_description: requisitionData?.job_description?.id ?? null,
    designation: requisitionData?.designation?.id ?? null,
    location: requisitionData?.location?.id ?? null,
    hiring_manager: requisitionData?.hiring_manager?.id ?? null,

    openings: requisitionData?.openings ?? 1,
    req_type: requisitionData?.req_type ?? "new",
    employment_type: requisitionData?.employment_type ?? "permanent",
    contract_duration_months: requisitionData?.contract_duration_months ?? null,
    work_mode: requisitionData?.work_mode ?? "onsite",
    replacement_for_employee: requisitionData?.replacement_for_employee ?? null,

    budget_status: requisitionData?.budget_status ?? "budgeted",
    unbudgeted_reason: requisitionData?.unbudgeted_reason ?? "",

    min_total_experience_years: requisitionData?.min_total_experience_years ?? null,
    max_total_experience_years: requisitionData?.max_total_experience_years ?? null,

    education_relevant_experience: requisitionData?.education_relevant_experience ?? "",
    knowledge_technical_skills: requisitionData?.knowledge_technical_skills ?? "",

    salary_band_code: requisitionData?.salary_band_code ?? "",
    target_salary_currency: requisitionData?.target_salary_currency ?? "",
    target_salary_min: requisitionData?.target_salary_min ?? null,
    target_salary_max: requisitionData?.target_salary_max ?? null,

    publish_on_approval: requisitionData?.publish_on_approval ?? true,

    prevent_duplicate_applications_by_jd:
        requisitionData?.prevent_duplicate_applications_by_jd ?? false,

    validity_days: requisitionData?.validity_days ?? "",

    channels: requisitionData?.channels ?? [],
    attachment_ids: requisitionData?.attachments?.map((f) => f.id) ?? [],
});

const RequisitionForm = ({ requisitionData = null, isEditMode = false, onSuccess }) => {
    const currentUser = useSelector((s) => s?.auth?.user);
    const companyId = currentUser?.employee?.company?.id ?? null;

    const defaultValues = useMemo(
        () => buildDefaults(requisitionData, companyId),
        [companyId, requisitionData?.id, requisitionData?.updated_at]
    );

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(requisitionSchema),
        defaultValues,
    });

    const reqType = useWatch({ control, name: "req_type" });
    const employmentType = useWatch({ control, name: "employment_type" });
    const budgetStatus = useWatch({ control, name: "budget_status" });

    const companyIdWatched = useWatch({ control, name: "company_id" });
    const companyIdForLocations = companyIdWatched ?? companyId;

    const locationApiUrl = useMemo(() => {
        const base = "/select/locations/";
        return `${base}?company_id=${encodeURIComponent(companyIdForLocations ?? "")}`;
    }, [companyIdForLocations]);

    const locationQueryKeyBase = useMemo(
        () => `locations-${companyIdForLocations || "none"}`,
        [companyIdForLocations]
    );

    const { handleRequisitionSubmit: submitRequisition } =
        useRequisitionForm(requisitionData, isEditMode, onSuccess);

    const initKey = isEditMode
        ? `edit-${requisitionData?.id ?? "none"}`
        : `create-${companyId ?? "none"}`;

    const lastInitKeyRef = useRef(null);

    useEffect(() => {
        if (lastInitKeyRef.current === initKey) return;
        if (isEditMode && !requisitionData?.id) return;

        reset(defaultValues);
        lastInitKeyRef.current = initKey;
    }, [initKey, isEditMode, requisitionData?.id, reset, defaultValues]);

    // ✅ Draft save (NO validation)
    const [isDraftSaving, setIsDraftSaving] = useState(false);

    const onSaveDraft = async () => {
        setIsDraftSaving(true);
        try {
            const values = getValues();
            await submitRequisition(values, { mode: "draft" });
        } finally {
            setIsDraftSaving(false);
        }
    };

    // ✅ Submit for approval (VALIDATED)
    const onSubmit = async (formValues) => {
        await submitRequisition(formValues, { mode: "submit" });
    };

    const [isJDModalOpen, setIsJDModalOpen] = useState(false);

    const handleJDModalSuccess = (resp) => {
        const jd = resp?.data ?? resp ?? {};
        const id = jd.id;
        const label = jd.position_title || jd.title || `JD #${id}`;

        if (id) {
            setValue("job_description", { value: id, label }, { shouldDirty: true, shouldValidate: true });
        }
        setIsJDModalOpen(false);
    };

    // Optional UX rule: only allow submit when draft/rejected/new
    const status = requisitionData?.status || "draft";
    const canSubmit = !isEditMode || ["draft", "rejected"].includes(status);
    const canDraft = !isEditMode || ["draft", "rejected"].includes(status);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    {/* LEFT */}
                    <div className="xxl:col-span-9 col-span-12">
                        {/* ===== Requisition Basics ===== */}
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Requisition Details</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Job Description + Add */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="flex items-start gap-2">
                                            <button
                                                type="button"
                                                className="ti-btn mt-7 ti-btn-primary ti-btn-icon"
                                                title="Add Job Description"
                                                aria-label="Add Job Description"
                                                onClick={() => setIsJDModalOpen(true)}
                                            >
                                                <Plus size={16} />
                                            </button>

                                            <div className="flex-1">
                                                <FormAsyncSelect
                                                    is_required
                                                    name="job_description"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Job Description"
                                                    apiUrl="/select/job-descriptions/"
                                                    queryKeyBase="job-descriptions"
                                                    preselectedOptions={formatOptions(
                                                        requisitionData,
                                                        "job_description",
                                                        "id",
                                                        "position_title"
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grade */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            is_required
                                            name="designation"
                                            control={control}
                                            errors={errors}
                                            placeholder="Grade"
                                            apiUrl="/select/designations/"
                                            queryKeyBase="designations"
                                            preselectedOptions={formatOptions(requisitionData, "designation", "id", "name")}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="location"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Location"
                                            apiUrl={locationApiUrl}
                                            queryKeyBase={locationQueryKeyBase}
                                            clientSideSearch={false}
                                            preselectedOptions={formatOptions(requisitionData, "location", "id", "name")}
                                        />
                                    </div>

                                    {/* Hiring Manager */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            is_required
                                            name="hiring_manager"
                                            control={control}
                                            errors={errors}
                                            placeholder="Hiring Manager"
                                            apiUrl="/select/hr-users/"
                                            queryKeyBase="users"
                                            preselectedOptions={formatOptions(requisitionData, "hiring_manager", "id", "full_name")}
                                        />
                                    </div>

                                    {/* Openings */}
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="openings"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Openings"
                                            min="1"
                                        />
                                    </div>

                                    {/* Req Type */}
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            name="req_type"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Requisition Type"
                                            options={reqTypeOptions}
                                        />
                                    </div>

                                    {/* Employment Type */}
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            name="employment_type"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Employment Type"
                                            options={employmentTypeOptions}
                                        />
                                    </div>

                                    {/* Work Mode */}
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            name="work_mode"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Work Mode"
                                            options={workModeOptions}
                                        />
                                    </div>

                                    {/* Contract only */}
                                    {employmentType === "contract" && (
                                        <div className="xl:col-span-3 col-span-12">
                                            <FormInput
                                                type="number"
                                                name="contract_duration_months"
                                                is_required
                                                control={control}
                                                errors={errors}
                                                placeholder="Contract Duration (Months)"
                                                min="1"
                                            />
                                        </div>
                                    )}

                                    {/* Replacement only */}
                                    {reqType === "replacement" && (
                                        <div className="xl:col-span-9 col-span-12">
                                            <FormAsyncSelect
                                                name="replacement_for_employee"
                                                is_required
                                                control={control}
                                                errors={errors}
                                                placeholder="Replace Employee"
                                                apiUrl="/select/employees/replace/"
                                                queryKeyBase="employees"
                                                preselectedOptions={formatOptions(
                                                    requisitionData,
                                                    "replacement_for_employee",
                                                    "id",
                                                    "full_name"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== Budget / Unbudgeted Reason ===== */}
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Budget & Hiring Justification</div>
                            </div>

                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name="budget_status"
                                            is_required
                                            control={control}
                                            errors={errors}
                                            placeholder="Budget Status"
                                            options={budgetStatusOptions}
                                        />
                                    </div>

                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="max_total_experience_years"
                                            control={control}
                                            errors={errors}
                                            placeholder="Max Total Experience (Years)"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="min_total_experience_years"
                                            control={control}
                                            errors={errors}
                                            placeholder="Min Total Experience (Years)"
                                            min="0"
                                            step="0.5"
                                        />
                                    </div>

                                    {budgetStatus === "unbudgeted" && (
                                        <div className="xl:col-span-12 col-span-12">
                                            <FormRichTextarea
                                                name="unbudgeted_reason"
                                                control={control}
                                                errors={errors}
                                                placeholder="Unbudgeted Reason"
                                                is_required
                                                editorOptions={{ maxCharCount: 5000, charCounter: true }}
                                            />
                                        </div>
                                    )}

                                    <div className="xl:col-span-12 col-span-12">
                                        <FormRichTextarea
                                            name="education_relevant_experience"
                                            control={control}
                                            errors={errors}
                                            placeholder="Education & Relevant Experience"
                                            is_required
                                            editorOptions={{ maxCharCount: 5000, charCounter: true }}
                                        />
                                    </div>

                                    <div className="xl:col-span-12 col-span-12">
                                        <FormRichTextarea
                                            name="knowledge_technical_skills"
                                            control={control}
                                            errors={errors}
                                            placeholder="Knowledge & Technical Skills"
                                            is_required
                                            editorOptions={{ maxCharCount: 5000, charCounter: true }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== Salary / Attachments / Buttons ===== */}
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Salary Range / Budget</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="target_salary_min"
                                            control={control}
                                            errors={errors}
                                            placeholder="Salary Min"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="target_salary_max"
                                            control={control}
                                            errors={errors}
                                            placeholder="Salary Max"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <GalleryUpload
                                            currentValue={requisitionData?.attachments?.map((f) => f.id) ?? []}
                                            files={requisitionData?.attachments ?? []}
                                            inputName="attachment_ids"
                                            placeholder="Attach supporting docs"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>

                                    {/* ✅ Buttons */}
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="border-t border-dashed bg-gray-50/60 dark:bg-black/20 flex flex-wrap gap-2 justify-end p-3">
                                            <button
                                                type="button"
                                                className="ti-btn ti-btn-light"
                                                onClick={onSaveDraft}
                                                disabled={!canDraft || isSubmitting || isDraftSaving}
                                            >
                                                {isDraftSaving ? "Saving..." : "Save Draft"}
                                            </button>

                                            <button
                                                type="submit"
                                                className="ti-btn ti-btn-primary"
                                                disabled={!canSubmit || isSubmitting || isDraftSaving}
                                            >
                                                {isSubmitting ? "Submitting..." : "Submit for Approval"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Publishing</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormCheckbox
                                            name="publish_on_approval"
                                            label="Publish automatically when approved"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <FormInput
                                            is_required
                                            type="number"
                                            name="validity_days"
                                            control={control}
                                            errors={errors}
                                            placeholder="Validity Days After Approval"
                                            min="0"
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <FormSelect
                                            isMulti
                                            name="channels"
                                            control={control}
                                            errors={errors}
                                            placeholder="Publishing Channels"
                                            options={channelOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Application Rules</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormSelect
                                            name="prevent_duplicate_applications_by_jd"
                                            control={control}
                                            errors={errors}
                                            placeholder="Prevent Duplicate Applications (Same JD)"
                                            options={preventDuplicateOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <JobDescFormModal
                isOpen={isJDModalOpen}
                onClose={() => setIsJDModalOpen(false)}
                jobDescData={null}
                onSuccess={handleJDModalSuccess}
            />
        </>
    );
};

export default RequisitionForm;
