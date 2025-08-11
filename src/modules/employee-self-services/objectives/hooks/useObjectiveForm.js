import {useEffect, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Notify from "@helpers/toastNotifications.js";
import api from "@config/axiosConfig.js";
import { useWatch } from 'react-hook-form';
import {useNavigate} from "react-router-dom";

export const OBJECTIVE_STATUS = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
};

const formSchema = z.object({
    objectives: z
        .array(
            z.object({
                kra: z.string().min(1, 'KRA is required'),
                kpi: z.string().min(1, 'KPI is required'),
                weightage: z.number()
                    .min(0.1, "Weightage must be at least 0.1%")
                    .max(100, "Weightage cannot exceed 100%"),
            })
        )
        .min(1, 'At least one objective is required')
});

export function useObjectiveForm(year = null, editMode = false) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [objectiveId, setObjectiveId] = useState(null);
    const navigate = useNavigate();


    const form = useForm({
        defaultValues: {
            objectives: [
                { kra: '', kpi: '', weightage: '' }
            ]
        },
        mode: 'onChange',
        resolver: zodResolver(formSchema)
    });

    const { fields, append, remove } = useFieldArray({
        name: 'objectives',
        control: form.control
    });

    const watchedObjectives = useWatch({
        control: form.control,
        name: 'objectives'
    });

    const getTotalWeightage = () => {
        return watchedObjectives.reduce((sum, item) => {
            const value = parseFloat(item.weightage);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
    };

    const isWeightageValid = getTotalWeightage() === 100;

    const validateOnSubmit = () => {
        return formSchema.safeParse(form.getValues());
    };

    const handleActionClick = () => {
        const parsed = validateOnSubmit();
        if (!parsed.success) return;
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (editMode && year) {
            (async () => {
                try {
                    const response = await api.get(`/hrms/objectives/edit/${year}/`);
                    const data = response.data?.data;
                    if (data) {
                        form.reset({ objectives: data.objectives });
                        setObjectiveId(data.id);
                    }
                } catch (error) {
                    Notify.error("Failed to load existing objective.");
                }
            })();
        }
    }, [editMode, year]);

    const onSaveDraft = async () => {
        setIsSubmitting(true);
        const parsed = formSchema.safeParse(form.getValues());
        if (!parsed.success) {
            Notify.error("Please fix the form errors before saving.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            year: year || new Date().getFullYear(),
            status: OBJECTIVE_STATUS.DRAFT,
            objectives: parsed.data.objectives
        };

        try {
            const url = editMode && objectiveId
                ? `/hrms/objectives/${objectiveId}/update/`
                : `/hrms/objectives/`;

            const method = editMode && objectiveId ? api.put : api.post;

            const response = await method(url, payload);
            Notify.success(response.data.message || "Saved as draft.");
            navigate(`/module/ess/objectives`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save draft.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitForApproval = async () => {
        setIsSubmitting(true);
        const parsed = validateOnSubmit();
        if (!parsed.success) {
            Notify.error("Total weightage must be 100%");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            year: year || new Date().getFullYear(),
            status: OBJECTIVE_STATUS.SUBMITTED,
            objectives: parsed.data.objectives
        };

        try {
            const url = editMode && objectiveId
                ? `/hrms/objectives/${objectiveId}/update/`
                : `/hrms/objectives/`;

            const method = editMode && objectiveId ? api.put : api.post;

            const response = await method(url, payload);
            setIsModalOpen(false);
            Notify.success(response.data.message || "Submitted for approval.");
            setTimeout(() => {
                navigate(`/module/ess/objectives`);
            }, 350)
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to submit.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        fields,
        append,
        remove,
        handleSubmit: form.handleSubmit,
        control: form.control,
        errors: form.formState.errors,
        getTotalWeightage,
        isWeightageValid,
        handleActionClick,
        onSubmitForApproval,
        onSaveDraft,
        isModalOpen,
        setIsModalOpen,
        isSubmitting,
    };
}
