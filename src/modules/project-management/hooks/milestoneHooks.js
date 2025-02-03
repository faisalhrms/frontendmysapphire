import {
    createMilestone,
    getMilestoneById,
    updateMilestone
} from "@modules/project-management/services/milestoneService.js";
import {zodResolver} from "@hookform/resolvers/zod";
import milestoneSchema from "@modules/project-management/schemas/milestoneSchema.js";
import {useForm} from "react-hook-form";    
import {useEffect, useState} from "react";

const useMilestoneForm = (isEditMode = false) => {
    const handleMilestoneSubmit = async (id, milestoneData) => {
        try {
            return isEditMode
                ? await updateMilestone(id, milestoneData)
                : await createMilestone(id, milestoneData);
        } catch (error) {
            return { status: false, message: error.message };
        }
    };

    return { handleMilestoneSubmit };
};

export const useMilestoneModal = (refetch) => {
    const [id, setId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { handleMilestoneSubmit } = useMilestoneForm(isEditMode);
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(milestoneSchema),
        defaultValues: {
            status: "active",
            priority: "medium",
            description: "",
        }
    });

    // Fetch the milestone data if in edit mode
    useEffect(() => {
        const fetchMilestone = async () => {
            if (isEditMode && id) {
                try {
                    const data = await getMilestoneById(id);
                    reset(data);
                } catch (err) {
                    console.error("Error fetching task:", err.message);
                }
            }
        };
        fetchMilestone();
    }, [id, isEditMode, reset]);

    const openMilestoneModal = (id = null, isEditMode = false, approval = false) => {
        setId(id);
        setIsEditMode(isEditMode);
        if (!isEditMode) {
            reset({
                status: "active",
                priority: "medium",
                description: "",
                requires_approval: approval
            });
        }
        const modal = document.getElementById('milestoneModal');
        if (modal) {
            window.HSOverlay.open(modal);
        }
    };

    // Close modal and reset form
    const closeMilestoneModal = () => {
        const modal = document.getElementById('milestoneModal');
        if (modal) {
            window.HSOverlay.close(modal);
        }
        reset();
    };

    // Handle form submission
    const onSubmitMilestone = async (data) => {
       const response = await handleMilestoneSubmit(id, data);
       if (response.data){
           closeMilestoneModal();
           refetch();
       }
    };

    return {
        openMilestoneModal,
        closeMilestoneModal,
        controlMilestone : control,
        errorsMilestone : errors,
        isSubmittingMilestone : isSubmitting,
        handleSubmitMilestone : handleSubmit,
        onSubmitMilestone,
        isMilestoneEditMode: isEditMode,

    };
};
