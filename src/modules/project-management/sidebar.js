import {PMS_ROUTES} from "@modules/project-management/routes.js";
import {generateSidebarItem} from "@helpers/formatters.js";

export const sidebarMenu = [
    generateSidebarItem(
        PMS_ROUTES.PROJECT.READ.path,
        'link',
        'Project',
        2,
        'bx-bulb'

    )
];