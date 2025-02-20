import {generateSidebarItem} from "@helpers/formatters.js"
import {SELF_SERVICES_ROUTES} from "@modules/employee-self-services/routes.js";
import {PMS_ROUTES} from "@modules/project-management/routes.js";

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
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.path,
                'link',
                'Discount Card',
                3,
                ''
            ),
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.path,
                'link',
                'Digital Profile',
                4,
                ''
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.KANBAN.path,
                'link',
                'Task Manager',
                5,
                ''
            )
            ]
    )
]

