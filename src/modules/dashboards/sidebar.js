import {generateSidebarItem} from "@helpers/formatters.js";
import {DASHBOARD_ROUTES} from "@modules/dashboards/routes.js";
import {BEIRHOLM_BI_ROUTES} from "@modules/beirholm-bi/routes.js";

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
                'Service Request',
                6,
                '',
                DASHBOARD_ROUTES.SR.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.Equipment.path,
                'link',
                'IT Assets',
                7,
                '',
                DASHBOARD_ROUTES.Equipment.permission,
            ),
                generateSidebarItem(
                    DASHBOARD_ROUTES.EQUIPMENT_AUDIT_DASHBOARD.path,
                    'link',
                    'IT Audit ',
                    8,
                    '',
                    DASHBOARD_ROUTES.Equipment.permission,
                ),
            generateSidebarItem(
                DASHBOARD_ROUTES.CEO.path,
                'link',
                'CEO ',
                9,
                '',
               DASHBOARD_ROUTES.CEO.permission,
            ),
                generateSidebarItem(
                    DASHBOARD_ROUTES.URP.path,
                    'link',
                    'User Roles Permission',
                    10,
                    '',
                    DASHBOARD_ROUTES.URP.permission
                ),
            generateSidebarItem(
                DASHBOARD_ROUTES.BeirholmBI.path,
                'link',
                'Export Data Analysis',
                11,
                '',
               DASHBOARD_ROUTES.BeirholmBI.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.SALES_DASHBOARD.path,
                'link',
                'Sales ',
                12,
                '',
                DASHBOARD_ROUTES.SALES_DASHBOARD.permission,
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.ROAD_MAP_DASHBOARD.path,
                'link',
                'RoadMap',
                13,
                '',
                DASHBOARD_ROUTES.ROAD_MAP_DASHBOARD.permission
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.ANALYTICS.path,
                'link',
                'Users Analytics',
                14,
                '',
                DASHBOARD_ROUTES.ANALYTICS.permission
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.CIVIL_DASHBOARD.path,
                'link',
                'Civil',
                15,
                '',
                DASHBOARD_ROUTES.CIVIL_DASHBOARD.permission
            ),
            generateSidebarItem(
                DASHBOARD_ROUTES.EXPORT_DATA_HEALTH.path,
                'link',
                'Export Data Health',
                16,
                '',
                DASHBOARD_ROUTES.EXPORT_DATA_HEALTH.permission
            ),
            generateSidebarItem(
                '',
                'sub',
                'Data Pulse',
                17,
                '',
                '',
                [
                        generateSidebarItem(
                            DASHBOARD_ROUTES.DATA_PULSE_DASHBOARD.path,
                            'link',
                            'E-com',
                            1,
                            '',
                            DASHBOARD_ROUTES.DATA_PULSE_DASHBOARD.permission
                        ),
                ]
            ),
        ]
    ),
];