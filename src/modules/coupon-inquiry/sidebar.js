import {generateSidebarItem} from "@helpers/formatters.js";
import {COUPON_INQUIRY_ROUTES} from "./routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        COUPON_INQUIRY_ROUTES.READ.path,
        'link',
        'Coupon Inquiry',
         17,
        'bx-laptop',
       COUPON_INQUIRY_ROUTES.READ.permission
     )
];
