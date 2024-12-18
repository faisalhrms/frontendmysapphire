// src/modules/user/components/CreateUser.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userCreateSchema from "@modules/user/schemas/userSchema.js";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FileUpload from "@components/FileUpload.jsx";
import { useUserForm } from "@modules/user/hooks/userHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

// The form submission function
const CreateUser = () => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            password: "",
            is_superuser: false,
            is_active: true,
            avatar: 0,
            employee: 0,
            group_ids: []
        }
    });

    const { handleUserSubmit, formErrors } = useUserForm(null); // Pass null as we are creating a new user

    const onSubmit = (data) => {
        // Handle form submission
        handleUserSubmit({
            password: data.password,
            is_superuser: data.is_superuser,
            is_active: data.is_active,
            avatar: data.avatar,
            employee: data.employee,
            group_ids: data.group_ids
        });
    };

    return (
        <>
            <PageHeader currentpage="Add User" activepage="Users" mainpage="Add User"/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    {/* Right side form fields for user creation */}
                    <div className="col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> User Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Avatar (File Upload) */}
                                    <div className="xl:col-span-12 col-span-12">
                                        <FileUpload
                                            currentValue={0}
                                            file={null}
                                            inputName="avatar"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="password"
                                            name="password"
                                            control={control}
                                            errors={errors}
                                            placeholder="Password"
                                        />
                                    </div>

                                    {/* Employee (LOV) */}
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormAsyncSelect
                                            name="employee"
                                            control={control}
                                            errors={errors}
                                            placeholder="Select Employee"
                                            apiUrl="/select/employees/"
                                            queryKeyBase="employees"
                                            isMulti={false}
                                            preselectedOptions={[]}
                                            errorMessage={formErrors?.employee?.[0]} // Display error if exists
                                        />
                                    </div>

                                    {/* Group IDs (Multi Select from Roles) */}
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormAsyncSelect
                                            isMulti={true}
                                            name="group_ids"
                                            control={control}
                                            errors={errors}
                                            placeholder="Roles"
                                            apiUrl="/select/roles/"
                                            queryKeyBase="roles"
                                            preselectedOptions={[]}
                                            errorMessage={formErrors?.group_ids?.[0]} // Display error if exists
                                        />
                                    </div>

                                    {/* is_superuser Toggle */}
                                    <div className="xl:col-span-12 col-span-12 flex items-center space-x-2">
                                        <Controller
                                            name="is_superuser"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="custom-toggle-switch flex items-center">
                                                    <input
                                                        id="toggleswitch_is_superuser"
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="toggleswitch_is_superuser" className="label-info"></label>
                                                    <span className="ml-2">Is Superuser?</span>
                                                </div>
                                            )}
                                        />
                                    </div>

                                    {/* is_active Toggle */}
                                    <div className="xl:col-span-12 col-span-12 flex items-center space-x-2">
                                        <Controller
                                            name="is_active"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="custom-toggle-switch flex items-center">
                                                    <input
                                                        id="toggleswitch_is_active"
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="toggleswitch_is_active" className="label-info"></label>
                                                    <span className="ml-2">Is Active?</span>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateUser;
