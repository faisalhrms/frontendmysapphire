import {PMS_ROUTES} from "@modules/project-management/routes.js";
import {generateSidebarItem} from "@helpers/formatters.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'PMS',
        2,
        'bx-bulb',
        '',
        [
            generateSidebarItem(
                PMS_ROUTES.PROJECT.READ.path,
                "link",
                "Projects",
                1,
                "bx bx-message-square-edit",
                '',
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.LIST.path,
                "link",
                "Task List",
                2,
                "bx bx-message-square-edit",
                '',
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.KANBAN.path,
                "link",
                "Task kanban Board",
                3,
                "bx bx-message-square-edit",
                '',
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.ECOM.path,
                "link",
                "E-com Deliverables",
                4,
                "bx bx-message-square-edit",
                PMS_ROUTES.TASK.ECOM.permission,
            ),
        ]
    )
];