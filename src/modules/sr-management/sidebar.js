import {generateSidebarItem} from "@helpers/formatters.js";
import {SRM_ROUTES} from "@modules/sr-management/routes.js"
import {SLA_SETUP_ROUTES} from "@modules/sr-management/sla-setup/routes.js";


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
                generateSidebarItem(
                    SLA_SETUP_ROUTES.READ.path,
                    'link',
                    'SLA Setup',
                    2,
                    '',
                    SLA_SETUP_ROUTES.READ.permission,
                ),
            ],
        ),
    ]
;