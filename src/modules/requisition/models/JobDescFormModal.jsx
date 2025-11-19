// src/modules/requisition/modals/JobDescFormModal.jsx
import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "@modules/requisition/models/Modal.jsx";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import jobDescSchema from "@modules/requisition/schemas/jobDescSchema";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import SubFormSection from "@components/form/SubFormSection.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { useSelector } from "react-redux";
import { useJobDescForm } from "@modules/requisition/hooks/jobDescHooks.js";

const toNum = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
};
const numberOrNull = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const JobDescFormModal = ({ isOpen, onClose, jobDescData = null, onSuccess }) => {
    const isEditMode = Boolean(jobDescData?.id);
    const companyId = useSelector((state) => state?.auth?.user?.employee?.company?.id);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(jobDescSchema),
        defaultValues: {
            id: jobDescData?.id || undefined,
            position_title: jobDescData?.position_title || "",
            brief_role_overview: jobDescData?.brief_role_overview || "",
            company_id: jobDescData?.company?.id || companyId || null, // kept in state, not editable
            department_id: jobDescData?.department?.id || null,
            sub_department_id: jobDescData?.sub_department?.id || null,
            core_responsibilities:
                jobDescData?.core_responsibilities?.map((r) => ({
                    id: r.id,
                    sr_no: r.sr_no,
                    responsibility_name: r.responsibility_name,
                    weightage: r.weightage,
                    _delete: false,
                })) || [{ responsibility_name: "", weightage: 0 }],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "core_responsibilities",
        keyName: "_key",
    });

    const responsibilities = useWatch({ control, name: "core_responsibilities" });

    // Hook: create/update JD via service
    const { handleJobDescSubmit } = useJobDescForm(jobDescData, isEditMode, (resp) => onSuccess?.(resp));

    // totals / remaining
    const totalWeightage = useMemo(
        () => (responsibilities || []).reduce((sum, r) => sum + toNum(r?.weightage, 0), 0),
        [responsibilities]
    );
    const remainingWeightage = useMemo(() => 100 - totalWeightage, [totalWeightage]);
    const isTotalOk = Number(totalWeightage.toFixed(2)) === 100;

    // Pre-submit guidance message (always visible when total ≠ 100)
    const liveTotalMessage = useMemo(() => {
        const diff = 100 - Number(totalWeightage.toFixed(2));
        if (diff === 0) return null;
        if (diff > 0) return `Total weightage must equal 100.00 — currently ${totalWeightage.toFixed(2)} (short by ${diff.toFixed(2)}).`;
        return `Total weightage must equal 100.00 — currently ${totalWeightage.toFixed(2)} (over by ${Math.abs(diff).toFixed(2)}).`;
    }, [totalWeightage]);

    // numeric input behavior
    const positiveDecimalInputProps = (max = 100, idx = null) => ({
        onKeyDown: (e) => {
            if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
        },
        onInput: (e) => {
            if (e.target.value < 0) e.target.value = 0;
        },
        onChange: (e) => {
            let val = toNum(e.target.value, 0);
            const current = idx !== null ? toNum(responsibilities?.[idx]?.weightage, 0) : 0;
            const maxAllowed = current + Math.max(remainingWeightage, 0);
            val = clamp(val, 0, Math.min(max, maxAllowed));
            setValue(`core_responsibilities.${idx}.weightage`, val, { shouldValidate: true });
        },
    });

    // display Sr. No (auto)
    const viewSrNo = (visibleIndex) => visibleIndex + 1;

    // payload with re-sequenced sr_no (non-deleted only)
    const buildPayload = (form) => {
        let seq = 1;
        const resequenced = (form.core_responsibilities || []).map((r) => {
            const isDeleted = Boolean(r._delete);
            const sr_no = isDeleted ? r.sr_no ?? null : seq++;
            return {
                id: r.id || undefined,
                sr_no,
                responsibility_name: (r.responsibility_name || "").trim(),
                weightage: toNum(r.weightage, 0),
                _delete: isDeleted,
            };
        });

        return {
            id: form.id,
            position_title: (form.position_title || "").trim(),
            brief_role_overview: form.brief_role_overview || "",
            company_id: numberOrNull(companyId), // force from selector
            department_id: numberOrNull(form.department_id),
            sub_department_id: numberOrNull(form.sub_department_id),
            core_responsibilities: resequenced,
        };
    };

    const onSubmit = async (form) => {
        const payload = buildPayload(form);
        await handleJobDescSubmit(payload);
        onClose();
        reset();
    };

    // reset on open
    useEffect(() => {
        if (isOpen) {
            reset({
                id: jobDescData?.id || undefined,
                position_title: jobDescData?.position_title || "",
                brief_role_overview: jobDescData?.brief_role_overview || "",
                company_id: companyId ?? null, // always from selector
                department_id: jobDescData?.department?.id || null,
                sub_department_id: jobDescData?.sub_department?.id || null,
                core_responsibilities:
                    jobDescData?.core_responsibilities?.map((r) => ({
                        id: r.id,
                        sr_no: r.sr_no,
                        responsibility_name: r.responsibility_name,
                        weightage: r.weightage,
                        _delete: false,
                    })) || [{ responsibility_name: "", weightage: 0 }],
            });
        }
    }, [isOpen, jobDescData, reset, companyId]);

    // lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Zod array-level error can land at either errors.core_responsibilities.message
    // or errors.core_responsibilities.root.message depending on resolver internals.
    const arraySchemaError =
        errors?.core_responsibilities?.message ||
        errors?.core_responsibilities?.root?.message ||
        null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Job Description" : "Create Job Description"}
            width="max-w-5xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info (all fields col-3) */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="xl:col-span-4 col-span-12">
                        <FormInput
                            name="position_title"
                            label="Position Title"
                            placeholder="e.g., Assistant Store Manager"
                            control={control}
                            errors={errors}
                            is_required
                        />
                    </div>

                    <div className="xl:col-span-4 col-span-12">
                        <FormAsyncSelect
                            name="department_id"
                            label="Department"
                            is_required
                            control={control}
                            errors={errors}
                            placeholder="Select Department"
                            apiUrl="/select/departments"
                            queryKeyBase="departments"
                            clientSideSearch={true}
                            preselectedOptions={formatOptions(jobDescData, "department", "id", "name")}
                        />
                    </div>

                    <div className="xl:col-span-4 col-span-12">
                        <FormAsyncSelect
                            name="sub_department_id"
                            label="Sub Department"
                            control={control}
                            errors={errors}
                            placeholder="Select Sub Department"
                            apiUrl="/select/sub-departments"
                            queryKeyBase="sub-departments"
                            clientSideSearch={true}
                            preselectedOptions={formatOptions(jobDescData, "sub_department", "id", "name")}
                        />
                    </div>

                    <div className="xl:col-span-12 col-span-12">
                        <FormTextarea
                            name="brief_role_overview"
                            label="Brief Role Overview"
                            placeholder="Brief Role Overview"
                            control={control}
                            errors={errors}
                            rows={2}
                        />
                    </div>
                </div>

                {/* Core Responsibilities */}
                <SubFormSection title="Core Responsibilities">
                    {/* Zod schema-level array error (e.g., none active or total != 100 on submit) */}
                    {arraySchemaError && (
                        <div
                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                            role="alert"
                            aria-live="assertive"
                        >
                            <p className="text-sm text-red-800">{arraySchemaError}</p>
                        </div>
                    )}

                    {/* Live guidance (pre-submit) when total ≠ 100 */}
                    {!isTotalOk && (
                        <div
                            className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md"
                            role="status"
                            aria-live="polite"
                        >
                            <p className="text-sm text-amber-900">{liveTotalMessage}</p>
                        </div>
                    )}

                    {/* When user goes over 100, keep the specific red banner as before */}
                    {remainingWeightage < 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="assertive">
                            <p className="text-sm text-red-800">
                                Total weightage ({totalWeightage.toFixed(2)}) exceeds 100.00. Please reduce some rows.
                            </p>
                        </div>
                    )}

                    <div className="relative">
                        <table className="min-w-full divide-y divide-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            <thead className="bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                    Sr. No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                    Responsibility Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                    Weightage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                            {fields.map((item, idx) => {
                                const isMarkedDelete = Boolean(responsibilities?.[idx]?._delete);
                                return (
                                    <tr key={item._key || item.id || idx} className="hover:bg-gray-100">
                                        {/* Auto Sr.No (display only) */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block w-10 text-center font-semibold">
                          {viewSrNo(idx)}
                        </span>
                                        </td>

                                        {/* Responsibility Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <FormInput
                                                label={false}
                                                name={`core_responsibilities.${idx}.responsibility_name`}
                                                control={control}
                                                errors={errors}
                                                is_required={true}
                                                placeholder="e.g., Inventory Control"
                                                className="w-full"
                                                disabled={isMarkedDelete}
                                            />
                                        </td>

                                        {/* Weightage */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <FormInput
                                                label={false}
                                                name={`core_responsibilities.${idx}.weightage`}
                                                control={control}
                                                errors={errors}
                                                is_required={true}
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                {...positiveDecimalInputProps(100, idx)}
                                                disabled={isMarkedDelete}
                                            />
                                            {isMarkedDelete && (
                                                <div className="text-xs text-amber-600 mt-1">Marked for deletion</div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {item.id ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        update(idx, {
                                                            ...responsibilities[idx],
                                                            _delete: !responsibilities[idx]?._delete,
                                                        })
                                                    }
                                                    className={`ti-btn ti-btn-sm ${
                                                        isMarkedDelete ? "ti-btn-secondary" : "ti-btn-warning"
                                                    }`}
                                                    title={isMarkedDelete ? "Undo delete" : "Mark for delete"}
                                                >
                                                    <i className={isMarkedDelete ? "ri-arrow-go-back-line" : "ri-delete-bin-line"}></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(idx)}
                                                    className="ti-btn ti-btn-danger ti-btn-sm"
                                                    title="Remove row"
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {fields.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-muted py-6">
                                        No responsibilities yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>

                            {/* Remaining only */}
                            <tfoot className="bg-gray-50 font-semibold dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                <td colSpan={2} className="px-6 py-3 text-left">
                                    Remaining weightage
                                </td>
                                <td className="px-6 py-3">
                    <span className={`${remainingWeightage < 0 ? "text-red-600" : "text-gray-800"}`}>
                      {remainingWeightage.toFixed(2)}
                    </span>
                                </td>
                                <td></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    responsibility_name: "",
                                    weightage: 0,
                                })
                            }
                            className={`ti-btn ti-btn-secondary ti-btn-md ${
                                remainingWeightage <= 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title={remainingWeightage <= 0 ? "Total already at 100.00" : "Add a new responsibility row"}
                            disabled={remainingWeightage <= 0}
                        >
                            Add Responsibility
                        </button>
                    </div>
                </SubFormSection>

                {/* sticky footer */}
                <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200 px-2 py-3 mt-2">
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                            Cancel
                        </button>
                        <FormButton
                            isLoading={isSubmitting}
                            text={isEditMode ? "Update JD" : "Create JD"}
                            disabled={!isTotalOk || (isEditMode && !isDirty)}
                            className="ti-btn-primary"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

JobDescFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    jobDescData: PropTypes.object,
    onSuccess: PropTypes.func,
};

JobDescFormModal.defaultProps = {
    jobDescData: null,
    onSuccess: () => {},
};

export default JobDescFormModal;
