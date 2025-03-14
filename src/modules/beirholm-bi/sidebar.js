import {generateSidebarItem} from "@helpers/formatters.js";
import {BEIRHOLM_BI_ROUTES} from "@modules/beirholm-bi/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        '',
        'sub',
        'Beirholm BI',
        8,
        'bx bx-data',
        '',
        [
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.path,
                'link',
                'Data Sanitization',
                1,
                '',
                BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission
            ),
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.path,
                'link',
                'Field Definitions',
                2,
                '',
                BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.permission
            ),
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.path,
                'link',
                'Data Correction Rules',
                3,
                '',
                BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.permission
            ),
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.path,
                'link',
                'Data Correction Patterns',
                4,
                '',
                BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.permission
            ),
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.path,
                'link',
                'Competitor Analysis',
                4,
                '',
                BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.permission
            ),
            generateSidebarItem(
                BEIRHOLM_BI_ROUTES.CHAT_BOT_READ.path,
                'link',
                'ChatBot',
                5,
                '',
                BEIRHOLM_BI_ROUTES.CHAT_BOT_READ.permission
            ),
        ]
    )
];
