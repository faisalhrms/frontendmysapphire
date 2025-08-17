import {generateSidebarItem} from "@helpers/formatters.js";
import {HRMS_ROUTES} from "@modules/hrms/routes.js";

export let sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "HRMS",
        13,
        "bx-group",
        "",
        [
            generateSidebarItem(
                "",
                "sub",
                "Setups",
                1,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        HRMS_ROUTES.SETUPS.YEAR.path,
                        "link",
                        "PAS Year Setup",
                        1,
                        "bx bx-message-square-edit",
                        HRMS_ROUTES.SETUPS.YEAR.permission
                    ),
                    generateSidebarItem(
                        HRMS_ROUTES.SETUPS.APPROVAL.path,
                        "link",
                        "PAS Approval Setup",
                        1,
                        "bx bx-message-square-edit",
                        HRMS_ROUTES.SETUPS.APPROVAL.permission
                    ),
                ]
            ),
            generateSidebarItem(
                "",
                "sub",
                "Management",
                2,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        HRMS_ROUTES.MANAGEMENT.OBJECTIVE.path,
                        "link",
                        "Objective",
                        1,
                        "bx bx-message-square-edit",
                        HRMS_ROUTES.MANAGEMENT.OBJECTIVE.permission
                    )
                ]
            )

        ]
    ),
];
