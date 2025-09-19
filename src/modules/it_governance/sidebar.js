import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {APPROVAL_ROUTES} from "@modules/approvals/routes.js";
import {IT_GOVERNANCE_ROUTES} from "@modules/it_governance/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'IT Governance',
        6,
        'bx-shield-quarter',
        '',
        [
            generateSidebarItem(
                IT_GOVERNANCE_ROUTES.READ.path,
                'link',
                'Service Level (A)',
                1,
                'bx-laptop',
                IT_GOVERNANCE_ROUTES.READ.permission
            ),
            generateSidebarItem(
                IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.READ.path,
                'link',
                'Application Universe',
                1,
                'bx-laptop',
                IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.READ.permission            ),
            generateSidebarItem(
                IT_GOVERNANCE_ROUTES.WARRANTY.READ.path,
                'link',
                'Warranty',
                1,
                'bx-laptop',
                IT_GOVERNANCE_ROUTES.WARRANTY.READ.permission
            ),




        ]



    )
];
