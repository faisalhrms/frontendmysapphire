import {generateSidebarItem} from "@helpers/formatters.js";
import {DIGITAL_SIGNATURES_ROUTES} from '../digital-signatures/routes';
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        DIGITAL_SIGNATURES_ROUTES.READ.path,
        'link',
        'Digital Signatures',
        5,
        'bx bx-message-square-edit',
        DIGITAL_SIGNATURES_ROUTES.READ.permission,
    )
];