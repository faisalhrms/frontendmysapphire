import {generateSidebarItem} from "@helpers/formatters.js";
import {POLICIES_ROUTES} from "@modules/policies/routes.js";
import {DMS_ROUTES} from "@modules/dms/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        DMS_ROUTES.READ.path,
        'link',
        'DMS',
        15,
        'bx-purchase-tag-alt',
        DMS_ROUTES.READ.permission
    )
]