import {generateSidebarItem} from "@helpers/formatters.js"
import {SELF_SERVICES_ROUTES} from "@modules/employee-self-services/routes.js";
export const sidebarMenu=[
    generateSidebarItem(
        '',
        'sub',
        'ESS',
        2,
        'bi bi-wallet',
        '',
        [
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.path,
                'link',
                'Work Desk',
                1,
                '',
            ),
              generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.READ.path,
                'link',
                'Service Request',
                2,
                '',
            ),
            ]
    )
]

