import { generateSidebarItem } from "@helpers/formatters.js";
import { QR_ROUTES } from "@modules/qr-generator/routes.js";

export let sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "QR Generator",
        1,
        "bx-qr",
        "",
        [
            generateSidebarItem(
                QR_ROUTES.LINK.path,
                "link",
                "QR Link",
                1,
                "bx bx-qr-scan",
                QR_ROUTES.LINK.permission
            )
        ]
    ),
];
