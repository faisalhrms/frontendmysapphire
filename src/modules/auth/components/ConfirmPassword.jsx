import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Link, useNavigate, useParams} from 'react-router-dom'
import FormInput from '@components/form/FormInput'
import FormButton from '@components/form/FormButton'
import Notify from '@helpers/toastNotifications.js'
import confirmSchema from '@modules/user/schemas/confirmSchema.js'

const ConfirmPassword = () => {
  const { uidb64, token } = useParams()
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(confirmSchema),
    defaultValues: { password: '' },
  })

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
        <FormInput name="password" control={control} errors={errors} placeholder="New Password" label="New Password"/>

        <div className="xl:col-span-12 col-span-12 mb-4">
          <label htmlFor="signin-password" className="form-label text-default block"><Link
              to={`${import.meta.env.BASE_URL}`}
              className="ltr:float-right rtl:float-left text-danger">Remember password ?</Link></label>
        </div>

        <FormButton isLoading={isSubmitting} text="Update Password"/>
      </form>
  )
}

export default ConfirmPassword
