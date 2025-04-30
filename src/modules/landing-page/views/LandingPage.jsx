import  { FC, Fragment } from 'react';
import media80 from "../../../assets/images/media/media-80.svg";
import {useSelector} from "react-redux";

const Aboutus = () =>{
    const userData = useSelector((state) => state.auth.user);

   console.log(userData)
  return(
  <Fragment>
      <div className="about-container mb-6">
                    <div className="aboutus-banner">
                        <div className="aboutus-banner-content container">
                            <div className="grid grid-cols-12 sm:gap-x-6">
                                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                                    <div className="p-4 text-start mb-6">
                                        <h6 className="font-semibold text-white pb-6">
                                            <span className="about-heading-white text-[1rem]">Welcome To MySapphire</span>
                                        </h6>
                                        <h3 className="font-semibold mb-2 text-[1.75rem]">
                                            Empowering <span className="text-success">Teams</span> Deliver Smarter
                                        </h3>
                                        <p className="mb-6 font-normal opacity-[0.7] text-[1rem]">
                                           Whether you're managing service requests, tracking project progress, or cleaning messy data—we help you do it all from one centralized place.
                                        </p>
                                        <p className="mb-6 font-normal opacity-[0.7] text-[1rem]">
                                            Handle everything with discipline, focus, and speed.
                                        </p>
                                    </div>
                                </div>
                                <div className="xxl:col-span-6 xl:col-span-6 col-span-12 aboutus-img aboutus-banner-img">
                                    <img src={media80} className="img-fluid !w-full !h-[17.5rem] !z-[1]" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="!max-w-[40rem] !justify-center !mx-auto !items-center mb-[3rem]">
                        <div className="text-start">
                            <div className="text-defaulttextcolor !text-[1.625rem] font-semibold mb-6"><span className="about-heading">Our Mission</span></div>
                            <p className="text-[.875rem] mb-6 text-[#8c9097] dark:text-white/50">
                                Our goal is to simplify your digital workflow—from raising a service requests to completing a full-scale project. With built-in tools for team collaboration, automated data cleaning, and smart task tracking, we ensure your work gets done faster and better.
                            </p>
                        </div>
                    </div>
                    <div className="py-[3rem] px-4 bg-primary rounded-bottom">
                        <div className="grid grid-cols-12 !mx-auto">
                            <div className="xl:col-span-4 col-span-12"></div>
                            <div className="xl:col-span-4 col-span-12">
                                <div className="text-center">
                                    <h6 className="font-semibold text-white text-[1rem] pb-6 mb-0">
                                        <span className="about-heading-white">For any queries</span>
                                    </h6>
                                    <p className="font-semibold text-white !mb-4">
                                        Feel free to contact us any time
                                    </p>
                                </div>
                            </div>
                            <div className="xl:col-span-4 col-span-12"></div>
                        </div>
                    </div>
                </div>
  </Fragment>
);}

export default Aboutus;
