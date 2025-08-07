import {generateSidebarItem} from "@helpers/formatters.js"
import {SELF_SERVICES_ROUTES} from "@modules/employee-self-services/routes.js";

export const sidebarMenu = [
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
                "bx bx-message-square-edit",
                SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.permission,
            ),
              generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.READ.path,
                'link',
                'Service Request',
                2,
                  "bx bx-message-square-edit",
                  SELF_SERVICES_ROUTES.SERVICES.READ.permission,
            ),
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.path,
                'link',
                'Discount Card',
                3,
                "bx bx-message-square-edit",
                SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.permission,
            ),
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.path,
                'link',
                'Digital Profile',
                "bx bx-message-square-edit",
                4,
                SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.permission,
            ),
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.POLICIES.path,
                'link',
                'Policies',
                "bx-book-bookmark",
                5,
                 SELF_SERVICES_ROUTES.SERVICES.POLICIES.permission,
            ),
            generateSidebarItem(
                SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.path,
                'link',
                'Objectives',
                "bx-book-bookmark",
                6,
                SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.permission,
            )

            ]
    )
]

