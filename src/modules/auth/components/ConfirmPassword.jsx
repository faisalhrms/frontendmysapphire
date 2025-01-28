import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormInput from '@components/form/FormInput';
import FormButton from '@components/form/FormButton';
import Notify from '@helpers/toastNotifications.js';
import confirmSchema from '@modules/user/schemas/confirmSchema.js';
import { usePasswordPolicy } from '@hooks/passPolicyHooks.js';
import PassPolicy from '@components/PassPolicy.jsx';

const ConfirmPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  // Use form hook for handling form validation and submission
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: { password: '' },
  });

  // Initialize password policy tracking
  const {
    password,
    handlePasswordChange,
    policyStatus,
  } = usePasswordPolicy('');

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/${uidb64}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        Notify.error(errorData.message || 'An error occurred while resetting the password.');
        return;
      }
      Notify.success('Password updated successfully.');
      navigate('/login');
    } catch (error) {
      Notify.error('A network error occurred. Please try again.');
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="xl:col-span-12 col-span-12">
          {/* Password Input with Real-time Validation */}
          <FormInput
              type="password"
              name="password"
              control={control}
              errors={errors}
              placeholder="New Password"
              label="New Password"
              onChange={(e) => {
                handlePasswordChange(e);   // Track password changes
                setValue('password', e.target.value);
              }}
              value={password}
          />

          {/* PassPolicy Component for real-time password validation feedback */}
          <PassPolicy policyStatus={policyStatus} password={password} />
        </div>

        <div className="xl:col-span-12 col-span-12 mb-4">
          <label htmlFor="signin-password" className="form-label text-default block">
            <Link to={`${import.meta.env.BASE_URL}`} className="ltr:float-right rtl:float-left text-danger">
              Remember password?
            </Link>
          </label>
        </div>

        <FormButton isLoading={isSubmitting} text="Update Password" />
      </form>
  );
};

export default ConfirmPassword;
