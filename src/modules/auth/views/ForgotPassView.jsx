import { Helmet } from 'react-helmet';
import 'swiper/css';
import 'swiper/css/navigation';
import desktopLogoWhite from '@assets/images/brand-logos/desktop-logo.svg';
import desktopLogoBlack from '@assets/images/brand-logos/desktop-dark.svg';
import LoginSlider from "../components/LoginSlider.jsx";
import React from "react";
import { useParams } from "react-router-dom";
import ForgotPassword from "@modules/auth/components/ForgotPassword.jsx";
import ConfirmPassword from "@modules/auth/components/ConfirmPassword.jsx";

const ForgotPassView = () => {
  const { uidb64, token } = useParams();
  const isConfirm = uidb64 && token;

  return (
    <>
      <Helmet>
        <body className="bg-white dark:!bg-bodybg"></body>
      </Helmet>
      <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12">
          <div className="flex justify-center items-center h-full">
            <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="p-[1rem]">
                <div className="mb-4 my-[0.5rem] flex justify-center">
                  <img
                    src={desktopLogoWhite}
                    alt=""
                    className="authentication-brand desktop-logo"
                  />
                  <img
                    src={desktopLogoBlack}
                    alt=""
                    className="authentication-brand desktop-dark"
                  />
                </div>

                <div className="text-center my-[3rem] authentication-barrier">
                  <span>{ isConfirm ? "Confirm Password" : "Reset Password" }</span>
                </div>

                { isConfirm ? <ConfirmPassword /> : <ForgotPassword /> }
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
          <LoginSlider />
        </div>
      </div>
    </>
  );
};

export default ForgotPassView;
