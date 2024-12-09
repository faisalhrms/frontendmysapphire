import {MEDIA_ROUTES} from "@modules/media/routes.js";
import {generateSidebarItem} from "@helpers/formatters.js";

export const sidebarMenu = [
    generateSidebarItem(
        MEDIA_ROUTES.READ.path,
        'link',
        'Media',
        3,
        'bx-file-blank',
    )
];