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
<<<<<<< HEAD
              
=======
>>>>>>> 637cd0620fc6624b4a684c6ea66fd9d4b7f7bbdf
            ),

        ]
    ),
];