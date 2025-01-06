import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {setCredentials} from '../redux/authSlice';
import {useLoginMutation} from '../redux/authApi';
import loginSchema from '../../user/schemas/logInSchema.js';
import FormInput from '@components/form/FormInput';
import FormButton from '@components/form/FormButton';
import Notify from "@helpers/toastNotifications.js";
import {PMS_ROUTES} from "@modules/project-management/routes.js";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

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
        navigate(PMS_ROUTES.PROJECT.READ.path);
    } catch (error) {
      if (error.data && error.data.message) {
          Notify.error( error.data.message);
      } else {
          Notify.error('An error occurred during login.');
      }
    }
  };


  return (
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-12 ">
          <div className="xl:col-span-12 rounded-lg col-span-12 mt-0">
            <FormInput
                name="email"
                control={control}
                errors={errors}
                placeholder="Email"
                label="Email"
            />
          </div>

          <div className="xl:col-span-12 col-span-12">
            <label htmlFor="signin-password" className="form-label mt-3 text-default block">Password
              <Link to={`/resetpassword/`} className="ltr:float-right rtl:float-left text-danger">
                Forget password?
              </Link>
            </label>
            <div className="input-group">
              <FormInput
                  label={false}
                  name="password"
                  control={control}
                  errors={errors}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="border bg-gray-50 pr-10" // Add right padding for space around the eye icon
              />
              {/* Eye icon to toggle password visibility */}
              <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer justify-center h-full"
                  onClick={togglePasswordVisibility}
              >
          <i className={`text-gray-500 text-lg ${showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}`} aria-hidden="true" />
        </span>
            </div>
          </div>


          <div className="xl:col-span-12 col-span-12 grid mt-4">
            <FormButton isLoading={isSubmitting} text="Sign In" className='' />
          </div>
        </div>
      </form>
  );
};

export default LoginForm;
