import {generateSidebarItem} from "@helpers/formatters.js";
import { DIGITAL_SIGNATURES_ROUTES } from '../digital-signatures/routes';


export const sidebarMenu = [
    generateSidebarItem(

        DIGITAL_SIGNATURES_ROUTES.READ.path,
        'link',
        'Digital Signatures',
        5,
       'bx bx-message-square-edit',
      
        

    )
];