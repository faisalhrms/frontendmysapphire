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
                HRMS_ROUTES.SETUPS.YEAR.path,
                "link",
                "PMS Year Setup Form",
                1,
                "bx bx-message-square-edit",
                HRMS_ROUTES.SETUPS.YEAR.permission
            ),
        ]

    ),
];