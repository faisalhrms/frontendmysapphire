import {generateSidebarItem} from "@helpers/formatters.js";
import {DUMS_ROUTES} from "./routes.js"

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Dumps",
        11,
        "bx bx-data",
        "",
        [
            generateSidebarItem(
                DUMS_ROUTES.CREATE.path,
                'link',
                'Oci',
                2,
                '',
                DUMS_ROUTES.CREATE.permission,
            ),
            generateSidebarItem(
                DUMS_ROUTES.READ.path,
                'link',
                'Oms',
                3,
                '',
                DUMS_ROUTES.READ.permission,
            ),

        ]
    )
];
