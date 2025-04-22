import {generateSidebarItem} from "@helpers/formatters.js";
import {SRM_ROUTES} from "@modules/sr-management/routes.js";
import {EMAIL_MANAGEMENT_ROUTE} from "@modules/email-management/routes.js";

export const sidebarMenu=[
    generateSidebarItem(
        '',
        'sub',
        ' User Management',
        5,
        'bi bi-people',
        '',
        [
            generateSidebarItem(
                EMAIL_MANAGEMENT_ROUTE.READ.path,
                'link',
                'User List',
                1,
                '',
                EMAIL_MANAGEMENT_ROUTE.READ.permission,
            )]
    )
]