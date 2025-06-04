import React, { useEffect } from "react";
import FormSelect from "@components/form/FormSelect.jsx";
import { useForm } from "react-hook-form";
import {useUpdateStatus} from "@modules/recruitment/hooks/recruitmentHooks.js"; // Ensure this hook is implemented
const Statuses = [
    { label: "Recommended", value: "recommended" },
    { label: "Not Recommended", value: "not_recommended" },
    { label: "Park for the role", value: "park_for_the_role" },
    { label: "Blacklist", value: "blacklist" },
    { label: "Submitted", value: "submitted" },


];

const ApplicantStatusDropDown = ({ status, applicantId, refetch }) => {

    const { handleStatus, isLoading } = useUpdateStatus();

    const {
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            status,
        },
    });

    useEffect(() => {
        reset({ status });
    }, [status, applicantId, reset]);

    const handleStatusChange = async (newStatus) => {
        // Update the status for the given approval ID using your update hook
        await handleStatus(applicantId, newStatus);
        if (refetch) {
            refetch();
        }
    };

    return (
        <FormSelect
            label={false}
            name="status"
            control={control}
            errors={errors}
            options={Statuses}
            placeholder="Status"
            isClearable={false}
            onSelectChange={handleStatusChange}
            className="select-sm"
        />
    );
};

export default React.memo(ApplicantStatusDropDown);
