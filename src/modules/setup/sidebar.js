import {generateSidebarItem} from "@helpers/formatters.js";

import {SETUP_ROUTES} from "@modules/setup/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'setup',
        5,
        'ri-community-line',
        '',
        [
            generateSidebarItem(
                SETUP_ROUTES.READ.path,
                'link',
                'Company',
                5,
                'bx-laptop',

            )

        ]



    )
];
