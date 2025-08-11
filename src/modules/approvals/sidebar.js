import {generateSidebarItem} from "@helpers/formatters.js";
import {APPROVAL_ROUTES} from "@modules/approvals/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Approvals',
        4,
        'bx-task',
          '',
        [
            generateSidebarItem(
                APPROVAL_ROUTES.TASK.path,
                'link',
                'Task',
                1,
                '',
                APPROVAL_ROUTES.TASK.permission,
            ),
            generateSidebarItem(
                APPROVAL_ROUTES.OBJECTIVE.path,
                'link',
                'Objectives',
                2,
                '',
                '',
            ),

        ]
    ),
];