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
                APPROVAL_ROUTES.OBJECTIVE.permission,
            ),
            generateSidebarItem(
                APPROVAL_ROUTES.FORM.path,
                'link',
                'Dynamic Form',
                3,
                '',
                APPROVAL_ROUTES.FORM.permission,
            ),
            generateSidebarItem(
                "",
                "sub",
                "Setups",
                4,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        APPROVAL_ROUTES.SETUP.TYPE.READ.path,
                        "link",
                        " Approval Type",
                        1,
                        "bx bx-message-square-edit",
                        APPROVAL_ROUTES.SETUP.TYPE.READ.permission
                    ),
                    generateSidebarItem(
                        APPROVAL_ROUTES.SETUP.HIERARCHY.READ.path,
                        "link",
                        " Approval Hierarchy",
                        2,
                        "bx bx-message-square-edit",
                        APPROVAL_ROUTES.SETUP.HIERARCHY.READ.permission
                    ),
                    generateSidebarItem(
                        APPROVAL_ROUTES.SETUP.HIERARCHY.APPROVERS.path,
                        "link",
                        " Hierarchy Approvers",
                        3,
                        "bx bx-message-square-edit",
                        APPROVAL_ROUTES.SETUP.HIERARCHY.APPROVERS.permission
                    ),
                ]
            ),
        ]
    ),
];