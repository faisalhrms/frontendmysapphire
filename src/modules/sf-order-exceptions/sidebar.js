import { generateSidebarItem } from "@helpers/formatters.js";
import {SF_ORDER_EXCEPTION_ROUTES} from "@modules/sf-order-exceptions/routes.js";
export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Sales Force",
        8,
        "bi bi-cloud",
        "",
        [
            generateSidebarItem(
                SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.path,
                "link",
                "Order Exceptions",
                1,
                "bx bx-message-square-edit",
                SF_ORDER_EXCEPTION_ROUTES.ORDER_EXCEPTIONS.permission,
            ),
        ]
    )
];
