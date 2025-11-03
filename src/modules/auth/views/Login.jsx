import { Helmet } from 'react-helmet';
import 'swiper/css';
import 'swiper/css/effect-creative';
import desktopLogoWhite from '@assets/images/brand-logos/desktop-logo.svg';
import desktopLogoBlack from '@assets/images/brand-logos/desktop-dark.svg';
import LoginForm from '../components/LoginForm';
import LoginSlider from "../components/LoginSlider.jsx";
import React, {useEffect} from "react";
import {useHasGroup, useIsAuthenticated} from "@modules/auth/hooks/authHooks.js";
import {useLocation, useNavigate} from "react-router-dom";
import {SELF_SERVICES_ROUTES} from "@modules/employee-self-services/routes.js";
import {landing_ROUTES} from "@modules/landing-page/routes.js";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const isEmployee = useHasGroup('employee');

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from?.pathname ||
          (isEmployee
              ? SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.path
              : landing_ROUTES.ABOUT_US.path);

      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isEmployee, location.state, navigate]);

  return (
      <>
        <Helmet>
          <body className="bg-white dark:!bg-bodybg"></body>
        </Helmet>

        <div className="min-h-screen flex flex-col lg:flex-row">

          {/* LEFT SIDE - Professional Image Slider */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-slate-900">
            {/* Main Slider */}
            <div className="relative w-full h-full">
              <LoginSlider />
            </div>

            {/* Bottom Brand Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Modern Login Form */}
          <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 lg:p-12 relative bg-white dark:bg-slate-900">

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}></div>

            {/* Main Form Container */}
            <div className="relative z-10 w-full max-w-md">

              {/* Logo */}
              <div className="text-center mb-12">
                <div className="items-center justify-center mb-6">
                    <img src={desktopLogoWhite} alt="" className="authentication-brand desktop-logo"/>
                    <img src={desktopLogoBlack} alt="" className="authentication-brand desktop-dark"/>
                </div>
              </div>

              {/* Login Form */}
              <LoginForm />

              {/* Footer Links */}
              <div className="mt-10 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure login with enterprise-grade encryption</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Having trouble?{' '}
                  <a
                      href="mailto:support@sapphire.com"
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Contact IT Support
                  </a>
                </p>
              </div>

            </div>

          </div>
        </div>
      </>
  );
};

export default Login;