import {generateSidebarItem} from "@helpers/formatters.js";
import {DIGITAL_PROFILES_ROUTES} from "@modules/digital-profiles/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        DIGITAL_PROFILES_ROUTES.READ.path,
        'link',
        'Digital Profiles',
        5,
        'bx bx-id-card',
        DIGITAL_PROFILES_ROUTES.READ.permission,
    )
];