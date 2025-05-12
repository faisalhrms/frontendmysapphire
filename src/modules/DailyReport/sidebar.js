import { generateSidebarItem } from "@helpers/formatters.js";
import {DAILYREPORT_ROUTES, OFFLINE_STORE_PERFORMANCE_ROUTE} from "@modules/DailyReport/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "Retail",
        9,
        "bi bi-collection",
        "",
        [
            generateSidebarItem(
                DAILYREPORT_ROUTES.READ.path,
                "link",
                "Daily Sales Report",
                1,
                "bx bx-message-square-edit",
                DAILYREPORT_ROUTES.READ.permission,
            ),
            generateSidebarItem(
                DAILYREPORT_ROUTES.CREATE.path,
                "link",
                "Comparative Sales Report",
                3,
                "bx bx-message-square-edit",
                DAILYREPORT_ROUTES.CREATE.permission,
            ),
            generateSidebarItem(
                OFFLINE_STORE_PERFORMANCE_ROUTE.READ.path,
                "link",
                "Offline Store Report",
                2,
                "bx bx-message-square-edit",
                OFFLINE_STORE_PERFORMANCE_ROUTE.READ.permission,
            ),


        ]
    )
];
