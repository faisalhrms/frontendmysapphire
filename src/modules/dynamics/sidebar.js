import {generateSidebarItem} from "@helpers/formatters.js";
import {DYNAMICS_ROUTES} from "@modules/dynamics/routes.js";
import {HRMS_ROUTES} from "@modules/hrms/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Dynamics',
        6,
        'bx-clipboard',
        '',
        [
            generateSidebarItem(
                "",
                "sub",
                "Forms",
                1,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        DYNAMICS_ROUTES.READ.path,
                        "link",
                        "Sweepers & Guard",
                        1,
                        "bx bx-message-square-edit",
                        ''
                    )
                ]
            )
        ]



    )
];
