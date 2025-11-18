import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../redux/authSlice';
import { useLoginMutation } from '../redux/authApi';
import loginSchema from '../../user/schemas/logInSchema.js';
import FormInput from '@components/form/FormInput';
import FormButton from '@components/form/FormButton';
import Notify from "@helpers/toastNotifications.js";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const userData = await login(data).unwrap();
            dispatch(setCredentials(userData));
            Notify.success('Login successful!');
        } catch (error) {
            if (error.data && error.data.message) {
                Notify.error(error.data.message);
            } else {
                Notify.error('An error occurred during login.');
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Sign in to continue to your account
                    </p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                        Email Address
                    </label>
                    <div className="relative group">
                        {/* Animated background glow */}
                        {focusedField === 'email' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl transition-opacity"></div>
                        )}

                        <FormInput
                            name="email"
                            control={control}
                            errors={errors}
                            placeholder="you@example.com"
                            label={false}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`relative w-full px-4 py-3.5 text-base border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 ${
                                errors.email
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                                    : focusedField === 'email'
                                        ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20 bg-white dark:bg-slate-800 shadow-lg shadow-blue-500/10'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                            Password
                        </label>
                        <Link
                            to="/resetpassword/"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline decoration-2 underline-offset-2"
                        >
                            Forgot?
                        </Link>
                    </div>

                    <div className="relative group">
                        {/* Animated background glow */}
                        {focusedField === 'password' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl transition-opacity"></div>
                        )}

                        <FormInput
                            label={false}
                            name="password"
                            control={control}
                            errors={errors}
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={`relative w-full pl-4 pr-12 py-3.5 text-base border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 ${
                                errors.password
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                                    : focusedField === 'password'
                                        ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20 bg-white dark:bg-slate-800 shadow-lg shadow-blue-500/10'
                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                        />

                        <button
                            type="button"
                            className="absolute top-3.5 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 z-10"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <svg
                                className="w-5 h-5 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {showPassword ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <FormButton
                        isLoading={isSubmitting}
                        text={
                            <span className="flex items-center justify-center gap-2.5 font-semibold text-base">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        }
                        className="group w-full py-4 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    />
                </div>
            </form>
        </div>
    );
};

export default LoginForm;