import {generateSidebarItem} from "@helpers/formatters.js";
import {REPLENISHMENT_ROUTES} from "@modules/replenishment/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        REPLENISHMENT_ROUTES.READ.path,
        'link',
        'Replenishment',
        6,
        'bx-package',
        REPLENISHMENT_ROUTES.READ.permission
    ),
];