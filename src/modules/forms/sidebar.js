import {generateSidebarItem} from "@helpers/formatters.js";
import {FORMS_ROUTES} from "@modules/forms/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Forms',
        12,
        'bi bi-file-text',
        '',
        [
            generateSidebarItem(
                FORMS_ROUTES.CREATE.path,
                "link",
                "Create",
                1,
                "bx bx-message-square-edit",
                FORMS_ROUTES.CREATE.permission,
            ),
        ]
    )
];