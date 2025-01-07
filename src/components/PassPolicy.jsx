// src/components/PassPolicy.jsx

import React from "react";

const PassPolicy = ({ policyStatus }) => {
    return (
        <div className="relative group inline-block">
            {/* Icon */}
            <span className="absolute right-3 bottom-6 cursor-pointer">
                <i className="ri-information-line text-2xl text-primary"></i>
            </span>
            {/* Tooltip */}
            <div className="absolute hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-md p-4 text-sm text-gray-700 w-64 right-0 mt-8 z-50">
                <p className="font-semibold text-gray-900 mb-2">Password Policies:</p>
                <ul>
                    {policyStatus.map((policy) => (
                        <li
                            key={policy.id}
                            className={`flex items-center gap-2 ${
                                policy.satisfied ? "text-green" : "text-red"
                            }`}
                        >
                            <i
                                className={`${
                                    policy.satisfied ? "ri-check-line" : "ri-close-line"
                                } text-lg`}
                            ></i>
                            {policy.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PassPolicy;
