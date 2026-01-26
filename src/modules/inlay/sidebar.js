import {generateSidebarItem} from "@helpers/formatters.js";
import {POLICIES_ROUTES} from "@modules/policies/routes.js";
import {INLAY_ROUTES} from "@modules/inlay/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        INLAY_ROUTES.READ.path,
        'link',
        'Inlay',
        15,
        'bx-book-bookmark',
        INLAY_ROUTES.READ.permission
    )
]