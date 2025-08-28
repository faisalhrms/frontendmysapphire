import {generateSidebarItem} from "@helpers/formatters.js";
import {DYNAMICS_ROUTES} from "@modules/dynamics/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Dynamics',
        6,
        'bx-box',
        '',
        [
            generateSidebarItem(
                DYNAMICS_ROUTES.READ.path,
                'link',
                'Sweepers & Gards',
                1,
                'bx-laptop',
                ''
            )

        ]



    )
];
