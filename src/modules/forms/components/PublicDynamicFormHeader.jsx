import React, {useEffect} from "react";
import sapphirew from "@assets/images/company-logos/sapphirew.png";
import sapphireb from "@assets/images/company-logos/sapphireb.png";

import useDarkMode from "@redux/common/useDarkMode.js";


const PublicDynamicFormHeader = ({
                                     title = '',
                                     description = '',
                                     color = '#673ab7',
                                     type = 'form',
                                     currentStep,
                                     steps,
                                     socialLinks = [],
                                     fontFamily,
                                 }) => {

    const getPlatformIconClass = (platform) => {
        const remixMap = {
            facebook: 'ri-facebook-fill',
            twitter: 'ri-twitter-fill',
            linkedin: 'ri-linkedin-fill',
            instagram: 'ri-instagram-line',
            whatsapp: 'ri-whatsapp-line',
            youtube: 'ri-youtube-fill',
            telegram: 'ri-telegram-line',
            website: 'ri-global-line',
            other: 'ri-links-line',
        };
        return remixMap[platform] || 'ri-links-line';
    }
    const isDark = useDarkMode();

    return (<div className="bg-white rounded-lg border border-gray-200 mb-3 dark:text-gray-200 dark:bg-bodybg"
                 style={{ fontFamily }}>
            <div className="border-t-8 rounded-t-lg dark:text-gray-200 dark:bg-bodybg" style={{borderTopColor: color}}>
                <div className="p-6">
                    <div className="mb-4 flex justify-center">
                        <img
                            src={isDark ? sapphirew : sapphireb}
                            alt=""
                            className="authentication-brand desktop-logo w-[200px] h-[30px]"
                        />
                    </div>

                    <h1 className="text-2xl font-normal text-gray-800 mb-2 text-center dark:text-gray-200 dark:bg-bodybg">{title}</h1>

                    <p className={`text-center dark:text-gray-200 dark:bg-bodybg text-${type === 'form' ? 'gray-600' : (type === 'success' ? 'success' : 'danger')}`}>
                        {description}
                    </p>
                    {type === 'success' && socialLinks?.length > 0 && (
                        <div className="fti-btn-list space-x-2 mt-6 text-center">
                            {socialLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.platform}
                                    className={`ti-btn ti-btn-icon ti-btn-${link.platform} ti-btn-wave ${
                                        link.platform !== "linkedin" ? "!rounded-full" : ""
                                    }`}

                                >
                                    <i className={getPlatformIconClass(link.platform)}></i>
                                </a>
                            ))}
                        </div>
                    )}


                    {type === 'form' && (<p className="text-xs text-danger mt-2">* Indicates Required Question</p>)}

                    {typeof currentStep === 'number' && steps?.length > 1 && type === 'form' && (<div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-200 dark:bg-bodybg">
                                <span>Step {currentStep + 1} of {steps.length}</span>
                                <span>{steps?.[currentStep]?.title}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:text-gray-200 dark:bg-bodybg">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${((currentStep + 1) / steps.length) * 100}%`, backgroundColor: color
                                    }}
                                />
                            </div>
                        </div>)}
                </div>
            </div>
        </div>);
};

export default React.memo(PublicDynamicFormHeader);
