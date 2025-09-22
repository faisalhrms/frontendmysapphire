import {generateSidebarItem} from "@helpers/formatters.js";
import {CIVIL_ROUTES} from "@modules/civil_mgmt/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Civil Management',
        4,
        'bx-building',
          '',
        [
            generateSidebarItem(
                CIVIL_ROUTES.SITE.READ.path,
                'link',
                'Site',
                1,
                '',
                CIVIL_ROUTES.SITE.READ.permission,
            ),
            generateSidebarItem(
                CIVIL_ROUTES.PROJECT.READ.path,
                'link',
                'Project',
                2,
                '',
                CIVIL_ROUTES.PROJECT.READ.permission,
            ),
            generateSidebarItem(
                CIVIL_ROUTES.PROJECT.DRAWING.READ.path,
                'link',
                'Drawing',
                3,
                '',
                CIVIL_ROUTES.PROJECT.DRAWING.READ.permission,
            ),
            generateSidebarItem(
                CIVIL_ROUTES.BOQ.READ.path,
                'link',
                'Boq',
                4,
                '',
                CIVIL_ROUTES.BOQ.READ.permission,
            ),
            generateSidebarItem(
                CIVIL_ROUTES.TENDER.READ.path,
                'link',
                'Tender',
                5,
                '',
                CIVIL_ROUTES.TENDER.READ.permission,
            ),
            generateSidebarItem(
                "",
                "sub",
                "Vendor",
                6,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        CIVIL_ROUTES.VENDOR.TENDER.path,
                        "link",
                        " Open Tenders",
                        1,
                        "bx bx-message-square-edit",
                        CIVIL_ROUTES.VENDOR.TENDER.permission
                    ),
                ]
            ),
            generateSidebarItem(
                "",
                "sub",
                "Setups",
                7,
                "bx bx-target-lock",
                "",
                [
                    generateSidebarItem(
                        CIVIL_ROUTES.SETUP.ITEM.path,
                        "link",
                        " Item",
                        1,
                        "bx bx-message-square-edit",
                        CIVIL_ROUTES.SETUP.ITEM.permission
                    ),
                ]
            ),
        ]
    ),
];