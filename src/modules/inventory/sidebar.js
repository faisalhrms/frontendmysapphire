import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {APPROVAL_ROUTES} from "@modules/approvals/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'IT Assets',
        6,
        'bx-box',
        '',
        [
            generateSidebarItem(
                INVENTORY_ROUTES.HOME.path,
                'link',
                'Assets List',
                1,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            ),
            generateSidebarItem(
                INVENTORY_ROUTES.LAPTOP_LIST.path,
                'link',
                'Laptop List',
                2,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            ),

            generateSidebarItem(
                INVENTORY_ROUTES.EQUIPMENT_SITE_WISE.path,
                'link',
                'Site Wise List',
                3,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            ),




            generateSidebarItem(
                INVENTORY_ROUTES.EQUIPMENT_REPORT.path,
                'link',
                'Assets Report',
                4,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            )

        ]



    )
];
