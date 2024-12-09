import {generateSidebarItem} from "@helpers/formatters.js";
import {WORKFLOW_ROUTES} from "@modules/workflow-approvals/routes.js";
export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        ' Hierarchy',
        6,
        'bi bi-diagram-2',
        '',
        [
            generateSidebarItem(
                WORKFLOW_ROUTES.READ.path,
                'link',
                'Subscription',
                1,
                '',
                WORKFLOW_ROUTES.READ.permission,
            ),

        ]
    ),
];