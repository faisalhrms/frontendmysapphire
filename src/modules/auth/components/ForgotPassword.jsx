import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Link, useNavigate} from 'react-router-dom'
import FormInput from '@components/form/FormInput'
import FormButton from '@components/form/FormButton'
import Notify from '@helpers/toastNotifications.js'
import resetSchema from '@modules/user/schemas/resetschema.js'

const ForgotPasswordForm = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  })

const onSubmit = async (data) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      Notify.error(errorData.message || 'An error occurred during the password reset process.');
      return;
    }

    Notify.success('Password reset email sent successfully.');
  } catch (error) {
    Notify.error('A network error occurred. Please try again.');
  }
};


  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput name="email" control={control} errors={errors} placeholder="Email" label="Email"/>

        <div className="xl:col-span-12 col-span-12 mb-4">
          <label htmlFor="signin-password" className="form-label text-default block"><Link
              to={`${import.meta.env.BASE_URL}`}
              className="ltr:float-right rtl:float-left text-danger">Remember password ?</Link></label>
        </div>

        <FormButton isLoading={isSubmitting} text="Send Reset Email"/>
      </form>
  )
}

export default ForgotPasswordForm
