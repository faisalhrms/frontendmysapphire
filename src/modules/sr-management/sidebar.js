import {generateSidebarItem} from "@helpers/formatters.js";
import {SRM_ROUTES} from "@modules/sr-management/routes.js"


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        ' SR Management',
        5,
        'bi bi-bezier',
        '',
        [
            generateSidebarItem(
                SRM_ROUTES.READ.path,
                'link',
                'SR Assignment',
                1,
                '',
            SRM_ROUTES.READ.permission,
    ),

]
),
]
;