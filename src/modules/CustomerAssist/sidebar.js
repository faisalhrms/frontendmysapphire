import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {RECRUITMENTS_ROUTES} from "@modules/recruitment/routes.js";
import {DAILYREPORT_ROUTES} from "@modules/DailyReport/routes.js";
import {CUSTOMER_ASSIST_ROUTES} from "@modules/CustomerAssist/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'We Care',
        8,
        'bx-user-voice',
        CUSTOMER_ASSIST_ROUTES.READ.permission,
        [
            generateSidebarItem(
                CUSTOMER_ASSIST_ROUTES.READ.path,
                'link',
                'Customer Assist',
                1,
                'bx-user-voice',
                CUSTOMER_ASSIST_ROUTES.READ.permission
            )
        ]



    )
];
