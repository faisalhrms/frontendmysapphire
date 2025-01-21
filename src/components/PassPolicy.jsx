// src/components/PassPolicy.jsx

import React, { useState, useEffect } from "react";

const PassPolicy = ({ policyStatus, password }) => {
    // Local state to track if policy box is visible or not
    const [showTooltip, setShowTooltip] = useState(false);

    // Determine if *all* policy items are satisfied
    const allSatisfied = policyStatus.every((policy) => policy.satisfied);

    // Whenever the password changes, decide to show or hide the tooltip
    useEffect(() => {
        // If the user typed something but not all policies are satisfied, show the tooltip
        if (password.length > 0 && !allSatisfied) {
            setShowTooltip(true);
        } else {
            // If password is empty or everything is satisfied, hide it
            setShowTooltip(false);
        }
    }, [password, allSatisfied]);

    // If we're not supposed to show it, return nothing
    if (!showTooltip) {
        return null;
    }

    return (
        <div className="relative inline-block">
            {/* Tooltip */}
            <div className="absolute flex flex-col bg-white border border-gray-200 shadow-lg
           rounded-md p-4 text-sm text-gray-700 w-64 right-0 bottom-full mb-20 z-50">
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
                            />
                            {policy.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PassPolicy;
