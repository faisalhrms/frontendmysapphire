import {generateSidebarItem} from "@helpers/formatters.js";
import {SRM_ROUTES} from "@modules/sr-management/routes.js"


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        ' SR Management',
        6,
        'bi bi-diagram-2',
        '',
        [
            generateSidebarItem(
                SRM_ROUTES.READ.path,
                'link',
                'SR Assignment',
                1,
                '',
              
            ),

        ]
    ),
];