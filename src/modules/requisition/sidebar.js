import {generateSidebarItem} from "@helpers/formatters.js";
import {REQUISITION_ROUTES} from "@modules/requisition/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Requisition',
        15,
        'bx-briefcase-alt-2',
        '',
        [
            generateSidebarItem(
                REQUISITION_ROUTES.JOB_DESCRIPTION.READ.path,
                'link',
                'Job Desc',
                1,
                '',
               ''
            ),
            generateSidebarItem(
                REQUISITION_ROUTES.REQUISITION.READ.path,
                'link',
                'Requisition',
                2,
                '',
                ''
            ),




        ]



    )
];
