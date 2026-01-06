import React, { useEffect, useRef, useState } from "react";
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
import { getJobDesc } from "@modules/requisition/services/jobDescService.js";

const numberOrNull = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

const JobDescFormModal = ({ isOpen, onClose, jobDescData = null, onSuccess }) => {
    const isEditMode = Boolean(jobDescData?.id);
    const companyId = useSelector((state) => state?.auth?.user?.employee?.company?.id);

    // ✅ fetched full detail for edit
    const [fullJD, setFullJD] = useState(null);
    const [loadingJD, setLoadingJD] = useState(false);

    // ✅ use fetched jd if available
    const currentJD = fullJD || jobDescData;

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(jobDescSchema),
        defaultValues: {
            id: currentJD?.id || undefined,
            position_title: currentJD?.position_title || "",
            brief_role_overview: currentJD?.brief_role_overview || "",
            company_id: currentJD?.company?.id || companyId || null,
            department_id: currentJD?.department?.id || null,
            sub_department_id: currentJD?.sub_department?.id || null,
        },
    });

    // ✅ watch department_id
    const selectedDepartmentId = useWatch({ control, name: "department_id" });

    // ✅ prevent clearing sub_department on first open (edit mode)
    const prevDepartmentIdRef = useRef(null);

    useEffect(() => {
        if (prevDepartmentIdRef.current === null) {
            prevDepartmentIdRef.current = selectedDepartmentId ?? null;
            return;
        }

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
        setFullJD(null);
        onClose();
        reset();
    };

    // ✅ Fetch + reset on open (Edit uses GET single endpoint)
    useEffect(() => {
        if (!isOpen) return;

        let alive = true;

        const run = async () => {
            // Create mode
            if (!isEditMode || !jobDescData?.id) {
                setFullJD(null);

                reset({
                    id: undefined,
                    position_title: "",
                    brief_role_overview: "",
                    company_id: companyId ?? null,
                    department_id: null,
                    sub_department_id: null,
                });

                prevDepartmentIdRef.current = null;
                return;
            }

            // Edit mode -> fetch full detail
            setLoadingJD(true);
            try {
                const data = await getJobDesc(jobDescData.id);
                if (!alive) return;

                setFullJD(data);

                const depId = data?.department?.id || null;

                reset({
                    id: data?.id || undefined,
                    position_title: data?.position_title || "",
                    brief_role_overview: data?.brief_role_overview || "",
                    company_id: data?.company?.id || companyId || null,
                    department_id: depId,
                    sub_department_id: data?.sub_department?.id || null,
                });

                // ✅ sync ref so we don't clear sub_department immediately after reset
                prevDepartmentIdRef.current = depId;
            } finally {
                if (alive) setLoadingJD(false);
            }
        };

        run();

        return () => {
            alive = false;
        };
    }, [isOpen, isEditMode, jobDescData?.id, reset, companyId]);

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
            onClose={() => {
                setFullJD(null);
                onClose();
            }}
            title={isEditMode ? "Edit Job Description" : "Create Job Description"}
            width="max-w-5xl"
        >
            {loadingJD ? (
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full" />
                        <span className="text-sm text-gray-600">Loading job description...</span>
                    </div>
                </div>
            ) : (
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
                                preselectedOptions={formatOptions(currentJD, "department", "id", "name")}
                            />
                        </div>

                        <div className="xl:col-span-4 col-span-12">
                            <FormAsyncSelect
                                name="sub_department_id"
                                label="Sub Department"
                                control={control}
                                errors={errors}
                                placeholder={selectedDepartmentId ? "Select Sub Department" : "Select Department first"}
                                apiUrl={subDeptApiUrl}
                                queryKeyBase={subDeptQueryKey}
                                clientSideSearch={true}
                                preselectedOptions={formatOptions(currentJD, "sub_department", "id", "name")}
                                isDisabled={!selectedDepartmentId}
                                disabled={!selectedDepartmentId}
                            />
                        </div>

                        <div className="xl:col-span-12 col-span-12">
                            <FormRichTextarea
                                name="brief_role_overview"
                                control={control}
                                errors={errors}
                                placeholder="Brief Role Overview"
                                is_required={true}
                                height="380px"
                                contentPadding="12px 14px 60px"
                                containerClassName="mb-6"
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
                            <button
                                type="button"
                                onClick={() => {
                                    setFullJD(null);
                                    onClose();
                                }}
                                className="ti-btn ti-btn-light ti-btn-wave"
                            >
                                Cancel
                            </button>

                            <FormButton
                                isLoading={isSubmitting}
                                text={isEditMode ? "Update JD" : "Create JD"}
                                disabled={(isEditMode && !isDirty) || isSubmitting}
                                className="ti-btn-primary"
                            />
                        </div>
                    </div>
                </form>
            )}
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
