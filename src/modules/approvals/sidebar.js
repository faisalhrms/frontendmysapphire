import { generateSidebarItem } from "@helpers/formatters.js";
import { APPROVAL_ROUTES } from "@modules/approvals/routes.js";
import { REQUISITION_ROUTES } from "../requisition/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Approvals",
        4,
        "bx-task",
        "",
        [
            generateSidebarItem(
                APPROVAL_ROUTES.TASK.path,
                "link",
                "Task",
                1,
                "",
                APPROVAL_ROUTES.TASK.permission
            ),
            generateSidebarItem(
                APPROVAL_ROUTES.OBJECTIVE.path,
                "link",
                "Objectives",
                2,
                "",
                APPROVAL_ROUTES.OBJECTIVE.permission
            ),

            // ✅ NEW: Single requisition approval inbox (general)
            // Use whichever route you decided:
            // Option A: Approvals module route (recommended)
            generateSidebarItem(
                APPROVAL_ROUTES.REQUISITION.path,
                "link",
                "Requisition Approvals",
                3,
                "",
                 ''
            ),


            generateSidebarItem(
                APPROVAL_ROUTES.FORM.path,
                "link",
                "Dynamic Form",
                4,
                "",
                APPROVAL_ROUTES.FORM.permission
            ),
            generateSidebarItem(
                APPROVAL_ROUTES.GLOBAL.path,
                "link",
                "Global",
                5,
                "",
                APPROVAL_ROUTES.GLOBAL.permission
            ),

            generateSidebarItem(
                "",
                "sub",
                "Setups",
                6,
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
