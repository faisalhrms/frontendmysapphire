import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const useMenuItems = () => {
    const [initialMenuItems, setInitialMenuItems] = useState([]);
    const permissions = useSelector((state) => state.auth.permissions);

    useEffect(() => {
        const sidebarFiles = import.meta.glob("@modules/**/sidebar.js");

        const loadMenuItems = async () => {
            let items = [];

            for (const path in sidebarFiles) {
                const module = await sidebarFiles[path]();
                if (typeof module.initializeSidebar === "function") {
                    await module.initializeSidebar();
                }
                if (module.sidebarMenu) {
                    items.push(...module.sidebarMenu);
                }
            }

            setInitialMenuItems(items);
        };

        loadMenuItems();
    }, []);

    const filterMenuItems = (items) => {
        return items
            .map((item) => {
                let filteredChildren = [];
                if (item.children?.length) {
                    filteredChildren = filterMenuItems(item.children);
                }

                const hasChildrenWithPermission =
                    item.children?.length > 0 && filteredChildren.length > 0;
                const hasParentPermission =
                    !item.permission || permissions.includes(item.permission);

                if (hasChildrenWithPermission || (!item.children?.length && hasParentPermission)) {
                    return {
                        ...item,
                        children: filteredChildren,
                    };
                }

                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a.position - b.position);
    };

    return useMemo(() => {
        return filterMenuItems(initialMenuItems);
    }, [initialMenuItems, permissions]);
};

export default useMenuItems;
