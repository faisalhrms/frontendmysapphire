import {generateSidebarItem} from "@helpers/formatters.js";
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Dashboards',
        1,
        'bx-home',
        '',
        [
            generateSidebarItem(
                DASHBOARD_ROUTES.SUBSCRIPTION.path,
                'link',
                'Subscription',
                1,
                '',
                DASHBOARD_ROUTES.SUBSCRIPTION.permission
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.CS.path,
                'link',
                'Cyber Security',
                2,
                '',
                DASHBOARD_ROUTES.CS.permission
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.PROJECT.path,
                'link',
                'Project Management',
                3,
                '',
                DASHBOARD_ROUTES.PROJECT.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.BI.path,
                'link',
                'Business Intelligence',
                4,
                '',
                DASHBOARD_ROUTES.BI.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.CIO.path,
                'link',
                'Chief Information Officer',
                5,
                '',
                DASHBOARD_ROUTES.CIO.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.SR.path,
                'link',
                'SR Dashboard',
                6,
                '',
                DASHBOARD_ROUTES.SR.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.Equipment.path,
                'link',
                'Equipment Dashboard',
                7,
                '',
                DASHBOARD_ROUTES.Equipment.permission,
            )
        ]
    ),
];