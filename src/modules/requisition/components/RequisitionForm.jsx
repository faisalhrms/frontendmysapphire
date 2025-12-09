// @modules/requisition/components/RequisitionForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";

import { formatOptions } from "@helpers/formatters.js";
import requisitionSchema from "@modules/requisition/schemas/requisitionSchema.js";
import { useRequisitionForm } from "@modules/requisition/hooks/requisitionHooks.js";

// ✅ use the same import path you already use elsewhere
import JobDescFormModal from "@modules/requisition/models/JobDescFormModal.jsx";

// --- enums (unchanged) ---
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
const genderOptions = [
    { value: "any", label: "Any" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
];
const channelOptions = [
    { value: "website", label: "Company Website" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "indeed", label: "Indeed" },
    { value: "glassdoor", label: "Glassdoor" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter/X" },
];

const RequisitionForm = ({ requisitionData = {}, isEditMode = false, onSuccess }) => {
    const currentUser = useSelector((s) => s?.auth?.user);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(requisitionSchema),
        defaultValues: {
            company_id: requisitionData?.company?.id ?? null,
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

            business_justification: requisitionData?.business_justification ?? "",

            person_spec: {
                age_from: requisitionData?.person_spec?.age_from ?? null,
                age_to: requisitionData?.person_spec?.age_to ?? null,
                gender: requisitionData?.person_spec?.gender ?? "any",
                preferred_industry_background: requisitionData?.person_spec?.preferred_industry_background ?? "",
                education_relevant_experience: requisitionData?.person_spec?.education_relevant_experience ?? "",
                alternate_education_experience: requisitionData?.person_spec?.alternate_education_experience ?? "",
                knowledge_technical_skills: requisitionData?.person_spec?.knowledge_technical_skills ?? "",
                business_functional_understanding: requisitionData?.person_spec?.business_functional_understanding ?? "",
                personality_behavioral_attributes: requisitionData?.person_spec?.personality_behavioral_attributes ?? "",
                hiring_justification: requisitionData?.person_spec?.hiring_justification ?? "",
            },

            salary_band_code: requisitionData?.salary_band_code ?? "",
            target_salary_currency: requisitionData?.target_salary_currency ?? "",
            target_salary_min: requisitionData?.target_salary_min ?? null,
            target_salary_max: requisitionData?.target_salary_max ?? null,

            publish_on_approval: requisitionData?.publish_on_approval ?? true,
            application_deadline: requisitionData?.application_deadline ?? "",
            channels: requisitionData?.channels ?? [],

            attachment_ids: requisitionData?.attachments?.map((f) => f.id) ?? [],
        },
    });

    const reqType = useWatch({ control, name: "req_type" });
    const employmentType = useWatch({ control, name: "employment_type" });

    // submit via hook (unchanged)
    const { handleRequisitionSubmit: submitRequisition } =
        useRequisitionForm(requisitionData, isEditMode, onSuccess);

    useEffect(() => {
        if (!requisitionData) return;
        Object.entries(requisitionData).forEach(([k, v]) => {
            if (["job_description", "designation", "location", "hiring_manager"].includes(k)) return;
            setValue(k, v);
        });
    }, [requisitionData, setValue]);

    const onSubmit = async (payload) => {
        await submitRequisition(payload);
    };

    // 🔹 NEW: open/close state for your existing JD modal
    const [isJDModalOpen, setIsJDModalOpen] = useState(false);

    // 🔹 On JD create/update success from modal → select it in this form
    const handleJDModalSuccess = (resp) => {
        // hook/service returns the created/updated JD object
        const jd = resp?.data ?? resp ?? {};
        const id = jd.id;
        const label = jd.position_title || jd.title || `JD #${id}`;
        if (id) {
            setValue("job_description", { value: id, label }, { shouldDirty: true, shouldValidate: true });
        }
        setIsJDModalOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        {/* ===== Requisition Basics ===== */}
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Requisition Details</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Job Description with + button (opens your JD modal) */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="flex items-start gap-2">
                                            <button
                                                type="button"
                                                className="ti-btn mt-7 ti-btn-primary ti-btn-icon"
                                                title="Add Job Description"
                                                aria-label="Add Job Description"
                                                onClick={() => setIsJDModalOpen(true)}
                                            >
                                                <Plus size={16}/>
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

                                    {/* Designation */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="designation"
                                            control={control}
                                            errors={errors}
                                            placeholder="Designation"
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
                                            apiUrl="/select/locations/"
                                            queryKeyBase="locations"
                                            clientSideSearch={false}
                                            preselectedOptions={formatOptions(requisitionData, "location", "id", "name")}
                                        />
                                    </div>

                                    {/* Hiring Manager */}
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="hiring_manager"
                                            control={control}
                                            errors={errors}
                                            placeholder="Hiring Manager"
                                            apiUrl="/select/managers/"
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

                                    {/* Justification */}
                                    <div className="col-span-12">
                                        <FormTextarea
                                            is_required
                                            name="business_justification"
                                            control={control}
                                            errors={errors}
                                            placeholder="Business Justification"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== Person Specification (override) ===== */}
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Person Specification (Override)</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-2 col-span-6">
                                        <FormInput type="number" name="person_spec.age_from" control={control} errors={errors} placeholder="Age From" />
                                    </div>
                                    <div className="xl:col-span-2 col-span-6">
                                        <FormInput type="number" name="person_spec.age_to" control={control} errors={errors} placeholder="Age To" />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect name="person_spec.gender" control={control} errors={errors} placeholder="Gender" options={genderOptions} />
                                    </div>
                                    <div className="xl:col-span-5 col-span-12">
                                        <FormInput name="person_spec.preferred_industry_background" control={control} errors={errors} placeholder="Preferred Industry Background" />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormTextarea name="person_spec.education_relevant_experience" control={control} errors={errors} placeholder="Education & Relevant Experience" rows={3} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormTextarea name="person_spec.alternate_education_experience" control={control} errors={errors} placeholder="Alternate Education & Experience" rows={3} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormTextarea name="person_spec.knowledge_technical_skills" control={control} errors={errors} placeholder="Knowledge & Technical Skills" rows={3} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormTextarea name="person_spec.business_functional_understanding" control={control} errors={errors} placeholder="Business / Functional Understanding" rows={3} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormTextarea name="person_spec.personality_behavioral_attributes" control={control} errors={errors} placeholder="Personality & Behavioral Attributes" rows={3} />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormTextarea name="person_spec.hiring_justification" control={control} errors={errors} placeholder="Justification for Hiring" rows={3} />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <GalleryUpload
                                            currentValue={requisitionData?.attachment_ids}
                                            files={requisitionData?.attachments}
                                            inputName="attachment_ids"
                                            placeholder="Attach JD PDFs / docs / images"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>

                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="border-t border-dashed bg-gray-50/60 dark:bg-black/20 flex flex-wrap gap-2 justify-end">
                                            <FormButton isLoading={isSubmitting} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* (compensation block remains commented) */}
                    </div>

                    {/* ===== Right Panel (Publishing) ===== */}
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Publishing</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormCheckbox name="publish_on_approval" label="Publish automatically when approved" control={control} errors={errors} />
                                    </div>
                                    <div className="col-span-12">
                                        <FormInput type="date" name="application_deadline" control={control} errors={errors} placeholder="Application Deadline" label={false} />
                                    </div>
                                    <div className="col-span-12">
                                        <FormSelect isMulti name="channels" control={control} errors={errors} placeholder="Publishing Channels" options={channelOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {currentUser?.employee?.company?.name && (
                            <div className="box mt-4">
                                <div className="box-header">
                                    <div className="box-title">Company</div>
                                </div>
                                <div className="box-body">
                                    <div className="text-sm">{currentUser.employee.company.name}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* 🔹 Your existing JD modal wired in */}
            <JobDescFormModal
                isOpen={isJDModalOpen}
                onClose={() => setIsJDModalOpen(false)}
                jobDescData={null}                // Quick-create from requisition
                onSuccess={handleJDModalSuccess}  // auto-select newly created JD
            />
        </>
    );
};

export default RequisitionForm;
