import {generateSidebarItem} from "@helpers/formatters.js";
import {LMS_ROUTES} from "@modules/lms/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        LMS_ROUTES.CREATE.path,
        'link',
        'lms',
        1,
        'bx-file-blank',
    )
];

