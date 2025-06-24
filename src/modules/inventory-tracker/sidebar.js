import { generateSidebarItem } from "@helpers/formatters.js";

import {INVENTORY_TRACKER_ROUTES} from "@modules/inventory-tracker/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Inventory Tracker",
        11,
        "bi bi-collection",
        "",
        [
            generateSidebarItem(
                INVENTORY_TRACKER_ROUTES.ADD.path,
                "link",
                "Inventory Tracker",
                1,
                "bx bx-message-square-edit",
                INVENTORY_TRACKER_ROUTES.ADD.permission,
            ),



        ]
    )
];
