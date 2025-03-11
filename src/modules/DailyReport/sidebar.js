import { generateSidebarItem } from "@helpers/formatters.js";
import {DAILYREPORT_ROUTES} from "@modules/DailyReport/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "DailyReport",
        9,
        "bx bx-box",
        "",
        [
            generateSidebarItem(
                DAILYREPORT_ROUTES.READ.path,
                "link",
                "Daily Sales Report",
                1,
                "bx bx-message-square-edit",
                DAILYREPORT_ROUTES.READ.permission,
            )

        ]
    )
];
