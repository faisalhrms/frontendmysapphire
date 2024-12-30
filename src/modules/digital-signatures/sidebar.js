import {generateSidebarItem} from "@helpers/formatters.js";
import { DIGITAL_SIGNATURES_ROUTES } from '../digital-signatures/routes';


export const sidebarMenu = [
    generateSidebarItem(

        DIGITAL_SIGNATURES_ROUTES.READ.path,
        'link',
        'Digital Signatures',
        5,
        'ri-sketching"',
        // DIGITAL_SIGNATURES_ROUTES.READ.permission

    )
];