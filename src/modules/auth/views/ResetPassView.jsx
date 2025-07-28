import React, { useState } from 'react';
import {useForm, useWatch} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from '@components/form/FormInput';
import FormButton from '@components/form/FormButton';
import Notify from '@helpers/toastNotifications.js';

import resetPassSchema from '@modules/user/schemas/resetPassSchema.js';
import CoverPhoto from '@assets/images/authentication/new-cover-photo.jpeg';
import desktopLogoWhite from '@assets/images/brand-logos/desktop-logo.svg';
import {updateUser} from "@modules/auth/redux/authSlice.js";
import {useResetPasswordMutation} from "@modules/auth/redux/authApi.js";

const ResetPassView = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?.id);

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resetPassword] = useResetPasswordMutation();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(resetPassSchema),
        defaultValues: { newPassword: '', confirmPassword: '' },
    });

    const onSubmit = async ({ newPassword }) => {
        try {
            const response = await resetPassword({
                password: newPassword
            }).unwrap();

            const changedAt = response.data?.password_changed_at;
            if (changedAt) {
                dispatch(updateUser({ password_changed_at: changedAt }));
            }

            Notify.success('Password reset successful!');
            navigate(import.meta.env.BASE_URL, { replace: true });
        } catch (err) {
            Notify.error(err.data?.message || err.message || 'Failed to reset password.');
        }
    };

    const newPassword = useWatch({ control, name: "newPassword" });
    const passwordPolicies = [
        {
            id: 1,
            text: 'At least 8 characters',
            test: (pw) => pw?.length >= 8
        },
        {
            id: 2,
            text: 'At least one uppercase letter',
            test: (pw) => /[A-Z]/.test(pw)
        },
        {
            id: 3,
            text: 'At least one lowercase letter',
            test: (pw) => /[a-z]/.test(pw)
        },
        {
            id: 4,
            text: 'At least one number',
            test: (pw) => /\d/.test(pw)
        },
        {
            id: 5,
            text: 'At least one special character (@$!%*?&)',
            test: (pw) => /[@$!%*?&]/.test(pw)
        },
    ];


    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
            style={{ backgroundImage: `url(${CoverPhoto})` }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-md p-8 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg">
                {/* Logo */}
                <div className="mb-4 my-[0.5rem] flex justify-center">
                    <img src={desktopLogoWhite} alt="" className="authentication-brand desktop-logo"/>
                </div>
                <h6 className="text-xl font-semibold text-center mb-6">Set New Password</h6>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* New Password */}
                        <div>
                            <div className="relative">
                                <FormInput
                                    name="newPassword"
                                    control={control}
                                    errors={errors}
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                />
                                <span
                                    className="absolute top-1/2 right-3 transform -translate-y-1\/2 flex items-center cursor-pointer"
                                    onClick={() => setShowNew((s) => !s)}
                                >
                  <i className={`text-lg ${showNew ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i>
                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <FormInput
                                    name="confirmPassword"
                                    control={control}
                                    errors={errors}
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                />
                                <span
                                    className="absolute top-1/2 right-3 transform -translate-y-1\/2 flex items-center cursor-pointer"
                                    onClick={() => setShowConfirm((s) => !s)}
                                >
                  <i className={`text-lg ${showConfirm ? 'ri-eye-line' : 'ri-eye-off-line'}`}></i>
                </span>
                            </div>
                        </div>
                        {/* Password Policy Indicators */}
                        <div className="space-y-2 mt-4">
                            {passwordPolicies.map((policy) => {
                                const isValid = policy.test(newPassword);
                                return (
                                    <div
                                        key={policy.id}
                                        className="flex items-center gap-2"
                                    >
                                        <i
                                            className={`${
                                                isValid ? 'ri-check-line' : 'ri-close-line'
                                            } text-sm ${
                                                isValid ? 'text-emerald-500' : 'text-rose-500'
                                            } w-4 flex justify-center`}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {policy.text}
                                </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6">
                            <FormButton isLoading={isSubmitting} text="Reset Password" className="w-full" />
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ResetPassView;
