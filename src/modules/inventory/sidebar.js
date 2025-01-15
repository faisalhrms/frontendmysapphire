import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {APPROVAL_ROUTES} from "@modules/approvals/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'IT Equipments',
        6,
        'bx-cog',
        '',
        [
            generateSidebarItem(
                INVENTORY_ROUTES.READ.path,
                'link',
                'Equipments List',
                5,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            )

        ]



    )
];
