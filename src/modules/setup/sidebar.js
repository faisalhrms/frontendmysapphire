import { generateSidebarItem } from "@helpers/formatters.js";
import { SETUP_ROUTES } from "@modules/setup/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Setup',
        5,
        'ri-community-line',
        '',
        [
            generateSidebarItem(
                SETUP_ROUTES.COMPANY.READ.path,
                'link',
                'Company',
                5,
                'bx-laptop',
                SETUP_ROUTES.COMPANY.READ.permission
            ),
            generateSidebarItem(
                SETUP_ROUTES.SR_TYPE.READ.path,
                'link',
                'Sr Type',
                5,
                'bx-laptop',
                SETUP_ROUTES.COMPANY.READ.permission

            )
        ]
    )
];
