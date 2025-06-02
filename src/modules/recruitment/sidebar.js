import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {RECRUITMENTS_ROUTES} from "@modules/recruitment/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Recruitment',
        7,
        'bx-search-alt',
        '',
        [ generateSidebarItem(
            RECRUITMENTS_ROUTES.READ.path,
            'link',
            'Applicant List',
            1,
            'bx-laptop',
            ''
        ),


        ]



    )
];
