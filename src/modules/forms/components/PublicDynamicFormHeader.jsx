import desktopLogoWhite from "@assets/images/brand-logos/desktop-logo.svg";
import React from "react";

const PublicDynamicFormHeader = ({title = '', description = '', border = 'border-[#673ab7]', type='form', currentStep, steps}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 mb-3">
            <div className={`border-t-8 rounded-t-lg ${border}`}>
                <div className="p-6">
                    <div className="mb-4 flex justify-center">
                        <img
                            src={desktopLogoWhite}
                            alt=""
                            className="authentication-brand desktop-logo w-[200px] h-[30px]"
                        />
                    </div>
                    <h1 className="text-2xl font-normal text-gray-800 mb-2">{title}</h1>
                    <p className={`text-${type === 'form' ? 'gray-600' : (type === 'success' ? 'success' : 'danger')}`}>{description}</p>
                    {
                        type === 'form' &&
                        <p className="text-xs text-danger mt-2">* Indicates Required Question</p>
                    }
                    {typeof currentStep === 'number' && steps?.length > 1 && type === 'form' && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                Step {currentStep + 1} of {steps.length}
                              </span>
                                <span>{steps?.[currentStep]?.title}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-[#673ab7] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default PublicDynamicFormHeader