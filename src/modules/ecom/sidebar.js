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
            // generateSidebarItem(
            //     ECOM_ROUTES.READ.path,
            //     "link",
            //     "Status Report",
            //     1,
            //     "bx bx-message-square-edit",
            // ECOM_ROUTES.READ.permission,
            // ),
            generateSidebarItem(
                ECOM_ROUTES.ADD.path,
                "link",
                "Analytics",
                2,
                "bx bx-message-square-edit",
                ECOM_ROUTES.ADD.permission,
            ),
            generateSidebarItem(
                ECOM_ROUTES.SFD.path,
                'link',
                'Salesforce Dashboard',
                3,
                '',
                ECOM_ROUTES.SFD.permission,
            ),
            generateSidebarItem(
                ECOM_ROUTES.OS.path,
                'link',
                'Digital Spent',
                4,
                '',
                ECOM_ROUTES.OS.permission,
            ),
            generateSidebarItem(
                ECOM_ROUTES.IR.path,
                'link',
                'Inventory Recon',
                5,
                '',
                ECOM_ROUTES.IR.permission,
            ),
            generateSidebarItem(
                ECOM_ROUTES.WR.path,
                'link',
                'Weekly Report',
                6,
                '',
                ECOM_ROUTES.WR.permission,
            ),
        ]
    )
];
