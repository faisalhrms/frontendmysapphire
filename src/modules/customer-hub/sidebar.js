import {generateSidebarItem} from "@helpers/formatters.js";
import {CUSTOMER_HUB_ROUTES, MASTER_DATA} from "@modules/customer-hub/routes.js";

export let sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Customer Hub",
        15,
        "bx-network-chart",
        "",
        [
            generateSidebarItem(
                CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.path,
                "link",
                'Customer Orders',
                1,
                "bx bx-message-square-edit",
                CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.permission
            ),
            generateSidebarItem(
                MASTER_DATA.READ.path,
                'link',
                'Master Data',
                1,
                "bx bx-message-square-edit",
                MASTER_DATA.READ.permission
            ),
            generateSidebarItem(
                CUSTOMER_HUB_ROUTES.INTEGRATIONS.HOME.path,
                "link",
                "Integrations",
                1,
                "bx bx-message-square-edit",
                CUSTOMER_HUB_ROUTES.INTEGRATIONS.HOME.permission
            ),

        ]
    ),
];
