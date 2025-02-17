import { useEffect, useState } from 'react';

const useLoadRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const routeFiles = import.meta.glob('@modules/**/routes.js');

    useEffect(() => {
        const loadRoutes = async () => {
            const loadedRoutes = [];
            for (const path in routeFiles) {
                const routeModule = await routeFiles[path]();
                if (routeModule.MODULE_ROUTES) {
                    loadedRoutes.push(...routeModule.MODULE_ROUTES);
                }
            }
            setRoutes(loadedRoutes);
            setLoading(false);
        };

        loadRoutes();
    }, []);

    return { routes, loading };
};

export default useLoadRoutes;
