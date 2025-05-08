import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FileUpload from "@components/FileUpload.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { usePasswordPolicy } from "@hooks/passPolicyHooks.js";
import PassPolicy from "@components/PassPolicy.jsx";

import { createOtherUser } from "../services/userService.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {useUserForm} from "@modules/user/hooks/userHooks.js";
import {otherUserSchema} from "@modules/user/schemas/otherUserSchema.js";

const CreateUser = () => {
    const {
        password,
        handlePasswordChange,
        policyStatus,
    } = usePasswordPolicy("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(otherUserSchema),
        defaultValues: {
            password: "",
            full_name: "",
            email: "",
            phone: "",
            avatar: 0,
            group_ids: [],
            is_active: true
        },
    });
    const {  formErrors } = useUserForm(null);

    const onSubmit = async (data) => {
        try {
            const payload = {
                password: data.password,
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                avatar: data.avatar,
                group_ids: data.group_ids,
                is_active: data.is_active
            };

            await createOtherUser(payload);
            reset();
        } catch (err) {
            console.error("User creation failed:", err.message);
        }
    };

    return (
        <>
            <PageHeader currentpage="Add Other User" activepage="Users" mainpage="Add Other User" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">User Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FileUpload
                                            currentValue={0}
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
                                        <PassPolicy policyStatus={policyStatus} password={password}/>
                                    </div>

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
                                            isMulti={true}
                                            name="group_ids"
                                            control={control}
                                            errors={errors}
                                            placeholder="Roles"
                                            apiUrl="/select/roles/"
                                            queryKeyBase="roles"
                                            preselectedOptions={[]}
                                            errorMessage={formErrors?.group_ids?.[0]}
                                        />
                                    </div>

                                    <div className="col-span-12 flex items-center space-x-2">
                                        <Controller
                                            name="is_active"
                                            control={control}
                                            render={({field}) => (
                                                <div className="custom-toggle-switch flex items-center">
                                                    <input
                                                        id="toggleswitch_is_active"
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="toggleswitch_is_active"
                                                           className="label-info"></label>
                                                    <span className="ml-2">Is Active?</span>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateUser;
