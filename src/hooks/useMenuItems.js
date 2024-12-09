import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useMenuItems = () => {
    const [initialMenuItems, setInitialMenuItems] = useState([]);
    const permissions = useSelector((state) => state.auth.permissions);

    useEffect(() => {
        const sidebarFiles = import.meta.glob('/src/modules/**/sidebar.js');

        const loadMenuItems = async () => {
            let items = [];

            for (const path in sidebarFiles) {
                const module = await sidebarFiles[path]();
                if (module.sidebarMenu) {
                    items.push(...module.sidebarMenu);
                }
            }

            setInitialMenuItems(items);
        };

        loadMenuItems();
    }, []);

    return useMemo(() => {
        return initialMenuItems
            .map((menuItem) => {
                const filteredChildren = (menuItem.children || []).filter(
                    (child) => !child.permission || permissions.includes(child.permission)
                );

                const hasChildrenWithPermission = menuItem.children?.length > 0 && filteredChildren.length > 0;
                const hasParentPermission = !menuItem.permission || permissions.includes(menuItem.permission);

                if (hasChildrenWithPermission || (!menuItem.children?.length && hasParentPermission)) {
                    return {
                        ...menuItem,
                        children: filteredChildren,
                    };
                }

                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a.position - b.position);
    }, [initialMenuItems, permissions]);
};

export default useMenuItems;
