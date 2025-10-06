import {generateSidebarItem} from "@helpers/formatters.js";
import {CUSTOMER_HUB_ROUTES} from "@modules/customer-hub/routes.js";

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
                "",
                "sub",
                "Email",
                1,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.path,
                        "link",
                        "Mail App",
                        1,
                        "bx bx-message-square-edit",
                        CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.permission
                    ),
                    generateSidebarItem(
                        CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.path,
                        "link",
                        "Mail Settings",
                        1,
                        "bx bx-message-square-edit",
                        CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.permission
                    ),
                ]
            ),

        ]
    ),
];
