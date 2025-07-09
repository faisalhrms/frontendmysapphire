import {generateSidebarItem} from "@helpers/formatters.js";
import {POLICIES_ROUTES} from "@modules/policies/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        POLICIES_ROUTES.READ.path,
        'link',
        'Policies',
        3,
        'bx-book-bookmark',
        POLICIES_ROUTES.READ.permission
    )
]