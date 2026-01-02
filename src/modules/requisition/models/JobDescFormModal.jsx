import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "@modules/requisition/models/Modal.jsx";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import jobDescSchema from "@modules/requisition/schemas/jobDescSchema";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { useSelector } from "react-redux";
import { useJobDescForm } from "@modules/requisition/hooks/jobDescHooks.js";
import FormRichTextarea from "../../../components/form/FormRichTextarea.jsx";

const numberOrNull = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

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
            company_id: jobDescData?.company?.id || companyId || null,
            department_id: jobDescData?.department?.id || null,
            sub_department_id: jobDescData?.sub_department?.id || null,
        },
    });

    // ✅ watch department_id
    const selectedDepartmentId = useWatch({ control, name: "department_id" });

    // ✅ prevent clearing sub_department on first open (edit mode)
    const prevDepartmentIdRef = useRef(null);

    useEffect(() => {
        // first run: just store current value
        if (prevDepartmentIdRef.current === null) {
            prevDepartmentIdRef.current = selectedDepartmentId ?? null;
            return;
        }

        // if department changed -> clear sub_department
        if (prevDepartmentIdRef.current !== (selectedDepartmentId ?? null)) {
            setValue("sub_department_id", null, { shouldValidate: true, shouldDirty: true });
            prevDepartmentIdRef.current = selectedDepartmentId ?? null;
        }
    }, [selectedDepartmentId, setValue]);

    const { handleJobDescSubmit } = useJobDescForm(jobDescData, isEditMode, (resp) => onSuccess?.(resp));

    const buildPayload = (form) => ({
        id: form.id,
        position_title: (form.position_title || "").trim(),
        brief_role_overview: form.brief_role_overview || "",
        company_id: numberOrNull(companyId),
        department_id: numberOrNull(form.department_id),
        sub_department_id: numberOrNull(form.sub_department_id),
    });

    const onSubmit = async (form) => {
        const payload = buildPayload(form);
        await handleJobDescSubmit(payload);
        onClose();
        reset();
    };

    // reset on open
    useEffect(() => {
        if (isOpen) {
            const depId = jobDescData?.department?.id || null;

            reset({
                id: jobDescData?.id || undefined,
                position_title: jobDescData?.position_title || "",
                brief_role_overview: jobDescData?.brief_role_overview || "",
                company_id: companyId ?? null,
                department_id: depId,
                sub_department_id: jobDescData?.sub_department?.id || null,
            });

            // ✅ sync ref so we don't clear sub_department immediately after reset
            prevDepartmentIdRef.current = depId;
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

    // ✅ build filtered sub-department endpoint
    const subDeptQuery = selectedDepartmentId ? `?department_id=${selectedDepartmentId}` : "";
    const subDeptApiUrl = `/select/sub-departments/${subDeptQuery}`;
    const subDeptQueryKey = `sub-departments-${selectedDepartmentId || "all"}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Job Description" : "Create Job Description"}
            width="max-w-5xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="xl:col-span-4 col-span-12">
                        <FormInput
                            name="position_title"
                            label="Position Title"
                            placeholder="Position Title"
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
                            apiUrl="/select/departments/"
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
                            placeholder={selectedDepartmentId ? "Select Sub Department" : "Select Department first"}
                            apiUrl={subDeptApiUrl}                  // ✅ filtered by department_id
                            queryKeyBase={subDeptQueryKey}          // ✅ unique cache key per department
                            clientSideSearch={true}
                            preselectedOptions={formatOptions(jobDescData, "sub_department", "id", "name")}
                            isDisabled={!selectedDepartmentId}      // ✅ disable until dept selected (if supported)
                            disabled={!selectedDepartmentId}        // ✅ fallback if your component uses disabled
                        />
                    </div>

                    <div className="xl:col-span-12 col-span-12">
                        <FormRichTextarea
                            name="brief_role_overview"
                            control={control}
                            errors={errors}
                            placeholder="Brief Role Overview"
                            is_required={true}
                            editorOptions={{
                                maxCharCount: 5000,
                                charCounter: true,
                                charCounterLabel: "Characters: ",
                            }}
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200 px-2 py-3 mt-2">
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                            Cancel
                        </button>
                        <FormButton
                            isLoading={isSubmitting}
                            text={isEditMode ? "Update JD" : "Create JD"}
                            disabled={isEditMode && !isDirty}
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
