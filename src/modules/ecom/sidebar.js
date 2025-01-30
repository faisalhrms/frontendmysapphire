import { generateSidebarItem } from "@helpers/formatters.js";
import { ECOM_ROUTES } from "@modules/ecom/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Ecom",
        8,
        "bx bx-box",
        "",
        [
            generateSidebarItem(
                ECOM_ROUTES.READ.path,
                "link",
                "Order Booking",
                1,
                "bx bx-message-square-edit",
            ECOM_ROUTES.READ.permission,
            )
        ]
    )
];
