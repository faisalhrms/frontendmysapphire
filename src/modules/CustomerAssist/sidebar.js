import {generateSidebarItem} from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {RECRUITMENTS_ROUTES} from "@modules/recruitment/routes.js";
import {DAILYREPORT_ROUTES} from "@modules/DailyReport/routes.js";
import {CUSTOMER_ASSIST_ROUTES} from "@modules/CustomerAssist/routes.js";

export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Customer Assist',
        8,
        'bx-user-voice',
        '',
        [ generateSidebarItem(
            CUSTOMER_ASSIST_ROUTES.READ.path,
            'link',
            'Customer',
            1,
            'bx-laptop',
            ''
        ),


        ]



    )
];
