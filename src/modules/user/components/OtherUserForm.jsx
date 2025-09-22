// @modules/user/components/OtherUserForm.jsx
import React, {useEffect, useMemo} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FileUpload from "@components/FileUpload.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import PassPolicy from "@components/PassPolicy.jsx";

import { usePasswordPolicy } from "@hooks/passPolicyHooks.js";
import { otherUserSchema } from "@modules/user/schemas/otherUserSchema.js";
import {createOtherUser, updateOtherUser, updateUser} from "@modules/user/services/userService.js";
import {formatOptions} from "@helpers/formatters.js";

const OtherUserForm = ({ userData = null }) => {
    const isEditMode = Boolean(userData);
    const navigate = useNavigate();
    const { password, handlePasswordChange, policyStatus } = usePasswordPolicy("");
    const formattedGroups  = useMemo(() => formatOptions(userData, "groups", "id", "name"), [userData]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(otherUserSchema),
        defaultValues: {
            password: "",
            full_name: "",
            email: "",
            phone: "",
            avatar: 0,
            group_ids: [],
            is_active: true,
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (isEditMode) {
            reset({
                password: "",
                full_name: userData.full_name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                avatar: userData.avatar || null,
                group_ids: userData.group_ids || [],
                is_active: userData.is_active ?? true,
            });
        }
    }, [isEditMode, userData, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                avatar: data.avatar,
                group_ids: data.group_ids,
                is_active: data.is_active,
            };

            if (isEditMode) {
                // only send password if entered
                if (data.password) payload.password = data.password;
                await updateOtherUser(userData.id, payload);
            } else {
                payload.password = data.password;
                await createOtherUser(payload);
            }

            navigate("/module/users/others");
        } catch (err) {
            console.error("User save failed:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                {isEditMode ? "Edit User Info" : "User Info"}
                            </div>
                        </div>

                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12">
                                    <FileUpload
                                        currentValue={userData?.avatar || 0}
                                        file={null}
                                        inputName="avatar"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                <div className="col-span-3 relative">
                                    <FormInput
                                        name="full_name"
                                        control={control}
                                        errors={errors}
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="col-span-3 relative">
                                    <FormInput
                                        name="email"
                                        control={control}
                                        errors={errors}
                                        placeholder="Email"
                                    />
                                </div>

                                {!isEditMode && (
                                    <div className="col-span-3 relative">
                                        <FormInput
                                            type="password"
                                            name="password"
                                            control={control}
                                            errors={errors}
                                            placeholder="Password"
                                            onChange={(e) => {
                                                handlePasswordChange(e);
                                                setValue("password", e.target.value);
                                            }}
                                            value={password}
                                        />
                                        <PassPolicy policyStatus={policyStatus} password={password} />
                                    </div>
                                )}

                                {isEditMode && (
                                    <div className="col-span-3 relative">
                                        <FormInput
                                            type="password"
                                            name="password"
                                            control={control}
                                            errors={errors}
                                            placeholder="New Password (optional)"
                                            onChange={(e) => {
                                                handlePasswordChange(e);
                                                setValue("password", e.target.value);
                                            }}
                                            value={password}
                                        />
                                        <PassPolicy policyStatus={policyStatus} password={password} />
                                    </div>
                                )}

                                <div className="col-span-3 relative">
                                    <FormInput
                                        name="phone"
                                        control={control}
                                        errors={errors}
                                        placeholder="Phone"
                                    />
                                </div>

                                <div className="xl:col-span-3 col-span-12">
                                    <FormAsyncSelect
                                        isMulti
                                        name="group_ids"
                                        control={control}
                                        errors={errors}
                                        placeholder="Roles"
                                        apiUrl="/select/roles/"
                                        queryKeyBase="roles"
                                        preselectedOptions={formattedGroups}
                                    />
                                </div>

                                <div className="col-span-12 flex items-center space-x-2">
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
                                                <label
                                                    htmlFor="toggleswitch_is_active"
                                                    className="label-info"
                                                ></label>
                                                <span className="ml-2">Is Active?</span>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                            <FormButton
                                isLoading={isSubmitting}
                                label={isEditMode ? "Update User" : "Create User"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default OtherUserForm;
