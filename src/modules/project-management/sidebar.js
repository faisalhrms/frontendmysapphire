import { PMS_ROUTES } from "@modules/project-management/routes.js";
import {generateSidebarItem, getExcerptFromText} from "@helpers/formatters.js";
import { getWorkspaces } from "@modules/project-management/services/projectService.js";

export let sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "PMS",
        2,
        "bx-bulb",
        "",
        [
            generateSidebarItem(
                PMS_ROUTES.PROJECT.READ.path,
                "link",
                "Projects",
                1,
                "bx bx-message-square-edit",
                PMS_ROUTES.PROJECT.READ.permission
            ),
            // generateSidebarItem(
            //     "",
            //     "sub",
            //     "Workspaces",
            //     2,
            //     "",
            //     ""
            // ),
            generateSidebarItem(
                PMS_ROUTES.TASK.READ.path,
                "link",
                "Task List",
                2,
                "bx bx-message-square-edit",
                PMS_ROUTES.TASK.READ.permission
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.KANBAN.path,
                "link",
                "Task Kanban Board",
                3,
                "bx bx-message-square-edit",
                PMS_ROUTES.TASK.READ.permission
            ),
            generateSidebarItem(
                PMS_ROUTES.TASK.ECOM.path,
                "link",
                "E-com Deliverables",
                4,
                "bx bx-message-square-edit",
                PMS_ROUTES.TASK.ECOM.permission
            ),
        ]
    ),
];

// export const initializeSidebar = async () => {
//     try {
//         const workspaces = await getWorkspaces();
//         const sortedWorkspaces = workspaces.sort((a, b) => a.label.localeCompare(b.label));
//
//         const workspaceItems = sortedWorkspaces.map((workspace, index) => {
//             const projectPath = `${PMS_ROUTES.PROJECT.READ.path}?workspace=${workspace.value}&workspace_name=${encodeURIComponent(workspace.label)}`;
//             return generateSidebarItem(
//                 projectPath,
//                 "link",
//                 getExcerptFromText(workspace.label, 13),
//                 index + 2,
//                 "bx bx-message-square-edit",
//                 PMS_ROUTES.PROJECT.READ.permission
//             );
//         });
//
//         const pmsMenu = sidebarMenu.find((item) => item.title === "PMS");
//         const workspaceSub = pmsMenu?.children?.find((item) => item.title === "Workspaces");
//
//         if (workspaceSub) {
//             workspaceSub.children = [
//                 ...workspaceSub.children,
//                 ...workspaceItems,
//             ];
//         }
//     } catch (error) {
//         console.error("Failed to load dynamic project sidebar items:", error);
//     }
// };
