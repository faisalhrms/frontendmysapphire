import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@components/ProtectedRoute.jsx';
import LoadingSpinner from '@components/LoadingSpinner.jsx';
import useLoadRoutes from "@hooks/useLoadRoutes.js";

const AppRoutes = () => {
    const { routes, loading } = useLoadRoutes();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Routes>
            {routes.map(({ path, component, permission }) => {
                const uniqueKey = `${path}-${Math.random().toString(36).substr(2, 9)}`;
                return (
                    <Route
                        key={uniqueKey}
                        path={path}
                        element={<ProtectedRoute element={component} permission={permission} />}
                    />
                );
            })}
            <Route path="*" element={<Navigate to="/error/404" />} />
        </Routes>
    );
};

export default AppRoutes;