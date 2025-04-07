import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { useParams } from "react-router-dom";  // To capture URL params
import { useUserManagementForm } from "@modules/user/hooks/userManagementHooks.js";  // Assuming you have a hook for submission
import { emailHost,booleanOptions } from "@modules/user/services/userService.js"; // Assuming email host comes from this service
import { formatOptions } from "@helpers/formatters.js";
import userManagementSchema from "@modules/user/schemas/userManagementSchema.js";

// New constant for Yes/No options


const UserManagementForm = ({ userData = {}, isEditMode = false }) => {
    const { id } = useParams();  // Capture the id from URL params

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(userManagementSchema),  // Assuming you have a user schema
        defaultValues: {
            ...userData,
            email_host: userData?.email_host || "",
            erp_user: userData?.erp_user ?? false,
            one_drive: userData?.one_drive ?? false,
            ms_team: userData?.ms_team ?? false,
            backup_storage: userData?.backup_storage || 0,
            subscription_ids: userData?.subscription_ids  || [],
        },
    });

    const { handleUserManagementSubmit } = useUserManagementForm(userData, isEditMode);

    useEffect(() => {
        if (userData) {
            Object.keys(userData).forEach((key) => {
                setValue(key, userData[key]);
            });
        }
    }, [userData, setValue]);
    const onSubmit = (data) => {
        if (!isEditMode && id) {
            // When isEditMode is false, add the user id to the data before submission
            data.user = parseInt(id);  // Add the employee ID (from the URL) to the data object
        }

        handleUserManagementSubmit(data);  // Submit data
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="md:col-span-12 sm:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">User Management Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">

                                {/* ---------- Email Host ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="email_host"
                                        control={control}
                                        errors={errors}
                                        placeholder="Email Host"
                                        options={emailHost}  // Static options
                                        isRequired={true}
                                    />
                                </div>

                                {/* ---------- ERP User ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="erp_user"
                                        control={control}
                                        errors={errors}
                                        label="ERP User"
                                        placeholder="ERP User"
                                        options={booleanOptions}
                                        isRequired={true}
                                    />
                                </div>

                                {/* ---------- One Drive ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="one_drive"
                                        control={control}
                                        errors={errors}
                                        placeholder="One Drive"
                                        label="One Drive"
                                        options={booleanOptions}
                                        isRequired={true}
                                    />
                                </div>

                                {/* ---------- MS Team ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect
                                        name="ms_team"
                                        control={control}
                                        errors={errors}
                                        placeholder="MS Team"
                                        label="MS Team"
                                        options={booleanOptions}
                                        isRequired={true}
                                    />
                                </div>

                                {/* ---------- Backup Storage ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="backup_storage"
                                        type="number"
                                        control={control}
                                        errors={errors}
                                        placeholder="Backup Storage"
                                    />
                                </div>

                                {/* ---------- Subscriptions ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="subscription_ids"
                                        control={control}
                                        errors={errors}
                                        placeholder="Subscriptions"
                                        isMulti={true}
                                        apiUrl="/select/subscriptions/"
                                        queryKeyBase="subscriptions"
                                        preselectedOptions={formatOptions(userData, "subscriptions")}
                                        isRequired={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                            <FormButton isLoading={isSubmitting} />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserManagementForm;
