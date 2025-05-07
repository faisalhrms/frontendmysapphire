import {useQuery} from "@tanstack/react-query";
import {fetchPermissions} from "@modules/auth/services/authService.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo} from "react";
import {setPermissions} from "@modules/auth/redux/authSlice.js";

export const usePermissions = (userId) => {
    const dispatch = useDispatch();

    const { data: permissions = [], refetch, isLoading } = useQuery({
        queryKey: ['authPermissions', userId],
        queryFn: fetchPermissions,
        refetchInterval: 300 * 1000,
        enabled: !!userId,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (permissions.length) {
            dispatch(setPermissions(permissions));
        }
    }, [permissions, dispatch]);

    return { permissions: Array.isArray(permissions) ? permissions : [], refetch, isLoading };
};

export const useHasPermission = (permission) => {
    const userId = useSelector((state) => state.auth.user?.id);
    const { permissions, isLoading } = usePermissions(userId);

    return useMemo(() => {
        if (isLoading) return null;
        return permissions.includes(permission);
    }, [permissions, permission, isLoading]);
};

export const useHasGroup = (group) => {
    const groups = useSelector((state) => state.auth.user?.groups);
    return groups?.some(g => g.name === group);
};

export const useIsAuthenticated = () => {
    const token = useSelector((state) => state.auth.tokens?.access_token);
    const expiresAt = useSelector((state) => state.auth.tokens?.access_token_expires);

    const storedTokens = localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : {};
    const storedToken = token || storedTokens.access_token; // Safe access with optional chaining
    const storedExpiresAt = expiresAt || storedTokens.access_token_expires; // Safe access with optional chaining

    const isExpired = useMemo(() => {
        return storedExpiresAt ? Date.now() > new Date(storedExpiresAt).getTime() : true;
    }, [storedExpiresAt]);
    return !!storedToken && !isExpired;
};