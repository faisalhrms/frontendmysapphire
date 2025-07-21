import React, {useState} from "react";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import FormButton from "@components/form/FormButton.jsx";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import useBodyScrollLock from "@hooks/useBodyScrollLock.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
const remarksSchema = z.object({
    remarks: z.string().min(1, "Remarks are required").max(1000),
});

const ProjectRemarksModal = ({ isOpen, onClose, project }) => {
    useBodyScrollLock(isOpen);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(remarksSchema),
        defaultValues: {
            remarks: project?.remarks || "",
        },
    });

    React.useEffect(() => {
        reset({ remarks: project?.remarks || "" });
    }, [project, reset]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await api.put(`/pms/projects/${project.id}/remarks/`, { remarks: data.remarks });
            Notify.success("Remarks updated successfully.");
            onClose(true);
        } catch (error) {
            console.error(error);
            Notify.error("Failed to update remarks.");
        }finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h3 className="text-lg font-semibold mb-4">{project?.remarks ? 'Edit' : 'Add'} Remarks</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormTextarea
                        name="remarks"
                        control={control}
                        errors={errors}
                        placeholder='Enter Remarks'
                        needLabel={false}
                        is_required={true}
                        rows={5}
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="ti-btn ti-btn-outline-secondary m-2"
                        >
                            Cancel
                        </button>
                        <FormButton isLoading={isLoading} text='Save Remarks'/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectRemarksModal;
