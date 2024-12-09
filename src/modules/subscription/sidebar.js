import {SUBSCRIPTION_ROUTES} from "@modules/subscription/routes.js";
import {generateSidebarItem} from "@helpers/formatters.js";

export const sidebarMenu = [
    generateSidebarItem(
        SUBSCRIPTION_ROUTES.READ.path,
        'link',
        'Subscription',
        3,
        'bx-credit-card',
        SUBSCRIPTION_ROUTES.READ.permission
    )
];