import { USER_ROUTES } from "@modules/user/routes.js";
import { ACCESS_CONTROL_ROUTES } from "@modules/access-control/routes.js";
import {generateSidebarItem} from "@helpers/formatters.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Access Control',
        5,
        'bx-cog',
        '',
        [
            generateSidebarItem(
                USER_ROUTES.READ.path,
                'link',
                'User',
                1,
                '',
                USER_ROUTES.READ.permission
            ),
            generateSidebarItem(
                ACCESS_CONTROL_ROUTES.ROLE.READ.path,
                'link',
                'Role',
                2,
                '',
                ACCESS_CONTROL_ROUTES.ROLE.READ.permission
            ),
            generateSidebarItem(
                ACCESS_CONTROL_ROUTES.PERMISSION.READ.path,
                'link',
                'Permission',
                3,
                '',
                ACCESS_CONTROL_ROUTES.PERMISSION.READ.permission
            ),
        ]
    ),
];
