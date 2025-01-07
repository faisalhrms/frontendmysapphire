// src/hooks/passPolicyHooks.js

import { useState, useEffect } from "react";

const passwordPolicies = [
    { id: 1, text: "At least 8 characters long", regex: /.{8,}/ },
    { id: 2, text: "At least one uppercase letter", regex: /[A-Z]/ },
    { id: 3, text: "At least one lowercase letter", regex: /[a-z]/ },
    { id: 4, text: "At least one number", regex: /\d/ },
    { id: 5, text: "At least one special character (@$!%*?&)", regex: /[@$!%*?&]/ },
];

export const usePasswordPolicy = (initialPassword = "") => {
    const [password, setPassword] = useState(initialPassword);
    const [policyStatus, setPolicyStatus] = useState(
        passwordPolicies.map((policy) => ({ ...policy, satisfied: false }))
    );

    useEffect(() => {
        setPolicyStatus(
            passwordPolicies.map((policy) => ({
                ...policy,
                satisfied: policy.regex.test(password),
            }))
        );
    }, [password]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return { password, handlePasswordChange, policyStatus };
};
