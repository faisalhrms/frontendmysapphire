import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useHasPermission, useIsAuthenticated } from "@modules/auth/hooks/authHooks.js";

const ProtectedRoute = ({ element: Element, permission }) => {
    const isAuthenticated = useIsAuthenticated();
    const hasPermission = useHasPermission(permission);

    if (!isAuthenticated) {
        return <Navigate to={`${import.meta.env.BASE_URL}`} />;
    }

    if (hasPermission === null) {
        return <LoadingSpinner />;
    }


    if (permission && !hasPermission) {
        return <Navigate to="/error/403" />;
    }

    return (
        <>
            <Element />
        </>
    );
};

export default ProtectedRoute;
