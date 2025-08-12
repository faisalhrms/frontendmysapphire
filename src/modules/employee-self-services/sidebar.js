import {generateSidebarItem} from "@helpers/formatters.js"
import {SELF_SERVICES_ROUTES} from "@modules/employee-self-services/routes.js";
import {HRMS_ROUTES} from "@modules/hrms/routes.js";

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
                 '',
            ),
            generateSidebarItem(
                "",
                "sub",
                "PMS",
                6,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.LIST.path,
                        "link",
                        "Objectives",
                        1,
                        "",
                        SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.LIST.permission
                    ),
                    generateSidebarItem(
                        SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.TEAM.path,
                        "link",
                        "Team Objectives",
                        2,
                        "",
                        SELF_SERVICES_ROUTES.SERVICES.OBJECTIVES.TEAM.permission
                    ),
                ]
            )

            ]
    )
]

