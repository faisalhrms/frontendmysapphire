import {generateSidebarItem} from "@helpers/formatters.js";
import {FORMS_ROUTES} from "@modules/forms/routes.js";
import {HRMS_ROUTES} from "@modules/hrms/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Dynamic Forms',
        12,
        'bi bi-file-text',
        '',
        [
            generateSidebarItem(
                FORMS_ROUTES.LIST.path,
                "link",
                "List",
                1,
                "bx bx-message-square-edit",
                FORMS_ROUTES.LIST.permission,
            ),
            generateSidebarItem(
                FORMS_ROUTES.CREATE.path,
                "link",
                "Create",
                1,
                "bx bx-message-square-edit",
                FORMS_ROUTES.CREATE.permission,
            ),
            generateSidebarItem(
                "",
                "sub",
                "Setups",
                1,
                "bx bx-target-lock",
                "",
                [

                    generateSidebarItem(
                        FORMS_ROUTES.SETUPS.APPROVAL.path,
                        "link",
                        " Approval Setup",
                        1,
                        "bx bx-message-square-edit",
                        FORMS_ROUTES.SETUPS.APPROVAL.permission
                    ),
                ]
            ),

        ]
    )
];