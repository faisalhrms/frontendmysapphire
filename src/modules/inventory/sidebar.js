import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {APPROVAL_ROUTES} from "@modules/approvals/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'IT Equipments',
        6,
        'bx-box',
        '',
        [

            generateSidebarItem(
                INVENTORY_ROUTES.LAPTOP_LIST.path,
                'link',
                'Laptop List',
                1,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            ),
            generateSidebarItem(
                INVENTORY_ROUTES.READ.path,
                'link',
                'Equipments List',
                2,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            ),


            generateSidebarItem(
                INVENTORY_ROUTES.EQUIPMENT_REPORT.path,
                'link',
                'Equipments Report',
                3,
                'bx-laptop',
                INVENTORY_ROUTES.READ.permission
            )

        ]



    )
];
