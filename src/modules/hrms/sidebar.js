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
                "Setup",
                1,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        HRMS_ROUTES.SETUPS.YEAR.path,
                        "link",
                        "PMS Year Setup Form",
                        1,
                        "bx bx-message-square-edit",
                        HRMS_ROUTES.SETUPS.YEAR.permission
                    ),
                    generateSidebarItem(
                        HRMS_ROUTES.SETUPS.APPROVAL.path,
                        "link",
                        "PMS Approval Setup Form ",
                        1,
                        "bx bx-message-square-edit",
                        HRMS_ROUTES.SETUPS.APPROVAL.permission
                    ),
                ]
            ),
        ]
    ),
];
