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
        <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {routes.map(({ path, component, permission }) => {
                    const LazyComponent = React.lazy(component);
                    const uniqueKey = `${path}-${Math.random().toString(36).substr(2, 9)}`;
                    return (
                        <Route
                            key={uniqueKey}
                            path={path}
                            element={<ProtectedRoute element={LazyComponent} permission={permission} />}
                        />
                    );
                })}
                <Route path="*" element={<Navigate to="/error/404" />} />
            </Routes>
        </React.Suspense>
    );
};

export default AppRoutes;
