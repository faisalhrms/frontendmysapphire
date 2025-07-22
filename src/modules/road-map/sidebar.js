import { generateSidebarItem } from "@helpers/formatters.js";
import {CHAIN_DESIGNER, ROADMAP_SETUP} from "@modules/road-map/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'RoadMap Sourcing',
        13,
        'bi bi-signpost',
        '',
        [
            generateSidebarItem(
                CHAIN_DESIGNER.READ.path,
                'link',
                'Chain Designer',
                1,
                "bx bx-message-square-edit",
                CHAIN_DESIGNER.READ.permission
            ),
            generateSidebarItem(
                ROADMAP_SETUP.READ.path,
                'link',
                'RoadMap Setup',
                1,
                "bx bx-message-square-edit",
                ROADMAP_SETUP.READ.permission
            ),
        ]
    )
];
